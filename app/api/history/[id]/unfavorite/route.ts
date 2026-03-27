import { NextResponse } from "next/server";
import { USER_CARD_SELECT } from "@/lib/server/select-random-card";
import { createClient } from "@/utils/supabase/server";
import { getViewerContext } from "@/lib/server/viewer";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const userId = typeof payload?.userId === "string" ? payload.userId.trim() : "";

    const supabase = await createClient();
    const viewer = await getViewerContext(supabase, { anonymousId: userId });

    if (!viewer.profileId && !viewer.anonymousDeviceId && !userId) {
      return NextResponse.json({ error: "User ID is required for anonymous favorite" }, { status: 400 });
    }

    let query = supabase
      .from("user_cards")
      .update({
        is_favorite: false,
        favorited_at: null,
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
    console.error("Unfavorite API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
