-- Migration: Enable Unlimited Card Reveals
-- Run this in your Supabase SQL Editor to allow users to reveal multiple cards per day

-- Drop the unique constraint that limits one reveal per day
-- Try both possible constraint names
ALTER TABLE user_cards DROP CONSTRAINT IF EXISTS unique_user_reveal;
ALTER TABLE user_cards DROP CONSTRAINT IF EXISTS user_cards_user_id_revealed_date_key;

-- Add index for better query performance on history lookups
CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_created_at ON user_cards(created_at DESC);

-- Verify the change
-- You should see no unique constraint on (user_id, revealed_date)
-- Run: SELECT * FROM pg_indexes WHERE tablename = 'user_cards';
