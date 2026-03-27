"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { ScreenShell } from "@/components/screen-shell";
import { DeckCard } from "@/components/deck-card";
import { getAnonymousId, setPreferredDeckSlug } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/track";
import { useViewer } from "@/providers/viewer-provider";
import type { DeckListResponse } from "@/types/deck";

export default function DecksPage() {
  const router = useRouter();
  const { anonymousId, isAuthenticated } = useViewer();
  const userId = useMemo(() => anonymousId ?? getAnonymousId(), [anonymousId]);

  const { data, isLoading, error } = useQuery<DeckListResponse>({
    queryKey: ["decks", userId, isAuthenticated],
    queryFn: async () => {
      const res = await fetch(`/api/decks${userId ? `?userId=${userId}` : ""}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to load decks");
      return payload;
    },
  });

  const decks = data?.decks ?? [];

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
            <h1 className="text-xl font-light tracking-[0.2em] uppercase text-white/90">Deck Library</h1>
            <p className="mt-1 text-sm text-white/48">Choose the energy you want to draw from today.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-white/55">Loading decks...</div>
        ) : error ? (
          <div className="py-20 text-center text-red-300">{(error as Error).message}</div>
        ) : (
          <div className="space-y-4">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onClick={() => {
                  setPreferredDeckSlug(deck.slug);
                  trackEvent("select_deck", { deckSlug: deck.slug, source: "decks_page" });
                  router.push(`/decks/${deck.slug}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
