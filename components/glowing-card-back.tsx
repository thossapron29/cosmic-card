"use client";

import { motion } from "framer-motion";

interface GlowingCardBackProps {
  onClick?: () => void;
}

export function GlowingCardBack({ onClick }: GlowingCardBackProps) {
  return (
    <motion.div
      onClick={onClick}
      className="relative h-[22rem] w-[14.5rem] cursor-pointer group rounded-2xl sm:h-96 sm:w-64"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect behind the card */}
      <motion.div
        className="absolute -inset-2 rounded-[1.75rem] bg-cosmic-accent/18 blur-2xl"
        animate={{
          opacity: [0.26, 0.5, 0.26],
          scale: [0.98, 1.03, 0.98],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Actual Card */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/12 bg-cosmic-card shadow-[0_28px_90px_-54px_rgba(10,5,28,0.95)]">
        {/* Subtle inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/[0.03] to-transparent" />
        
        {/* Animated cosmic pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer ring - slow rotation */}
          <motion.div
            className="absolute h-32 w-32 rounded-full border border-cosmic-accent/14"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle ring - medium rotation */}
          <motion.div
            className="absolute h-24 w-24 rounded-full border border-cosmic-accent/22"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner pulsing circle */}
          <motion.div
            className="absolute h-16 w-16 rounded-full bg-gradient-to-br from-cosmic-accent/16 to-cosmic-accent/[0.04] backdrop-blur-sm"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Center orb */}
          <motion.div
            className="relative h-3 w-3 rounded-full bg-cosmic-accent shadow-[0_0_20px_rgba(240,202,103,0.72)]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
          animate={{ x: [-300, 300] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
        />
      </div>
    </motion.div>
  );
}
