export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_deck_slug: string | null;
  selected_theme: string | null;
  onboarding_completed: boolean;
  locale: string | null;
  timezone: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AnonymousDevice {
  id: string;
  anonymous_id: string;
  preferred_deck_slug: string | null;
  selected_theme: string | null;
  locale: string | null;
  timezone: string | null;
  last_seen_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileResponse {
  success: true;
  profile: Profile;
  entitlements: string[];
  isPremium: boolean;
}
