"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Crown, Sparkles } from "lucide-react";
import { ScreenShell } from "@/components/screen-shell";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId, setPreferredDeckSlug } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/track";
import { useViewer } from "@/providers/viewer-provider";
import type { DeckDetailResponse } from "@/types/deck";

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { anonymousId, isAuthenticated } = useViewer();
  const slug = params.slug as string;
  const userId = useMemo(() => anonymousId ?? getAnonymousId(), [anonymousId]);

  const { data, isLoading, error } = useQuery<DeckDetailResponse>({
    queryKey: ["deck-detail", slug, userId, isAuthenticated],
    queryFn: async () => {
      const res = await fetch(`/api/decks/${slug}${userId ? `?userId=${userId}` : ""}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to load deck");
      return payload;
    },
    enabled: !!slug,
  });

  const deck = data?.deck;
  const cards = data?.preview_cards ?? [];

  useEffect(() => {
    if (!deck) return;
    trackEvent("view_deck", { deckSlug: deck.slug });
    if (deck.is_locked) {
      trackEvent("premium_deck_locked_view", { deckSlug: deck.slug });
    }
  }, [deck]);

  return (
    <ScreenShell>
      <div className="z-10 flex w-full flex-col pb-12">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => router.push("/decks")}
            className="p-2 -ml-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <p className="ml-2 text-xs uppercase tracking-[0.24em] text-white/40">Deck detail</p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-white/55">Loading deck...</div>
        ) : error || !deck ? (
          <div className="py-20 text-center text-red-300">
            {error instanceof Error ? error.message : "Deck not found"}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-cosmic-accent">
                    {deck.is_premium ? "Premium deck" : "Free deck"}
                  </p>
                  <h1 className="mt-3 text-3xl font-light tracking-[0.18em] uppercase text-white/92">
                    {deck.name}
                  </h1>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
                    {deck.description}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.08] p-3 text-white/75">
                  {deck.is_locked ? <Crown className="h-5 w-5 text-cosmic-accent" /> : <Sparkles className="h-5 w-5" />}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton
                  onClick={() => {
                    setPreferredDeckSlug(deck.slug);
                    trackEvent("select_deck", { deckSlug: deck.slug, source: "deck_detail" });
                    router.push(`/?deck=${deck.slug}`);
                  }}
                >
                  {deck.is_locked ? "Open on Home" : "Reveal From This Deck"}
                </PrimaryButton>
                <PrimaryButton variant="secondary" onClick={() => router.push("/decks")}>
                  Browse Other Decks
                </PrimaryButton>
                {deck.is_locked ? (
                  <PrimaryButton
                    variant="secondary"
                    onClick={() => {
                      trackEvent("premium_upgrade_clicked", {
                        source: "deck_detail_locked",
                        deckSlug: deck.slug,
                      });
                      router.push("/premium");
                    }}
                  >
                    View Premium
                  </PrimaryButton>
                ) : null}
              </div>
            </div>

            {deck.is_locked ? (
              <div className="rounded-[2rem] border border-cosmic-accent/20 bg-cosmic-accent/10 p-6 text-sm leading-7 text-white/72">
                This deck is already wired into the access-control layer, so premium gating can stay consistent across reveal,
                deck browsing, and future billing providers. Once a premium entitlement is active, the same routes will unlock
                without changing the UI contract.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Preview cards</p>
                <div className="grid gap-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.24em] text-white/45">
                        <span>{card.category}</span>
                        <span className="text-cosmic-accent">{card.energy_tag}</span>
                      </div>
                      <h2 className="mt-3 text-lg font-light tracking-[0.12em] uppercase text-white/92">
                        {card.title}
                      </h2>
                      <p className="mt-3 text-sm italic leading-6 text-white/68">{card.short_message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
