-- Cosmic Card Supabase Schema
-- Run `node scripts/generate-card-library.mjs` and then execute
-- `supabase/seeds/cards.seed.sql` after this schema is applied.

create extension if not exists "uuid-ossp";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table decks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  cover_image_key text,
  theme_key text,
  is_active boolean not null default true,
  is_premium boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create trigger decks_set_updated_at
before update on decks
for each row
execute function set_updated_at();

create table cards (
  id uuid primary key default uuid_generate_v4(),
  deck_id uuid references decks(id),
  slug text not null unique,
  card_no integer not null,
  title text not null,
  short_message text not null,
  full_message text not null,
  category text not null,
  energy_tag text not null,
  image_key text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create unique index cards_card_no_key on cards(card_no);
create index idx_cards_active_card_no on cards(is_active, card_no);
create index idx_cards_category_active on cards(category, is_active);
create index idx_cards_deck_active on cards(deck_id, is_active);

create trigger cards_set_updated_at
before update on cards
for each row
execute function set_updated_at();

create table profiles (
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

create trigger profiles_set_updated_at
before update on profiles
for each row
execute function set_updated_at();

create table anonymous_devices (
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

create trigger anonymous_devices_set_updated_at
before update on anonymous_devices
for each row
execute function set_updated_at();

create table user_cards (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  profile_id uuid references profiles(id) on delete set null,
  anonymous_device_id uuid references anonymous_devices(id) on delete set null,
  card_id uuid references cards(id) not null,
  deck_id uuid references decks(id) on delete set null,
  revealed_at timestamp with time zone not null default now(),
  local_date date not null,
  reveal_type text not null default 'standard',
  interpretation_mode text not null default 'standard',
  source_context jsonb not null default '{}'::jsonb,
  share_theme_used text,
  is_favorite boolean not null default false,
  favorited_at timestamp with time zone,
  journal_note text,
  journal_updated_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create index idx_user_cards_user_revealed_at on user_cards(user_id, revealed_at desc);
create index idx_user_cards_profile_revealed_at on user_cards(profile_id, revealed_at desc);
create index idx_user_cards_anonymous_revealed_at on user_cards(anonymous_device_id, revealed_at desc);
create index idx_user_cards_user_favorites on user_cards(user_id, is_favorite, revealed_at desc);
create index idx_user_cards_deck_reveal_type on user_cards(deck_id, reveal_type, revealed_at desc);

create table products (
  id uuid primary key default uuid_generate_v4(),
  product_key text not null unique,
  name text not null,
  provider text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create trigger products_set_updated_at
before update on products
for each row
execute function set_updated_at();

create table subscriptions (
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

create trigger subscriptions_set_updated_at
before update on subscriptions
for each row
execute function set_updated_at();

create table entitlements (
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

create trigger entitlements_set_updated_at
before update on entitlements
for each row
execute function set_updated_at();

create table card_interpretation_templates (
  id uuid primary key default uuid_generate_v4(),
  deck_id uuid references decks(id) on delete cascade,
  category text,
  tone_key text not null default 'reflective',
  prompt_template text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create trigger card_interpretation_templates_set_updated_at
before update on card_interpretation_templates
for each row
execute function set_updated_at();

create table ai_interpretations (
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

create index idx_ai_interpretations_user_card on ai_interpretations(user_card_id, interpretation_mode, created_at desc);

create table user_ai_requests (
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
