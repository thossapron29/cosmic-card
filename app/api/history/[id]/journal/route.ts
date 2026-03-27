import { NextResponse } from "next/server";
import { USER_CARD_SELECT } from "@/lib/server/select-random-card";
import { createClient } from "@/utils/supabase/server";
import { getViewerContext } from "@/lib/server/viewer";

export const dynamic = "force-dynamic";

const MAX_NOTE_LENGTH = 1000;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const userId = typeof payload?.userId === "string" ? payload.userId.trim() : "";
    const note = typeof payload?.note === "string" ? payload.note.trim() : "";

    if (note.length > MAX_NOTE_LENGTH) {
      return NextResponse.json(
        { error: `Journal note must be ${MAX_NOTE_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const viewer = await getViewerContext(supabase, { anonymousId: userId });

    if (!viewer.profileId && !viewer.anonymousDeviceId && !userId) {
      return NextResponse.json({ error: "User ID is required for anonymous journal updates" }, { status: 400 });
    }

    let query = supabase
      .from("user_cards")
      .update({
        journal_note: note || null,
        journal_updated_at: note ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (viewer.profileId) {
      query = query.eq("profile_id", viewer.profileId);
    } else if (viewer.anonymousDeviceId) {
      query = query.eq("anonymous_device_id", viewer.anonymousDeviceId);
    } else {
      query = query.eq("user_id", userId);
    }

    const { data: item, error } = await query.select(USER_CARD_SELECT).single();

    if (error || !item) {
      return NextResponse.json({ error: "History record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Journal API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
