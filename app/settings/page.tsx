"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { ScreenShell } from "@/components/screen-shell";
import { PrimaryButton } from "@/components/primary-button";
import {
  getOnboardingCompleted,
  getPreferredLocale,
  getPreferredTimezone,
  getSelectedTheme,
  setOnboardingCompleted,
  setPreferredLocale,
  setPreferredTimezone,
  setSelectedTheme,
} from "@/lib/utils";
import { useViewer } from "@/providers/viewer-provider";
import type { ProfileResponse } from "@/types/profile";

const THEME_OPTIONS = [
  { value: "starlight", label: "Starlight" },
  { value: "sunrise-mist", label: "Sunrise Mist" },
  { value: "golden-hour", label: "Golden Hour" },
];

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useViewer();
  const [draft, setDraft] = useState<{
    selectedTheme: string;
    locale: string;
    timezone: string;
    onboardingCompleted: boolean;
  } | null>(null);

  const profileQuery = useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to load profile");
      return payload;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const browserLocale = typeof navigator === "undefined" ? "en-US" : navigator.language || "en-US";
  const browserTimezone =
    typeof Intl === "undefined"
      ? "UTC"
      : Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const defaultDraft = useMemo(
    () => ({
      selectedTheme: profileQuery.data?.profile.selected_theme || getSelectedTheme() || "starlight",
      locale: profileQuery.data?.profile.locale || getPreferredLocale() || browserLocale,
      timezone: profileQuery.data?.profile.timezone || getPreferredTimezone() || browserTimezone,
      onboardingCompleted:
        profileQuery.data?.profile.onboarding_completed ?? getOnboardingCompleted(),
    }),
    [
      browserLocale,
      browserTimezone,
      profileQuery.data?.profile.locale,
      profileQuery.data?.profile.onboarding_completed,
      profileQuery.data?.profile.selected_theme,
      profileQuery.data?.profile.timezone,
    ]
  );

  const form = draft ?? defaultDraft;

  const saveMutation = useMutation({
    mutationFn: async () => {
      setSelectedTheme(selectedTheme || null);
      setPreferredLocale(locale || null);
      setPreferredTimezone(timezone || null);
      setOnboardingCompleted(onboardingCompleted);

      if (!isAuthenticated) {
        return { localOnly: true };
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedTheme,
          locale,
          timezone,
          onboardingCompleted,
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to save settings");
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const selectedTheme = form.selectedTheme;
  const locale = form.locale;
  const timezone = form.timezone;
  const onboardingCompleted = form.onboardingCompleted;

  return (
    <ScreenShell>
      <div className="z-10 flex w-full flex-col pb-12">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => router.push("/profile")}
            className="p-2 -ml-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="ml-2">
            <h1 className="text-xl font-light tracking-[0.2em] uppercase text-white/90">Settings</h1>
            <p className="mt-1 text-sm text-white/48">
              Keep a few quiet preferences in sync between this device and your profile.
            </p>
          </div>
        </div>

        <div className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-md">
          <div>
            <label className="text-[11px] uppercase tracking-[0.28em] text-white/45">Theme preference</label>
            <div className="mt-3 grid gap-3">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({
                      ...(current ?? defaultDraft),
                      selectedTheme: theme.value,
                    }))
                  }
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedTheme === theme.value
                      ? "border-cosmic-accent/40 bg-cosmic-accent/10 text-cosmic-accent"
                      : "border-white/10 bg-white/5 text-white/70"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.28em] text-white/45">Locale</label>
            <input
              value={locale}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? defaultDraft),
                  locale: event.target.value,
                }))
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-cosmic-card/60 px-4 py-3 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.28em] text-white/45">Timezone</label>
            <input
              value={timezone}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? defaultDraft),
                  timezone: event.target.value,
                }))
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-cosmic-card/60 px-4 py-3 text-sm text-white outline-none"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72">
            <input
              type="checkbox"
              checked={onboardingCompleted}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? defaultDraft),
                  onboardingCompleted: event.target.checked,
                }))
              }
              className="h-4 w-4 accent-[var(--color-cosmic-accent)]"
            />
            Mark onboarding as completed
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <PrimaryButton onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : isAuthenticated ? "Save & Sync" : "Save Locally"}
            </PrimaryButton>
            <PrimaryButton variant="secondary" onClick={() => router.push("/")}>
              Back Home
            </PrimaryButton>
          </div>
          {saveMutation.isSuccess ? (
            <p className="text-sm text-emerald-200">
              {isAuthenticated
                ? "Settings saved and synced to your profile."
                : "Settings saved locally on this device."}
            </p>
          ) : null}
          {saveMutation.isError ? (
            <p className="text-sm text-red-300">{(saveMutation.error as Error).message}</p>
          ) : null}
        </div>
      </div>
    </ScreenShell>
  );
}
