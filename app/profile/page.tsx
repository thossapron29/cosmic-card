"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Crown, Mail, Sparkles } from "lucide-react";
import { ScreenShell } from "@/components/screen-shell";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId } from "@/lib/utils";
import { useViewer } from "@/providers/viewer-provider";
import type { ProfileResponse } from "@/types/profile";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [mergeSummary, setMergeSummary] = useState<{ mergedCount: number; dedupedCount: number } | null>(null);
  const { anonymousId, user, isAuthenticated, isLoading, signInWithGoogle, signInWithApple, signInWithMagicLink, signOut, mergeAnonymousHistory } =
    useViewer();
  const localAnonymousId = useMemo(() => anonymousId ?? getAnonymousId(), [anonymousId]);

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

  const mergeMutation = useMutation({
    mutationFn: async () => mergeAnonymousHistory(),
    onSuccess: (payload) => {
      setMergeSummary(payload);
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ provider, emailAddress }: { provider: "google" | "apple" | "magic"; emailAddress?: string }) => {
      if (provider === "google") {
        await signInWithGoogle();
        return;
      }

      if (provider === "apple") {
        await signInWithApple();
        return;
      }

      if (!emailAddress) {
        throw new Error("Email is required for magic link");
      }

      await signInWithMagicLink(emailAddress);
    },
    onSuccess: (_, variables) => {
      if (variables.provider === "magic") {
        setMagicLinkSent(true);
      }
    },
  });

  async function handleMagicLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMagicLinkSent(false);
    loginMutation.mutate({ provider: "magic", emailAddress: email.trim() });
  }

  return (
    <ScreenShell>
      <div className="z-10 flex w-full flex-col pb-12">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => router.push("/")}
            className="p-2 -ml-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="ml-2">
            <h1 className="text-xl font-light tracking-[0.2em] uppercase text-white/90">Profile</h1>
            <p className="mt-1 text-sm text-white/48">
              Keep your journey anonymous by default, or sign in to carry it across devices.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-white/55">Loading account...</div>
        ) : !isAuthenticated ? (
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.28em] text-cosmic-accent">Anonymous-first</p>
              <h2 className="mt-3 text-2xl font-light tracking-[0.16em] uppercase text-white/92">Keep your history with you</h2>
              <p className="mt-4 text-sm leading-7 text-white/64">
                Sign in only when you want continuity. Your local reveal history stays usable without an account, and once you log in
                you can merge this device into a profile.
              </p>
              <div className="mt-6 grid gap-3">
                <PrimaryButton onClick={() => loginMutation.mutate({ provider: "google" })}>
                  Continue with Google
                </PrimaryButton>
                <PrimaryButton variant="secondary" onClick={() => loginMutation.mutate({ provider: "apple" })}>
                  Continue with Apple
                </PrimaryButton>
              </div>
              <form onSubmit={handleMagicLinkSubmit} className="mt-4 space-y-3">
                <label className="block text-[11px] uppercase tracking-[0.24em] text-white/42">Email magic link</label>
                <div className="flex gap-3">
                  <div className="flex flex-1 items-center rounded-full border border-white/10 bg-white/[0.07] px-4">
                    <Mail className="h-4 w-4 text-white/42" />
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/28"
                    />
                  </div>
                  <PrimaryButton type="submit" disabled={loginMutation.isPending || !email.trim()}>
                    Send
                  </PrimaryButton>
                </div>
              </form>
              {magicLinkSent ? (
                <p className="mt-3 text-sm text-emerald-200">Magic link sent. Check your inbox to finish signing in.</p>
              ) : null}
              {loginMutation.isError ? (
                <p className="mt-3 text-sm text-red-300">{(loginMutation.error as Error).message}</p>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Current device</p>
              <p className="mt-3 text-sm leading-7 text-white/62">
                Anonymous ID: <span className="break-all text-white/82">{localAnonymousId ?? "Not available"}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-cosmic-accent">Signed in</p>
                  <h2 className="mt-3 text-2xl font-light tracking-[0.16em] uppercase text-white/92">
                    {profileQuery.data?.profile.display_name || user?.email || "Cosmic Member"}
                  </h2>
                  <p className="mt-2 text-sm text-white/56">{user?.email}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.07] p-3">
                  {profileQuery.data?.isPremium ? (
                    <Crown className="h-5 w-5 text-cosmic-accent" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-white/72" />
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-white/64">
                <p>Premium access: <span className="text-white/88">{profileQuery.data?.isPremium ? "Active" : "Not active"}</span></p>
                <p>Theme preference: <span className="text-white/88">{profileQuery.data?.profile.selected_theme || "Starlight"}</span></p>
                <p>Timezone: <span className="text-white/88">{profileQuery.data?.profile.timezone || "Device default"}</span></p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton variant="secondary" onClick={() => router.push("/settings")}>
                  Edit Settings
                </PrimaryButton>
                <PrimaryButton variant="secondary" onClick={() => router.push("/premium")}>
                  Premium Plans
                </PrimaryButton>
                <PrimaryButton variant="outline" onClick={() => void signOut()}>
                  Sign Out
                </PrimaryButton>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cosmic-accent/20 bg-cosmic-accent/10 p-6 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.28em] text-cosmic-accent">Merge this device</p>
              <p className="mt-4 text-sm leading-7 text-white/68">
                If you used Cosmic Card before signing in, you can merge this device&apos;s reveals into your account. Favorites and
                journal notes stay attached to the original reveal instance whenever possible.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <PrimaryButton onClick={() => mergeMutation.mutate()} disabled={mergeMutation.isPending}>
                  {mergeMutation.isPending ? "Merging..." : "Merge Anonymous History"}
                </PrimaryButton>
                <PrimaryButton variant="secondary" onClick={() => router.push("/history")}>
                  View History
                </PrimaryButton>
              </div>
              {mergeSummary ? (
                <p className="mt-4 text-sm text-white/74">
                  Merged {mergeSummary.mergedCount} reveal(s) and folded {mergeSummary.dedupedCount} duplicate moment(s) into your
                  account history.
                </p>
              ) : null}
              {mergeMutation.isError ? (
                <p className="mt-4 text-sm text-red-300">{(mergeMutation.error as Error).message}</p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
