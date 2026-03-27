"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ScreenShell } from "@/components/screen-shell";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId } from "@/lib/utils";
import { ArrowLeft, Heart } from "lucide-react";
import { HistoryListResponse, UserCard } from "@/types/user-card";

export default function HistoryPage() {
  const router = useRouter();
  const userId = useMemo(() => getAnonymousId(), []);
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const { data, isLoading, error } = useQuery<HistoryListResponse>({
    queryKey: ["history", userId, filter],
    queryFn: async () => {
      if (!userId) return { success: true, history: [] };
      const favoritesOnly = filter === "favorites" ? "&favoritesOnly=true" : "";
      const res = await fetch(`/api/history?userId=${userId}${favoritesOnly}`);
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

        <div className="mb-6 flex gap-3">
          <PrimaryButton
            variant={filter === "all" ? "primary" : "secondary"}
            onClick={() => setFilter("all")}
            className="px-4 py-2 text-sm"
          >
            All
          </PrimaryButton>
          <PrimaryButton
            variant={filter === "favorites" ? "primary" : "secondary"}
            onClick={() => setFilter("favorites")}
            className="px-4 py-2 text-sm"
          >
            Favorites
          </PrimaryButton>
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
              {filter === "favorites" ? "No favorites yet." : "Your history is empty."}
            </p>
            <p className="text-white/40 text-sm">
              {filter === "favorites"
                ? "Favorite a reveal you want to keep close."
                : "Reveal your first card to begin your journey."}
            </p>
            <PrimaryButton variant="secondary" onClick={() => router.push("/")}>
              Home
            </PrimaryButton>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {history.map((item: UserCard, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/history/${item.id}`)}
                  className="bg-cosmic-card/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-white/5 transition-colors group flex flex-col space-y-2"
                >
                  <div className="flex justify-between items-center text-cosmic-accent text-xs uppercase tracking-widest">
                    <span>
                      {new Date(item.revealed_at).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                    {item.is_favorite ? (
                      <Heart className="h-4 w-4 fill-cosmic-accent text-cosmic-accent" />
                    ) : null}
                  </div>
                  <h3 className="text-2xl font-light tracking-widest text-white/90 group-hover:text-white">
                    {item.card?.title}
                  </h3>
                  <p className="text-white/60 line-clamp-1 italic font-light text-sm">
                    {item.card?.short_message}
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
