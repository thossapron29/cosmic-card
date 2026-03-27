-- Migration: Phase 3 growth foundations
-- Adds multi-deck metadata, auth/profile foundations, entitlements, AI tables,
-- and richer reveal ownership metadata.

create extension if not exists "uuid-ossp";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

alter table decks
  add column if not exists cover_image_key text,
  add column if not exists theme_key text,
  add column if not exists is_premium boolean not null default false,
  add column if not exists sort_order integer not null default 0;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_deck_slug text,
  selected_theme text,
  onboarding_completed boolean not null default false,
  locale text,
  timezone text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
before update on profiles
for each row
execute function set_updated_at();

create table if not exists anonymous_devices (
  id uuid primary key default uuid_generate_v4(),
  anonymous_id text not null unique,
  preferred_deck_slug text,
  selected_theme text,
  locale text,
  timezone text,
  last_seen_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

drop trigger if exists anonymous_devices_set_updated_at on anonymous_devices;
create trigger anonymous_devices_set_updated_at
before update on anonymous_devices
for each row
execute function set_updated_at();

insert into anonymous_devices (anonymous_id, last_seen_at)
select user_id, max(revealed_at)
from user_cards
where user_id is not null
  and trim(user_id) <> ''
group by user_id
on conflict (anonymous_id) do update
set last_seen_at = excluded.last_seen_at;

alter table user_cards
  add column if not exists profile_id uuid references profiles(id) on delete set null,
  add column if not exists anonymous_device_id uuid references anonymous_devices(id) on delete set null,
  add column if not exists deck_id uuid references decks(id) on delete set null,
  add column if not exists interpretation_mode text not null default 'standard',
  add column if not exists source_context jsonb not null default '{}'::jsonb,
  add column if not exists share_theme_used text;

update user_cards uc
set anonymous_device_id = ad.id
from anonymous_devices ad
where uc.user_id = ad.anonymous_id
  and uc.anonymous_device_id is null;

update user_cards uc
set deck_id = c.deck_id
from cards c
where uc.card_id = c.id
  and uc.deck_id is null;

create index if not exists idx_user_cards_profile_revealed_at on user_cards(profile_id, revealed_at desc);
create index if not exists idx_user_cards_anonymous_revealed_at on user_cards(anonymous_device_id, revealed_at desc);
create index if not exists idx_user_cards_deck_reveal_type on user_cards(deck_id, reveal_type, revealed_at desc);
create index if not exists idx_cards_deck_active on cards(deck_id, is_active);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  product_key text not null unique,
  name text not null,
  provider text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
before update on products
for each row
execute function set_updated_at();

create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  provider text,
  provider_customer_id text,
  provider_subscription_id text unique,
  status text not null default 'inactive',
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

drop trigger if exists subscriptions_set_updated_at on subscriptions;
create trigger subscriptions_set_updated_at
before update on subscriptions
for each row
execute function set_updated_at();

create table if not exists entitlements (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  entitlement_key text not null,
  source text not null default 'manual',
  active boolean not null default true,
  expires_at timestamp with time zone,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (profile_id, entitlement_key)
);

drop trigger if exists entitlements_set_updated_at on entitlements;
create trigger entitlements_set_updated_at
before update on entitlements
for each row
execute function set_updated_at();

create table if not exists card_interpretation_templates (
  id uuid primary key default uuid_generate_v4(),
  deck_id uuid references decks(id) on delete cascade,
  category text,
  tone_key text not null default 'reflective',
  prompt_template text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

drop trigger if exists card_interpretation_templates_set_updated_at on card_interpretation_templates;
create trigger card_interpretation_templates_set_updated_at
before update on card_interpretation_templates
for each row
execute function set_updated_at();

create table if not exists ai_interpretations (
  id uuid primary key default uuid_generate_v4(),
  user_card_id uuid not null references user_cards(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  anonymous_device_id uuid references anonymous_devices(id) on delete set null,
  interpretation_mode text not null default 'gentle',
  provider text,
  status text not null default 'completed',
  input_snapshot jsonb not null default '{}'::jsonb,
  output_text text,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_ai_interpretations_user_card
  on ai_interpretations(user_card_id, interpretation_mode, created_at desc);

create table if not exists user_ai_requests (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete set null,
  anonymous_device_id uuid references anonymous_devices(id) on delete set null,
  user_card_id uuid references user_cards(id) on delete set null,
  request_type text not null,
  provider text,
  status text not null default 'pending',
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamp with time zone not null default now()
);

insert into products (product_key, name, provider)
values ('premium-membership', 'Premium Membership', 'stripe')
on conflict (product_key) do nothing;
