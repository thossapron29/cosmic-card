import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { AnonymousDevice, Profile } from "@/types/profile";

export interface ViewerContext {
  authUser: User | null;
  profile: Profile | null;
  anonymousDevice: AnonymousDevice | null;
  anonymousId: string | null;
  profileId: string | null;
  anonymousDeviceId: string | null;
  entitlementKeys: string[];
  isPremium: boolean;
}

async function ensureProfile(supabase: SupabaseClient, user: User) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function ensureAnonymousDevice(
  supabase: SupabaseClient,
  anonymousId: string
) {
  const { data, error } = await supabase
    .from("anonymous_devices")
    .upsert(
      {
        anonymous_id: anonymousId,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "anonymous_id" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data as AnonymousDevice;
}

export async function getViewerContext(
  supabase: SupabaseClient,
  options?: {
    anonymousId?: string | null;
    ensureAnonymous?: boolean;
  }
): Promise<ViewerContext> {
  const anonymousId = options?.anonymousId ?? null;
  const { data } = await supabase.auth.getUser();
  const authUser = data.user ?? null;

  let profile: Profile | null = null;
  let anonymousDevice: AnonymousDevice | null = null;
  let entitlementKeys: string[] = [];

  if (authUser) {
    profile = await ensureProfile(supabase, authUser);

    const { data: entitlements } = await supabase
      .from("entitlements")
      .select("entitlement_key")
      .eq("profile_id", authUser.id)
      .eq("active", true);

    entitlementKeys = (entitlements ?? []).map((item) => item.entitlement_key as string);
  }

  if (anonymousId && (options?.ensureAnonymous || !authUser)) {
    anonymousDevice = await ensureAnonymousDevice(supabase, anonymousId);
  }

  const isPremium =
    entitlementKeys.includes("premium") ||
    entitlementKeys.includes("feature:premium_decks") ||
    entitlementKeys.includes("feature:ai_interpretation");

  return {
    authUser,
    profile,
    anonymousDevice,
    anonymousId,
    profileId: profile?.id ?? null,
    anonymousDeviceId: anonymousDevice?.id ?? null,
    entitlementKeys,
    isPremium,
  };
}
