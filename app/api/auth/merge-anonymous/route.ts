import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ensureAnonymousDevice, getViewerContext } from "@/lib/server/viewer";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const payload = await request.json();
    const anonymousId = typeof payload?.anonymousId === "string" ? payload.anonymousId.trim() : "";

    if (!anonymousId) {
      return NextResponse.json({ error: "Anonymous ID is required" }, { status: 400 });
    }

    const viewer = await getViewerContext(supabase, { anonymousId });

    if (!viewer.profileId) {
      return NextResponse.json({ error: "You must be signed in to merge history" }, { status: 401 });
    }

    const anonymousDevice = viewer.anonymousDevice ?? (await ensureAnonymousDevice(supabase, anonymousId));

    const { data: rows, error } = await supabase
      .from("user_cards")
      .select("id, card_id, revealed_at, local_date, reveal_type, is_favorite, favorited_at, journal_note, journal_updated_at")
      .or(`anonymous_device_id.eq.${anonymousDevice.id},user_id.eq.${anonymousId}`)
      .is("profile_id", null);

    if (error) {
      return NextResponse.json({ error: "Failed to load anonymous history" }, { status: 500 });
    }

    let mergedCount = 0;
    let dedupedCount = 0;

    for (const row of rows ?? []) {
      const { data: existing } = await supabase
        .from("user_cards")
        .select("id, is_favorite, favorited_at, journal_note, journal_updated_at")
        .eq("profile_id", viewer.profileId)
        .eq("card_id", row.card_id)
        .eq("revealed_at", row.revealed_at)
        .eq("reveal_type", row.reveal_type)
        .maybeSingle();

      if (existing) {
        dedupedCount += 1;

        await supabase
          .from("user_cards")
          .update({
            is_favorite: existing.is_favorite || row.is_favorite,
            favorited_at: existing.is_favorite ? existing.favorited_at : row.favorited_at,
            journal_note: existing.journal_note || row.journal_note,
            journal_updated_at: existing.journal_note ? existing.journal_updated_at : row.journal_updated_at,
          })
          .eq("id", existing.id);

        await supabase.from("user_cards").delete().eq("id", row.id);
        continue;
      }

      await supabase
        .from("user_cards")
        .update({
          profile_id: viewer.profileId,
          anonymous_device_id: anonymousDevice.id,
        })
        .eq("id", row.id);

      mergedCount += 1;
    }

    return NextResponse.json({ success: true, mergedCount, dedupedCount });
  } catch (error) {
    console.error("Anonymous merge API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
