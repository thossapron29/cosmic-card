"use client";

import { LockKeyhole, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Deck } from "@/types/deck";

interface DeckCardProps {
  deck: Deck;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DeckCard({ deck, selected = false, onClick, className }: DeckCardProps) {
  const content = (
    <div
      className={cn(
        "group rounded-[2rem] border p-5 text-left backdrop-blur-md transition-all duration-300",
        selected
          ? "border-cosmic-accent/40 bg-white/[0.14] shadow-[0_18px_50px_-24px_rgba(240,202,103,0.8)]"
          : "border-white/10 bg-white/[0.07] hover:border-white/20 hover:bg-white/10",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em]">
            <span className="rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-white/65">
              {deck.card_count ?? 0} cards
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1",
                deck.is_premium
                  ? "border border-cosmic-accent/30 bg-cosmic-accent/[0.12] text-cosmic-accent"
                  : "border border-emerald-200/20 bg-emerald-100/10 text-emerald-100"
              )}
            >
              {deck.is_premium ? "Premium" : "Free"}
            </span>
          </div>
          <h3 className="text-xl font-light tracking-[0.14em] uppercase text-white/92">
            {deck.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/62">
            {deck.description || "A reflective deck to meet this moment with clarity."}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border",
            deck.is_locked
              ? "border-cosmic-accent/25 bg-cosmic-accent/10 text-cosmic-accent"
              : "border-white/[0.12] bg-white/[0.08] text-white/78"
          )}
        >
          {deck.is_locked ? <LockKeyhole className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/46">
        <span>{deck.theme_key?.replace(/[-_]/g, " ") || "signature theme"}</span>
        <span className="text-cosmic-accent">{selected ? "Selected" : deck.is_locked ? "Locked" : "Open"}</span>
      </div>
    </div>
  );

  if (!onClick) {
    return content;
  }

  return (
    <button type="button" onClick={onClick} className="w-full">
      {content}
    </button>
  );
}
