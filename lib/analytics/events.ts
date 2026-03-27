export interface AnalyticsEventMap {
  select_deck: { deckSlug: string; source: string };
  view_deck: { deckSlug: string };
  login_started: { provider: "google" | "apple" | "magic_link" };
  login_completed: { provider: string };
  merge_anonymous_history: { mergedCount: number; dedupedCount: number };
  premium_gate_viewed: { gate: string; deckSlug?: string };
  premium_upgrade_clicked: { source: string; deckSlug?: string };
  premium_deck_locked_view: { deckSlug: string };
  ai_interpretation_requested: { mode: string; deckSlug?: string };
  ai_interpretation_completed: { mode: string; deckSlug?: string };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
