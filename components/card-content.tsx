"use client";

import { Card } from "@/types/card";
import { motion } from "framer-motion";

interface CardContentProps {
  card: Card;
  compact?: boolean;
}

function formatLabel(value: string) {
  return value
    .split(/[-\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CardContent({ card, compact = false }: CardContentProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "max-w-xs space-y-5 px-2 py-1" : "max-w-sm space-y-8 p-6"
      } mx-auto`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div
          className={`mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/60 ${
            compact ? "mb-3" : "mb-4"
          }`}
        >
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {formatLabel(card.category)}
          </span>
          <span className="rounded-full border border-cosmic-accent/20 bg-cosmic-accent/10 px-3 py-1 text-cosmic-accent">
            {formatLabel(card.energy_tag)}
          </span>
        </div>
        <p className={`text-cosmic-accent uppercase ${compact ? "mb-1 text-[11px] tracking-[0.24em]" : "mb-2 text-sm tracking-[0.3em]"}`}>
          Today&apos;s Message
        </p>
        <h2 className={compact ? "text-[2rem] font-light tracking-[0.12em]" : "text-4xl font-light tracking-widest"}>
          {card.title}
        </h2>
      </motion.div>

      <motion.div
        className={`bg-white/20 ${compact ? "h-px w-10" : "h-px w-12"}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />

      <motion.p
        className={compact ? "text-base leading-7 text-white/90 font-light" : "text-xl leading-relaxed text-white/90 font-light"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        &quot;{card.short_message}&quot;
      </motion.p>

      <motion.div
        className={compact ? "space-y-3 pt-1" : "space-y-4 pt-4"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div>
          <h3 className={`text-cosmic-muted uppercase ${compact ? "mb-1 text-[11px] tracking-[0.22em]" : "mb-1 text-xs tracking-widest"}`}>
            Reflection
          </h3>
          <p className={compact ? "text-sm text-white/82 leading-6" : "text-sm text-white/85 leading-7"}>
            {card.full_message}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
