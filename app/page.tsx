"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScreenShell } from "@/components/screen-shell";
import { GlowingCardBack } from "@/components/glowing-card-back";
import { CardContent } from "@/components/card-content";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId, getTodayDateStr, getCachedTodayCard, setCachedTodayCard } from "@/lib/utils";
import { Card } from "@/types/card";

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useMemo(() => getAnonymousId(), []);

  // State 0: Initial/Checking, 1: Revealing Animation, 2: Revealed
  const [revealState, setRevealState] = useState<0 | 1 | 2>(0);
  const [card, setCard] = useState<Card | null>(null);
  const [isNewReveal, setIsNewReveal] = useState(false);

  // 1. Zero-Load Check: Check localStorage immediately
  useEffect(() => {
    const cachedCard = getCachedTodayCard();
    if (cachedCard) {
      setCard(cachedCard);
      setRevealState(2);
      setIsNewReveal(false);
    }
  }, []);

  // 2. Query History (for confirmation and data fetching if cache empty)
  const { isPending: loadingHistory } = useQuery({
    queryKey: ["history", userId],
    queryFn: async () => {
      if (!userId) return { history: [] };
      const res = await fetch(`/api/history?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: !!userId,
    onSuccess: (data: any) => {
      // If we don't have a card in local state yet, see if it exists in history
      if (revealState === 0) {
        const todayStr = getTodayDateStr();
        const todayCardEntry = data.history?.find((h: any) => h.revealed_date === todayStr);
        if (todayCardEntry && todayCardEntry.card) {
          setCard(todayCardEntry.card);
          setCachedTodayCard(todayCardEntry.card);
          setRevealState(2);
        }
      }
    }
  } as any);

  // 3. Reveal Mutation
  const revealMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, localDateStr: getTodayDateStr() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reveal card");
      return data;
    },
    onSuccess: (data) => {
      setCard(data.card);
      setIsNewReveal(data.isNewReveal);
      setCachedTodayCard(data.card);
      
      // Update history cache optimistically or invalidate
      queryClient.invalidateQueries({ queryKey: ["history", userId] });

      setTimeout(() => {
        setRevealState(2);
      }, 1500);
    },
    onError: (err: any) => {
      setRevealState(0);
      alert(err.message);
    }
  });

  function handleReveal() {
    if (!userId || revealState !== 0 || revealMutation.isPending) return;
    setRevealState(1);
    revealMutation.mutate();
  }

  // Final check for loading state (only if we have no cached card)
  const isCheckingData = loadingHistory && revealState === 0 && !getCachedTodayCard();

  if (isCheckingData) {
    return (
      <ScreenShell className="items-center justify-center">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-12 h-12 border-t-2 border-cosmic-accent rounded-full animate-spin" />
        </motion.div>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell className="items-center justify-center">
      <AnimatePresence mode="wait">
        {revealState === 0 && (
          <motion.div
            key="unrevealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center space-y-12"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-white/90">Cosmic Card</h1>
              <p className="text-cosmic-muted tracking-widest text-sm uppercase">A message from the universe</p>
            </div>
            
            <GlowingCardBack onClick={handleReveal} />
            
            <div className="text-center space-y-2">
              <p className="text-white/60 tracking-widest text-sm animate-pulse">Tap to reveal your card</p>
            </div>
          </motion.div>
        )}

        {revealState === 1 && (
          <motion.div
            key="revealing"
            className="flex flex-col items-center justify-center absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[150vw] h-[150vh] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full filter blur-[100px]"
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        )}

        {revealState === 2 && card && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center w-full z-20"
          >
            {!isNewReveal && (
              <p className="text-cosmic-muted text-xs uppercase tracking-widest mb-6 text-center">
                Your cosmic card for today has been revealed.<br/>Come back tomorrow.
              </p>
            )}

            <CardContent card={card} />

            <div className="mt-12 flex flex-col w-full max-w-xs space-y-4">
              <PrimaryButton onClick={() => router.push(`/share/${card.id}`)}>
                Share Card
              </PrimaryButton>
              <PrimaryButton variant="secondary" onClick={() => router.push("/history")}>
                View History
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}
