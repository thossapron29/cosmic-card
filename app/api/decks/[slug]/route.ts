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
    const viewer = await getViewerContext(supabase, { anonymousId });

    const { data: deck, error } = await supabase
      .from("decks")
      .select("id, name, slug, description, cover_image_key, theme_key, is_active, is_premium, sort_order, created_at, updated_at")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const access = canAccessDeck(viewer, deck);
    const { data: cards } = await supabase
      .from("cards")
      .select("id, slug, card_no, title, short_message, category, energy_tag, image_key")
      .eq("deck_id", deck.id)
      .eq("is_active", true)
      .order("card_no", { ascending: true })
      .limit(6);

    return NextResponse.json({
      success: true,
      deck: {
        ...deck,
        is_locked: !access.can_access,
        access_reason: access.reason,
      },
      preview_cards: access.can_access ? cards ?? [] : [],
    });
  } catch (error) {
    console.error("Deck detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
