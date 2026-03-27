"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Crown, Sparkles } from "lucide-react";
import { ScreenShell } from "@/components/screen-shell";
import { DeckCard } from "@/components/deck-card";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/track";
import { useViewer } from "@/providers/viewer-provider";
import type { DeckListResponse } from "@/types/deck";
import type { ProfileResponse } from "@/types/profile";

export default function PremiumPage() {
  const router = useRouter();
  const { anonymousId, isAuthenticated } = useViewer();
  const [ctaTapped, setCtaTapped] = useState(false);
  const userId = useMemo(() => anonymousId ?? getAnonymousId(), [anonymousId]);

  const decksQuery = useQuery<DeckListResponse>({
    queryKey: ["decks", userId, isAuthenticated],
    queryFn: async () => {
      const res = await fetch(`/api/decks${userId ? `?userId=${userId}` : ""}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to load decks");
      return payload;
    },
  });

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

  useEffect(() => {
    trackEvent("premium_gate_viewed", { gate: "premium_page" });
  }, []);

  const premiumDecks = (decksQuery.data?.decks ?? []).filter((deck) => deck.is_premium);

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
            <h1 className="text-xl font-light tracking-[0.2em] uppercase text-white/90">Premium</h1>
            <p className="mt-1 text-sm text-white/48">Vendor-agnostic access control is ready for future billing.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-cosmic-accent/20 bg-cosmic-accent/10 p-6 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-cosmic-accent">Growth-ready access layer</p>
              <h2 className="mt-3 text-3xl font-light tracking-[0.16em] uppercase text-white/92">
                Unlock deeper decks and future AI reflections
              </h2>
            </div>
            <div className="rounded-full border border-cosmic-accent/25 bg-cosmic-accent/10 p-3">
              <Crown className="h-5 w-5 text-cosmic-accent" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm leading-7 text-white/72">
            <p>Free access stays generous: core reveals, history, favorites, notes, and sharing remain available.</p>
            <p>Premium is prepared to unlock deck access, enhanced share themes, AI interpretations, and seasonal experiences.</p>
            <p>Current account state: <span className="text-white/88">{profileQuery.data?.isPremium ? "Premium active" : "Free plan"}</span></p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton
              onClick={() => {
                setCtaTapped(true);
                trackEvent("premium_upgrade_clicked", { source: "premium_page" });
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" /> Upgrade Interest
              </span>
            </PrimaryButton>
            <PrimaryButton variant="secondary" onClick={() => router.push("/decks")}>
              Browse Decks
            </PrimaryButton>
          </div>
          {ctaTapped ? (
            <p className="mt-4 text-sm text-white/76">
              Billing isn&apos;t wired yet, but the entitlement layer is. When checkout is added later, deck access can be granted
              without reshaping the app.
            </p>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Premium decks</p>
          {premiumDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} onClick={() => router.push(`/decks/${deck.slug}`)} />
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
