import type { SupabaseClient } from "@supabase/supabase-js";
import type { Card } from "@/types/card";

export const CARD_SELECT =
  "id, deck_id, slug, card_no, title, short_message, full_message, category, energy_tag, image_key, is_active, created_at, updated_at";

export const USER_CARD_SELECT = `id, user_id, profile_id, anonymous_device_id, card_id, deck_id, revealed_at, local_date, reveal_type, interpretation_mode, source_context, share_theme_used, is_favorite, favorited_at, journal_note, journal_updated_at, created_at, card:cards(${CARD_SELECT})`;

interface RandomCardOptions {
  deckId?: string | null;
}

export async function selectRandomCard(
  supabase: SupabaseClient,
  options?: RandomCardOptions
): Promise<Card> {
  let countQuery = supabase
    .from("cards")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (options?.deckId) {
    countQuery = countQuery.eq("deck_id", options.deckId);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    throw new Error("Failed to count active cards");
  }

  if (!count) {
    throw new Error("No active cards available");
  }

  const randomOffset = Math.floor(Math.random() * count);

  let selectQuery = supabase
    .from("cards")
    .select(CARD_SELECT)
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (options?.deckId) {
    selectQuery = selectQuery.eq("deck_id", options.deckId);
  }

  const { data, error } = await selectQuery.range(randomOffset, randomOffset);

  if (error || !data?.length) {
    throw new Error("Failed to select a random card");
  }

  return data[0] as Card;
}
