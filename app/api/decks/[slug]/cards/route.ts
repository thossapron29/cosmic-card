import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { canAccessDeck } from "@/lib/access/control";
import { getViewerContext } from "@/lib/server/viewer";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get("userId");
    const limit = Math.min(Number(searchParams.get("limit") || "24"), 100);
    const viewer = await getViewerContext(supabase, { anonymousId });

    const { data: deck, error: deckError } = await supabase
      .from("decks")
      .select("id, slug, is_premium")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (deckError || !deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const access = canAccessDeck(viewer, deck);
    if (!access.can_access) {
      return NextResponse.json({ error: "Premium deck access required" }, { status: 403 });
    }

    const { data: cards, error } = await supabase
      .from("cards")
      .select("id, deck_id, slug, card_no, title, short_message, full_message, category, energy_tag, image_key, is_active, created_at, updated_at")
      .eq("deck_id", deck.id)
      .eq("is_active", true)
      .order("card_no", { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch deck cards" }, { status: 500 });
    }

    return NextResponse.json({ success: true, cards: cards ?? [] });
  } catch (error) {
    console.error("Deck cards API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
