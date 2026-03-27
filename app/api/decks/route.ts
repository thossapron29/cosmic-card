import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { canAccessDeck } from "@/lib/access/control";
import { getViewerContext } from "@/lib/server/viewer";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get("userId");
    const viewer = await getViewerContext(supabase, { anonymousId });

    const { data: decks, error } = await supabase
      .from("decks")
      .select("id, name, slug, description, cover_image_key, theme_key, is_active, is_premium, sort_order, created_at, updated_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch decks" }, { status: 500 });
    }

    const enriched = await Promise.all(
      (decks ?? []).map(async (deck) => {
        const access = canAccessDeck(viewer, deck);
        const { count } = await supabase
          .from("cards")
          .select("id", { count: "exact", head: true })
          .eq("deck_id", deck.id)
          .eq("is_active", true);

        return {
          ...deck,
          card_count: count ?? 0,
          is_locked: !access.can_access,
          access_reason: access.reason,
        };
      })
    );

    return NextResponse.json({ success: true, decks: enriched });
  } catch (error) {
    console.error("Deck list API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
