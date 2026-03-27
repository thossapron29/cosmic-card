"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

function fixed(value: number, digits = 4) {
  return value.toFixed(digits);
}

function createDeterministicStar(index: number) {
  const seed = Math.sin(index * 999) * 10000;
  const fractional = (value: number) => value - Math.floor(value);
  const top = fractional(seed) * 100;
  const left = fractional(seed * 1.37) * 100;
  const size = fractional(seed * 1.73) * 2 + 1;
  const delay = fractional(seed * 2.11) * 5;
  const duration = fractional(seed * 2.53) * 3 + 2;

  return {
    id: index,
    top: `${fixed(top)}%`,
    left: `${fixed(left)}%`,
    size: `${fixed(size)}px`,
    delay: Number(fixed(delay, 3)),
    duration: Number(fixed(duration, 3)),
  };
}

export function CosmicBackground() {
  const stars = useMemo(
    () => Array.from({ length: 40 }, (_, index) => createDeterministicStar(index)),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-y-[-2px] -left-2 -right-3 z-[-1] cosmic-gradient overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.05),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.025),rgba(10,5,28,0.14))]" />
      <div className="absolute inset-y-0 -right-4 w-8 bg-[linear-gradient(270deg,#140b30_45%,rgba(20,11,48,0))]" />
    </div>
  );
}
