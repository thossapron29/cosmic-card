"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { History, UserRound } from "lucide-react";
import { ScreenShell } from "@/components/screen-shell";
import { GlowingCardBack } from "@/components/glowing-card-back";
import { CardContent } from "@/components/card-content";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId, getTodayDateStr } from "@/lib/utils";
import { Card } from "@/types/card";
import { RevealResponse } from "@/types/user-card";
import { useViewer } from "@/providers/viewer-provider";

const DEFAULT_DECK_SLUG = "cosmic-core";

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { anonymousId } = useViewer();
  const userId = useMemo(() => anonymousId ?? getAnonymousId(), [anonymousId]);

  const [revealState, setRevealState] = useState<0 | 1 | 2>(0);
  const [card, setCard] = useState<Card | null>(null);
  const [userCardId, setUserCardId] = useState<string | null>(null);

  const revealMutation = useMutation({
    mutationFn: async (): Promise<RevealResponse> => {
      const res = await fetch("/api/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          localDate: getTodayDateStr(),
          deckSlug: DEFAULT_DECK_SLUG,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reveal card");
      return data;
    },
    onSuccess: (data) => {
      setCard(data.card);
      setUserCardId(data.user_card_id);
      queryClient.invalidateQueries({ queryKey: ["history", userId] });

      setTimeout(() => {
        setRevealState(2);
      }, 1500);
    },
    onError: (err: Error) => {
      setRevealState(0);
      alert(err.message);
    },
  });

  function handleReveal() {
    if (!userId || revealState !== 0 || revealMutation.isPending) return;
    setRevealState(1);
    revealMutation.mutate();
  }

  const isCheckingData = false;

  if (isCheckingData) {
    return (
      <ScreenShell scrollMode="locked" className="items-center justify-center">
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
    <ScreenShell
      scrollMode="locked"
      className="mx-auto max-w-[26rem] justify-center"
    >
      <AnimatePresence mode="wait">
        {revealState === 0 && (
          <motion.div
            key="unrevealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="flex h-full w-full flex-col items-center justify-center"
          >
            <div className="w-full space-y-8 text-center">
              <div className="space-y-3">
                <h1 className="text-[2rem] font-light tracking-[0.24em] uppercase text-white/92">
                  Cosmic Card
                </h1>
                <p className="text-cosmic-muted text-[11px] tracking-[0.32em] uppercase">
                  A quiet message for this moment
                </p>
              </div>

              <div className="flex items-center justify-center">
                <GlowingCardBack onClick={handleReveal} />
              </div>

              <div className="space-y-3">
                <p className="text-white/62 tracking-[0.22em] text-sm uppercase animate-pulse">
                  Tap to reveal your card
                </p>
                <p className="mx-auto max-w-[16rem] text-sm leading-6 text-white/48">
                  No setup, no pressure. Just one reflective message at a time.
                </p>
              </div>

              <div className="grid w-full max-w-[13rem] mx-auto grid-cols-2 gap-3">
                <PrimaryButton variant="secondary" className="px-3 py-2.5 text-sm" onClick={() => router.push("/history")}>
                  <span className="flex items-center justify-center gap-2">
                    <History className="h-4 w-4" /> History
                  </span>
                </PrimaryButton>
                <PrimaryButton variant="secondary" className="px-3 py-2.5 text-sm" onClick={() => router.push("/profile")}>
                  <span className="flex items-center justify-center gap-2">
                    <UserRound className="h-4 w-4" /> Profile
                  </span>
                </PrimaryButton>
              </div>
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
            className="flex h-full w-full flex-col items-center justify-center z-20"
          >
            <div className="w-full space-y-6 text-center">
              <CardContent card={card} compact />

              <div className="w-full max-w-xs mx-auto space-y-3">
                <PrimaryButton
                  onClick={() => {
                    setRevealState(0);
                    setCard(null);
                    setUserCardId(null);
                  }}
                >
                  Reveal Another Card
                </PrimaryButton>
                <div className="grid grid-cols-2 gap-3">
                  <PrimaryButton
                    variant="secondary"
                    onClick={() => userCardId && router.push(`/share/${userCardId}`)}
                    disabled={!userCardId}
                  >
                    Share
                  </PrimaryButton>
                  <PrimaryButton variant="secondary" onClick={() => router.push("/history")}>
                    History
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}
