export type FeatureKey =
  | "premium_decks"
  | "premium_share_themes"
  | "ai_interpretation"
  | "seasonal_reveals";

export interface DeckAccessState {
  can_access: boolean;
  reason: "free" | "premium_required" | "entitled";
}
