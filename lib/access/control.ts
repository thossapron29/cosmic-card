import type { DeckAccessState, FeatureKey } from "@/types/access";
import type { Deck } from "@/types/deck";

export interface AccessViewer {
  entitlementKeys: string[];
  isPremium: boolean;
}

export function hasEntitlement(viewer: AccessViewer, entitlementKey: string) {
  return viewer.entitlementKeys.includes(entitlementKey);
}

export function canAccessDeck(viewer: AccessViewer, deck: Pick<Deck, "slug" | "is_premium">): DeckAccessState {
  if (!deck.is_premium) {
    return { can_access: true, reason: "free" };
  }

  if (viewer.isPremium || hasEntitlement(viewer, "premium") || hasEntitlement(viewer, `deck:${deck.slug}`)) {
    return { can_access: true, reason: "entitled" };
  }

  return { can_access: false, reason: "premium_required" };
}

export function canUseFeature(viewer: AccessViewer, featureKey: FeatureKey) {
  switch (featureKey) {
    case "premium_decks":
    case "premium_share_themes":
    case "ai_interpretation":
    case "seasonal_reveals":
      return viewer.isPremium || hasEntitlement(viewer, `feature:${featureKey}`) || hasEntitlement(viewer, "premium");
    default:
      return true;
  }
}
