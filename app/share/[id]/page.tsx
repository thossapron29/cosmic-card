"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toBlob } from "html-to-image";
import { useQuery } from "@tanstack/react-query";
import { ScreenShell } from "@/components/screen-shell";
import { ShareCardView } from "@/components/share-card-view";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId } from "@/lib/utils";
import { ArrowLeft, Download, Share } from "lucide-react";

export default function SharePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const userId = useMemo(() => getAnonymousId(), []);
  
  const [isExporting, setIsExporting] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

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

  const card = useMemo(() => {
    return data?.history?.find((h: any) => h.card?.id === id)?.card;
  }, [data, id]);

  async function handleShare() {
    if (!shareRef.current || !card) return;
    setIsExporting(true);
    try {
      const blob = await toBlob(shareRef.current, {
        cacheBust: true,
        pixelRatio: 1,
      });
      if (!blob) throw new Error("Could not generate image");

      const file = new File([blob], `CosmicCard-${card.title}.png`, {
        type: "image/png",
      });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: "Cosmic Card",
            text: "A message from the universe.",
            files: [file],
          });
        } catch (shareErr: any) {
          if (shareErr.name !== "AbortError") {
            handleDownload(blob);
          }
        }
      } else {
        handleDownload(blob);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to share.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDownload(existingBlob?: Blob) {
    if (!shareRef.current || !card) return;
    setIsExporting(true);
    try {
      const blob =
        existingBlob ||
        (await toBlob(shareRef.current, { cacheBust: true, pixelRatio: 1 }));
      if (!blob) throw new Error("Could not generate image");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CosmicCard-${card.title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to download image.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <ScreenShell>
      <div className="flex flex-col w-full z-10 h-full overflow-hidden pb-12">
        <div className="flex items-center mb-8 sticky top-0 z-20">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-light tracking-[0.2em] uppercase ml-2 text-white/90">
            Share
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-t-2 border-cosmic-accent rounded-full animate-spin" />
          </div>
        ) : error || !card ? (
          <p className="text-red-400 text-center py-20">
            {error ? (error as Error).message : "Card not found in your journey"}
          </p>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="relative w-[300px] h-[533px] shrink-0 bg-white/5 rounded-2xl overflow-hidden shadow-2xl  border border-white/10 mb-8 pointer-events-none">
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={{ transform: `scale(${300 / 1080})` }}
                ref={shareRef}
              >
                <ShareCardView card={card} />
              </div>
            </div>

            <div className="flex space-x-4 w-full max-w-[300px]">
              <PrimaryButton
                onClick={handleShare}
                className="flex-1 flex justify-center items-center gap-2 border-none"
                disabled={isExporting}
              >
                <Share className="w-4 h-4" /> Share
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
