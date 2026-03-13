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
        
        {/* Animated cosmic pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer ring - slow rotation */}
          <motion.div
            className="absolute w-32 h-32 rounded-full border border-cosmic-accent/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle ring - medium rotation */}
          <motion.div
            className="absolute w-24 h-24 rounded-full border border-cosmic-accent/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner pulsing circle */}
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-cosmic-accent/20 to-cosmic-accent/5 backdrop-blur-sm"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Center orb */}
          <motion.div
            className="relative w-3 h-3 rounded-full bg-cosmic-accent shadow-[0_0_20px_rgba(139,92,246,0.8)]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: [-300, 300] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
        />
      </div>
    </motion.div>
  );
}
