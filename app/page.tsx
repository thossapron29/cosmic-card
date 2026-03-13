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

  // 1. Zero-Load Check: Disabled for unlimited reveals
  // Users can reveal multiple cards per day
  useEffect(() => {
    // Clear cache to allow fresh reveals
    localStorage.removeItem('cosmic-card-today');
  }, []);

  // 2. Query History is optional now (no day limit)
  const { isPending: loadingHistory } = useQuery({
    queryKey: ["history", userId],
    queryFn: async () => {
      if (!userId) return { history: [] };
      const res = await fetch(`/api/history?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: false, // Disable auto-fetch, user can view history separately
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
      setIsNewReveal(true);
      // Don't cache for unlimited reveals
      
      // Update history cache
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

  // Final check for loading state
  const isCheckingData = false; // No pre-loading needed for unlimited reveals

  if (isCheckingData) {
    return (
      <ScreenShell className="items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          {/* Modern minimal spinner */}
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-cosmic-accent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-transparent border-b-cosmic-accent/50"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-cosmic-accent/10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <motion.p
            className="text-white/40 text-sm tracking-widest uppercase"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading...
          </motion.p>
        </div>
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
            {/* Card flip animation */}
            <motion.div
              className="relative w-64 h-96"
              style={{ perspective: 1000 }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 180 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <GlowingCardBack />
            </motion.div>
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
            <CardContent card={card} />

            <div className="mt-12 flex flex-col w-full max-w-xs space-y-4">
              <PrimaryButton onClick={() => {
                setRevealState(0);
                setCard(null);
              }}>
                Reveal Another Card
              </PrimaryButton>
              <PrimaryButton variant="secondary" onClick={() => router.push(`/share/${card.id}`)}>
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
