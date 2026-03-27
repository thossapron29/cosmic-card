import { NextResponse } from "next/server";
import { USER_CARD_SELECT } from "@/lib/server/select-random-card";
import { createClient } from "@/utils/supabase/server";
import { getViewerContext } from "@/lib/server/viewer";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "History ID is required" }, { status: 400 });
    }

    const viewer = await getViewerContext(supabase, { anonymousId: userId });

    if (!viewer.profileId && !viewer.anonymousDeviceId && !userId) {
      return NextResponse.json({ error: "User ID is required for anonymous history" }, { status: 400 });
    }

    let query = supabase
      .from("user_cards")
      .select(USER_CARD_SELECT)
      .eq("id", id);

    if (viewer.profileId) {
      query = query.eq("profile_id", viewer.profileId);
    } else if (viewer.anonymousDeviceId) {
      query = query.eq("anonymous_device_id", viewer.anonymousDeviceId);
    } else {
      query = query.eq("user_id", userId);
    }

    const { data: item, error } = await query.single();

    if (error || !item) {
      return NextResponse.json({ error: "History record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("History detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
