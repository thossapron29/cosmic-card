"use client";

import { Card } from "@/types/card";
import { motion } from "framer-motion";

interface CardContentProps {
  card: Card;
}

export function CardContent({ card }: CardContentProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 p-6 max-w-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p className="text-cosmic-accent text-sm tracking-[0.3em] uppercase mb-2">Today&apos;s Message</p>
        <h2 className="text-4xl font-light tracking-widest">{card.title}</h2>
      </motion.div>

      <motion.div
        className="w-12 h-px bg-white/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />

      <motion.p
        className="text-xl leading-relaxed text-white/90 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        &quot;{card.message}&quot;
      </motion.p>

      <motion.div
        className="space-y-4 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div>
          <h3 className="text-xs text-cosmic-muted uppercase tracking-widest mb-1">Affirmation</h3>
          <p className="text-sm font-medium text-cosmic-accent">{card.affirmation}</p>
        </div>
        
        <div>
          <h3 className="text-xs text-cosmic-muted uppercase tracking-widest mb-1">Reflection</h3>
          <p className="text-sm text-white/80 italic">{card.reflection}</p>
        </div>
      </motion.div>
    </div>
  );
}
