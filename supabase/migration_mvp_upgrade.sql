-- Migration: Production MVP upgrade
-- Keeps unlimited reveals and upgrades data model for correctness/scalability.

create extension if not exists "uuid-ossp";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists decks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

insert into decks (name, slug, description)
values ('Cosmic Core', 'cosmic-core', 'Default Cosmic Card deck')
on conflict (slug) do nothing;

alter table cards
  add column if not exists slug text,
  add column if not exists card_no integer,
  add column if not exists category text,
  add column if not exists energy_tag text,
  add column if not exists image_key text,
  add column if not exists is_active boolean not null default true,
  add column if not exists deck_id uuid references decks(id),
  add column if not exists updated_at timestamp with time zone not null default now();

update cards
set slug = lower(trim(both '-' from regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')))
where slug is null;

with numbered_cards as (
  select id, row_number() over (order by created_at asc, id asc) as generated_card_no
  from cards
)
update cards
set card_no = numbered_cards.generated_card_no
from numbered_cards
where cards.id = numbered_cards.id
  and cards.card_no is null;

update cards
set deck_id = (select id from decks where slug = 'cosmic-core')
where deck_id is null;

alter table cards
  alter column slug set not null,
  alter column card_no set not null;

create unique index if not exists cards_slug_key on cards(slug);
create unique index if not exists cards_card_no_key on cards(card_no);
create index if not exists idx_cards_active_card_no on cards(is_active, card_no);

drop trigger if exists cards_set_updated_at on cards;
create trigger cards_set_updated_at
before update on cards
for each row
execute function set_updated_at();

drop trigger if exists decks_set_updated_at on decks;
create trigger decks_set_updated_at
before update on decks
for each row
execute function set_updated_at();

alter table user_cards
  add column if not exists revealed_at timestamp with time zone,
  add column if not exists local_date date,
  add column if not exists reveal_type text not null default 'standard';

update user_cards
set revealed_at = coalesce(revealed_at, created_at, now());

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'user_cards'
      and column_name = 'revealed_date'
  ) then
    execute '
      update user_cards
      set local_date = coalesce(local_date, revealed_date)
    ';
  end if;
end $$;

update user_cards
set local_date = coalesce(local_date, (revealed_at at time zone 'UTC')::date);

alter table user_cards
  alter column revealed_at set not null,
  alter column local_date set not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'user_cards'
      and column_name = 'revealed_date'
  ) then
    alter table user_cards drop column revealed_date;
  end if;
end $$;

alter table user_cards drop constraint if exists unique_user_reveal;
alter table user_cards drop constraint if exists user_cards_user_id_revealed_date_key;

create index if not exists idx_user_cards_user_revealed_at on user_cards(user_id, revealed_at desc);
