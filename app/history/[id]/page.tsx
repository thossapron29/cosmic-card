"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScreenShell } from "@/components/screen-shell";
import { CardContent } from "@/components/card-content";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId } from "@/lib/utils";
import { ArrowLeft, Heart, NotebookPen } from "lucide-react";
import { HistoryDetailResponse } from "@/types/user-card";

export default function HistoryDetailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params.id as string;
  const userId = useMemo(() => getAnonymousId(), []);
  const [draftNote, setDraftNote] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<HistoryDetailResponse>({
    queryKey: ["history-detail", id, userId],
    queryFn: async () => {
      if (!userId || !id) {
        throw new Error("User or record not found");
      }

      const res = await fetch(`/api/history/${id}?userId=${userId}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to fetch history detail");
      return payload;
    },
    enabled: !!userId && !!id,
  });

  const record = data?.item;
  const note = draftNote ?? record?.journal_note ?? "";

  const favoriteMutation = useMutation({
    mutationFn: async (nextFavoriteState: boolean) => {
      const endpoint = nextFavoriteState ? "favorite" : "unfavorite";
      const res = await fetch(`/api/history/${id}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to update favorite");
      return payload as HistoryDetailResponse;
    },
    onSuccess: (payload) => {
      queryClient.setQueryData(["history-detail", id, userId], payload);
      queryClient.invalidateQueries({ queryKey: ["history", userId] });
    },
  });

  const journalMutation = useMutation({
    mutationFn: async (nextNote: string) => {
      const res = await fetch(`/api/history/${id}/journal`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, note: nextNote }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to save journal note");
      return payload as HistoryDetailResponse;
    },
    onSuccess: (payload) => {
      queryClient.setQueryData(["history-detail", id, userId], payload);
      queryClient.invalidateQueries({ queryKey: ["history", userId] });
      setDraftNote(payload.item.journal_note ?? "");
    },
  });

  const noteHasChanged = note.trim() !== (record?.journal_note ?? "");

  return (
    <ScreenShell>
      <div className="flex flex-col w-full z-10 h-full">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.push("/history")}
            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="ml-2">
            <p className="text-white/40 text-xs tracking-widest uppercase">Revealed</p>
            {record && (
              <p className="text-cosmic-accent text-sm tracking-widest uppercase mt-1">
                {new Date(record.revealed_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
              <div className="w-8 h-8 border-t-2 border-cosmic-accent rounded-full animate-spin" />
            </motion.div>
          </div>
        ) : error || !record?.card ? (
          <div className="text-center py-20 space-y-6">
            <p className="text-red-400">{error instanceof Error ? error.message : "Card not found"}</p>
            <PrimaryButton variant="secondary" onClick={() => router.push("/history")}>
              Back to History
            </PrimaryButton>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center grow"
          >
            <CardContent card={record.card} />

            <div className="mt-8 flex flex-col w-full space-y-4 max-w-sm">
              <PrimaryButton
                variant={record.is_favorite ? "primary" : "secondary"}
                onClick={() => favoriteMutation.mutate(!record.is_favorite)}
                disabled={favoriteMutation.isPending}
                className="flex items-center justify-center gap-2"
              >
                <Heart
                  className={`h-4 w-4 ${record.is_favorite ? "fill-cosmic-bg" : "fill-transparent"}`}
                />
                {record.is_favorite ? "Favorited" : "Add to Favorites"}
              </PrimaryButton>

              <PrimaryButton onClick={() => router.push(`/share/${record.id}`)}>
                Share Card
              </PrimaryButton>
            </div>

            <div className="mt-6 w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="mb-3 flex items-center gap-2 text-white/80">
                <NotebookPen className="h-4 w-4 text-cosmic-accent" />
                <h3 className="text-sm uppercase tracking-[0.22em] text-cosmic-accent">
                  Journal Reflection
                </h3>
              </div>
              <textarea
                value={note}
                onChange={(event) => setDraftNote(event.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Today I needed this reminder more than I expected..."
                className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-cosmic-bg/50 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-cosmic-accent/50"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-white/45">
                <span>
                  {record.journal_updated_at
                    ? `Updated ${new Date(record.journal_updated_at).toLocaleString()}`
                    : "Private to this reveal"}
                </span>
                <span>{note.length}/1000</span>
              </div>
              <div className="mt-4 flex gap-3">
                <PrimaryButton
                  onClick={() => journalMutation.mutate(note)}
                  disabled={!noteHasChanged || journalMutation.isPending}
                  className="px-4 py-2 text-sm"
                >
                  {journalMutation.isPending ? "Saving..." : "Save Note"}
                </PrimaryButton>
                <PrimaryButton
                  variant="secondary"
                  onClick={() => setDraftNote(record.journal_note ?? "")}
                  disabled={!noteHasChanged || journalMutation.isPending}
                  className="px-4 py-2 text-sm"
                >
                  Reset
                </PrimaryButton>
              </div>
              {journalMutation.isError ? (
                <p className="mt-3 text-sm text-red-300">
                  {(journalMutation.error as Error).message}
                </p>
              ) : null}
            </div>
          </motion.div>
        )}
      </div>
    </ScreenShell>
  );
}
