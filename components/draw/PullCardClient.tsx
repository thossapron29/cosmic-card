"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import {
  type CosmicDeck,
  type DrawMode,
  type RevealDrawResponse,
  getDecks,
  revealDraw,
} from "@/lib/cosmic-api";

import { DrawResultScreen } from "./DrawResultScreen";
import { DrawScreen } from "./DrawScreen";
import {
  DEMO_USER_ID,
  DRAW_QUESTION,
  getClientLocalDate,
  getFriendlyError,
} from "./draw-config";
import { SettingsSheet } from "./SettingsSheet";

export function PullCardClient() {
  const [decks, setDecks] = useState<CosmicDeck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [drawMode, setDrawMode] = useState<DrawMode>("guidance");
  const [reveal, setReveal] = useState<RevealDrawResponse | null>(null);
  const [error, setError] = useState("");
  const [isDecksLoading, setIsDecksLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    async function loadDecks() {
      setIsDecksLoading(true);
      setError("");

      try {
        const nextDecks = await getDecks("en");

        if (!isMounted) {
          return;
        }

        setDecks(nextDecks);
        setSelectedDeckId(nextDecks[0]?.id ?? null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(getFriendlyError(loadError));
      } finally {
        if (isMounted) {
          setIsDecksLoading(false);
        }
      }
    }

    void loadDecks();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) ?? null,
    [decks, selectedDeckId],
  );

  const canReveal = Boolean(selectedDeckId) && !isPending;

  function handleReveal() {
    if (!selectedDeckId) {
      setError("Choose a deck before drawing a card.");
      setIsSettingsOpen(true);
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const nextReveal = await revealDraw({
          userId: DEMO_USER_ID,
          deckId: selectedDeckId,
          drawMode,
          locale: "en",
          questionText: DRAW_QUESTION,
          clientLocalDate: getClientLocalDate(),
        });

        setReveal(nextReveal);
      } catch (revealError) {
        setError(getFriendlyError(revealError));
      }
    });
  }

  return (
    <>
      {reveal ? (
        <DrawResultScreen
          reveal={reveal}
          drawMode={drawMode}
          onBack={() => setReveal(null)}
        />
      ) : (
        <DrawScreen
          selectedDeck={selectedDeck}
          drawMode={drawMode}
          canReveal={canReveal}
          isPending={isPending}
          error={error}
          onReveal={handleReveal}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      <SettingsSheet
        open={isSettingsOpen}
        decks={decks}
        selectedDeckId={selectedDeckId}
        drawMode={drawMode}
        isLoading={isDecksLoading}
        onClose={() => setIsSettingsOpen(false)}
        onDeckChange={setSelectedDeckId}
        onModeChange={setDrawMode}
      />
    </>
  );
}
