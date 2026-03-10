-- Cosmic Card Supabase Schema

-- Enable UUID extension if not present
create extension if not exists "uuid-ossp";

-- Table: cards
create table cards (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  message text not null,
  affirmation text not null,
  reflection text not null,
  created_at timestamp with time zone default now()
);

-- Table: user_cards
create table user_cards (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  card_id uuid references cards(id) not null,
  revealed_date date not null,
  created_at timestamp with time zone default now(),
  constraint unique_user_reveal unique(user_id, revealed_date)
);

-- Seed Initial Cards
insert into cards (title, message, affirmation, reflection) values
('ALIGNMENT', 'What belongs to you will never pass you by.', 'I trust the path unfolding for me.', 'What feels aligned today?'),
('TRUST', 'Even when you cannot see the next step, the universe is guiding you.', 'I trust the timing of my life.', 'Where can you soften your need for control?'),
('RECEIVING', 'You are allowed to receive the good that is coming.', 'I open myself to abundance.', 'What are you ready to receive?'),
('FLOW', 'Stop forcing what is not meant to be forced.', 'I move with the flow of life.', 'Where can you let life move more naturally?'),
('COURAGE', 'The life you want requires the courage to choose it.', 'I am brave enough to follow my truth.', 'What truth wants your attention today?'),
('ABUNDANCE', 'There is more than enough for you.', 'I am available for overflow.', 'What does abundance mean to you right now?'),
('LET GO', 'Release what no longer belongs to your future.', 'I let go with ease and trust.', 'What can you release today?'),
('MAGIC', 'The universe is always responding to your energy.', 'I am magnetic to what is meant for me.', 'What energy are you sending out today?'),
('TIMING', 'What is meant for you will arrive at the perfect moment.', 'I trust divine timing.', 'What are you learning while you wait?'),
('EXPANSION', 'Your life is expanding in ways you cannot yet imagine.', 'I welcome growth and new opportunities.', 'Where are you ready to grow?'),
('PEACE', 'Peace is available to you in this moment.', 'I return to calm within myself.', 'What helps you feel grounded now?'),
('POSSIBILITY', 'The future is still being written in your favor.', 'I stay open to beautiful possibilities.', 'What possibility excites you today?');
