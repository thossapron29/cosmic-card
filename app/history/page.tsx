"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ScreenShell } from "@/components/screen-shell";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const userId = useMemo(() => getAnonymousId(), []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["history", userId],
    queryFn: async () => {
      if (!userId) return { history: [] };
      const res = await fetch(`/api/history?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: !!userId,
  });

  const history = data?.history || [];

  return (
    <ScreenShell>
      <div className="flex flex-col w-full z-10">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-light tracking-[0.2em] uppercase ml-2 text-white/90">
            Your Journey
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-8 h-8 border-t-2 border-cosmic-accent rounded-full animate-spin" />
            </motion.div>
          </div>
        ) : error ? (
          <p className="text-red-400 text-center">{(error as Error).message}</p>
        ) : history.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <p className="text-white/50 text-xl font-light">
              Your history is empty.
            </p>
            <p className="text-white/40 text-sm">
              Reveal your first card to begin your journey.
            </p>
            <PrimaryButton variant="secondary" onClick={() => router.push("/")}>
              Home
            </PrimaryButton>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {history.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/history/${item.card?.id}`)}
                  className="bg-cosmic-card/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-white/5 transition-colors group flex flex-col space-y-2"
                >
                  <div className="flex justify-between items-center text-cosmic-accent text-xs uppercase tracking-widest">
                    <span>
                      {new Date(item.revealed_date).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <h3 className="text-2xl font-light tracking-widest text-white/90 group-hover:text-white">
                    {item.card?.title}
                  </h3>
                  <p className="text-white/60 line-clamp-1 italic font-light text-sm">
                    {item.card?.message}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
