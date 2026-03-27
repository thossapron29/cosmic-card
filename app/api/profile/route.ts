import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getViewerContext } from "@/lib/server/viewer";

export async function GET() {
  try {
    const supabase = await createClient();
    const viewer = await getViewerContext(supabase);

    if (!viewer.profileId || !viewer.profile) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      profile: viewer.profile,
      entitlements: viewer.entitlementKeys,
      isPremium: viewer.isPremium,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const viewer = await getViewerContext(supabase);

    if (!viewer.profileId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await request.json();

    const updates: Record<string, string | boolean | null> = {};

    if ("preferredDeckSlug" in payload) {
      updates.preferred_deck_slug =
        typeof payload.preferredDeckSlug === "string" ? payload.preferredDeckSlug : null;
    }

    if ("selectedTheme" in payload) {
      updates.selected_theme =
        typeof payload.selectedTheme === "string" ? payload.selectedTheme : null;
    }

    if ("onboardingCompleted" in payload) {
      updates.onboarding_completed = Boolean(payload.onboardingCompleted);
    }

    if ("locale" in payload) {
      updates.locale = typeof payload.locale === "string" ? payload.locale : null;
    }

    if ("timezone" in payload) {
      updates.timezone = typeof payload.timezone === "string" ? payload.timezone : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid profile updates provided" }, { status: 400 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", viewer.profileId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile update API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
