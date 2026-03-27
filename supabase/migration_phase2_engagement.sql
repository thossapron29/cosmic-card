-- Migration: Phase 2 product depth and engagement
-- Adds richer card content fields, favorites, and journaling support.

create extension if not exists "uuid-ossp";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

alter table cards
  add column if not exists short_message text,
  add column if not exists full_message text;

update cards
set short_message = coalesce(short_message, message, title)
where short_message is null;

update cards
set full_message = coalesce(full_message, reflection, message, short_message)
where full_message is null;

update cards
set category = coalesce(nullif(category, ''), 'alignment'),
    energy_tag = coalesce(nullif(energy_tag, ''), 'quiet confidence'),
    image_key = coalesce(nullif(image_key, ''), slug)
where category is null
   or energy_tag is null
   or image_key is null
   or category = ''
   or energy_tag = ''
   or image_key = '';

alter table cards
  alter column short_message set not null,
  alter column full_message set not null,
  alter column category set not null,
  alter column energy_tag set not null,
  alter column image_key set not null;

create index if not exists idx_cards_category_active on cards(category, is_active);

alter table user_cards
  add column if not exists is_favorite boolean not null default false,
  add column if not exists favorited_at timestamp with time zone,
  add column if not exists journal_note text,
  add column if not exists journal_updated_at timestamp with time zone;

create index if not exists idx_user_cards_user_favorites
  on user_cards(user_id, is_favorite, revealed_at desc);
