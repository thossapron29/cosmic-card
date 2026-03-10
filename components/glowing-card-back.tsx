"use client";

import { motion } from "framer-motion";

interface GlowingCardBackProps {
  onClick?: () => void;
}

export function GlowingCardBack({ onClick }: GlowingCardBackProps) {
  return (
    <motion.div
      onClick={onClick}
      className="relative w-64 h-96 cursor-pointer group rounded-2xl"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect behind the card */}
      <motion.div
        className="absolute -inset-1 bg-cosmic-accent/30 rounded-2xl blur-xl"
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Actual Card */}
      <div className="relative w-full h-full rounded-2xl bg-cosmic-card border border-white/10 flex items-center justify-center overflow-hidden">
        {/* Subtle inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        
        {/* Center emblem or shape */}
        <div className="relative flex flex-col items-center justify-center space-y-4">
          <motion.div
            className="w-12 h-12 border border-cosmic-accent/50 rotate-45 rounded-sm flex items-center justify-center"
            animate={{ rotate: [45, 225] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-4 h-4 bg-cosmic-accent/80 rounded-full" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
