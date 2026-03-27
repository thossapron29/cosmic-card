"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toBlob } from "html-to-image";
import { useQuery } from "@tanstack/react-query";
import { ScreenShell } from "@/components/screen-shell";
import { ShareCardView } from "@/components/share-card-view";
import { PrimaryButton } from "@/components/primary-button";
import { getAnonymousId } from "@/lib/utils";
import { ArrowLeft, Share } from "lucide-react";
import { HistoryDetailResponse } from "@/types/user-card";

export default function SharePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const userId = useMemo(() => getAnonymousId(), []);
  
  const [isExporting, setIsExporting] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery<HistoryDetailResponse>({
    queryKey: ["history-detail", id, userId],
    queryFn: async () => {
      if (!userId || !id) {
        throw new Error("History record not found");
      }

      const res = await fetch(`/api/history/${id}?userId=${userId}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to fetch history detail");
      return payload;
    },
    enabled: !!userId && !!id,
  });

  const card = useMemo(() => {
    return data?.item?.card ?? null;
  }, [data]);

  async function handleShare() {
    if (!shareRef.current || !card) return;
    setIsExporting(true);
    try {
      const blob = await toBlob(shareRef.current, {
        cacheBust: true,
        pixelRatio: 2,
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
        } catch (shareErr: unknown) {
          if (!(shareErr instanceof DOMException && shareErr.name === "AbortError")) {
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
        (await toBlob(shareRef.current, { cacheBust: true, pixelRatio: 2 }));
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
      <div className="flex flex-col w-full z-10 h-full overflow-hidden">
        <div className="flex items-center mb-4 sticky top-0 z-20">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-light tracking-[0.2em] uppercase ml-2 text-white/90">
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
          <div className="flex flex-col items-center w-full flex-1 justify-between">
            {/* Preview container */}
            <div className="relative w-full max-w-[300px] mx-auto shrink-0 bg-white/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="w-full" style={{ aspectRatio: '9/16', position: 'relative', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: '600px',
                    height: '1067px',
                    transform: `scale(${300 / 600})`,
                    transformOrigin: 'top center',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    marginLeft: '-300px'
                  }}
                >
                  <div ref={shareRef}>
                    <ShareCardView card={card} width={600} height={1067} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 w-full max-w-[300px] pt-5">
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
