"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { DrawMode, RevealDrawResponse } from "@/lib/cosmic-api";

import {
  BackIcon,
  ChevronRightIcon,
  HeartIcon,
  IconButton,
  SaveIcon,
  SendIcon,
  ShareIcon,
} from "./DrawIcons";
import { SparkleField } from "./SparkleField";

type DrawResultScreenProps = {
  reveal: RevealDrawResponse;
  drawMode: DrawMode;
  onBack: () => void;
};

export function DrawResultScreen({
  reveal,
  drawMode,
  onBack,
}: DrawResultScreenProps) {
  const [favorite, setFavorite] = useState(false);
  const [actionLabel, setActionLabel] = useState("I feel this");
  const [saveLabel, setSaveLabel] = useState("Save");
  const [shareLabel, setShareLabel] = useState("Share");
  const shareText = useMemo(
    () =>
      reveal.card.shareText ||
      `${reveal.card.title}: ${reveal.card.shortMessage}`,
    [reveal.card.shareText, reveal.card.shortMessage, reveal.card.title],
  );

  function handleSave() {
    const savedDraws = JSON.parse(
      window.localStorage.getItem("cosmic-card:saved-draws") || "[]",
    ) as RevealDrawResponse[];

    window.localStorage.setItem(
      "cosmic-card:saved-draws",
      JSON.stringify([reveal, ...savedDraws].slice(0, 20)),
    );
    setSaveLabel("Saved");
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: reveal.card.title,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareLabel("Copied");
      }
    } catch {
      setShareLabel("Copy failed");
    }
  }

  function handleFeelThis() {
    window.localStorage.setItem(
      "cosmic-card:last-resonance",
      String(reveal.drawId),
    );
    setActionLabel("Felt");
  }

  function handleActionDetail() {
    window.localStorage.setItem(
      "cosmic-card:last-action",
      reveal.card.meaning || "Make one decision without needing all the details.",
    );
    setActionLabel("Action noted");
  }

  async function handleReflectionDetail() {
    try {
      await navigator.clipboard.writeText(reveal.card.reflectionPrompt);
      setShareLabel("Prompt copied");
    } catch {
      setShareLabel("Copy failed");
    }
  }

  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[linear-gradient(180deg,#1c106d_0%,#3d2491_44%,#9f63d9_76%,#ffc4de_100%)] px-5 pb-[calc(env(safe-area-inset-bottom)+92px)] pt-[calc(env(safe-area-inset-top)+20px)] text-white sm:px-6">
      <SparkleField dark />

      <header className="animate-draw-fade relative z-10 flex shrink-0 items-center justify-between">
        <IconButton label="Back to draw" onClick={onBack}>
          <BackIcon />
        </IconButton>

        <div className="flex gap-3">
          <IconButton label="Share card" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
          <IconButton
            label={favorite ? "Unfavorite card" : "Favorite card"}
            onClick={() => setFavorite((current) => !current)}
          >
            <span className={favorite ? "text-[#ff6ea9]" : "text-[#ffb4cf]"}>
              <HeartIcon />
            </span>
          </IconButton>
        </div>
      </header>

      <article className="animate-result-card-in relative z-10 mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[36px] border-[7px] border-white bg-[#fffdfa] text-[#17203f] shadow-[0_24px_64px_rgba(18,10,69,0.28)]">
        <div className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-[#dccdff]">
          <div className="px-5 pb-3 pt-6 text-center">
            <div className="text-[1.7rem] leading-none text-[#865cff]">✦</div>
            <span className="mt-3 inline-flex rounded-full bg-[linear-gradient(135deg,#7a52ff,#a060ff)] px-4 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_18px_rgba(119,82,255,0.2)]">
              {reveal.card.energyType || drawMode}
            </span>
            <h1 className="mx-auto mt-5 max-w-[18rem] font-[family:var(--font-cormorant)] text-[2.35rem] font-bold leading-none text-[#17203f]">
              {reveal.card.title}
            </h1>
            <div className="mx-auto mt-5 flex max-w-[13rem] items-center gap-4 text-[#ff90bd]">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#ffadd0]" />
              <span className="text-[1.6rem] leading-none">♡</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#ffadd0]" />
            </div>
            <p className="mx-auto mt-4 max-w-[16rem] overflow-hidden text-[1.08rem] font-medium leading-7 text-[#273052] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
              {reveal.card.shortMessage}
            </p>
          </div>

          <div className="relative mx-5 h-[122px] shrink-0 overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#fff7fb_0%,#f4ddff_54%,#d7b5ff_100%)]">
            <div className="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(ellipse_at_bottom,#b894ff_0%,rgba(184,148,255,0)_68%)]" />
            <div className="absolute inset-x-0 bottom-0 flex justify-center">
              <div className="relative h-[104px] w-[96px]">
                <Image
                  src="/assets/cosmic/card-stack.png"
                  alt="Glowing cosmic card"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 divide-y divide-[#eee6ff] overflow-y-auto px-5">
            <button
              type="button"
              onClick={handleActionDetail}
              className="flex w-full items-center gap-4 py-4 text-left transition active:scale-[0.99]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4edff] text-lg text-[#7a52ff]">
                ✦
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-[#17203f]">
                  Today&apos;s Action
                </span>
                <span className="mt-1 block overflow-hidden text-sm leading-6 text-[#606986] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                  {reveal.card.meaning || "Make one decision without needing all the details."}
                </span>
              </span>
              <ChevronRightIcon />
            </button>

            <button
              type="button"
              onClick={handleReflectionDetail}
              className="flex w-full items-center gap-4 py-4 text-left transition active:scale-[0.99]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4edff] text-lg text-[#7a52ff]">
                ☾
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-[#17203f]">
                  Reflection
                </span>
                <span className="mt-1 block overflow-hidden text-sm leading-6 text-[#606986] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                  {reveal.card.reflectionPrompt}
                </span>
              </span>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </article>

      <div className="animate-draw-rise relative z-10 mt-5 grid shrink-0 grid-cols-[1fr_1.32fr_1fr] gap-3 [animation-delay:100ms]">
        <button
          type="button"
          onClick={handleSave}
          className="flex h-13 items-center justify-center gap-2 rounded-full bg-white/88 text-sm font-bold text-[#704cff] shadow-[0_14px_28px_rgba(37,23,89,0.14)] backdrop-blur-xl transition active:scale-95"
        >
          <SaveIcon />
          {saveLabel}
        </button>
        <button
          type="button"
          onClick={handleFeelThis}
          className="flex h-13 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#724eff,#984dff)] text-sm font-bold text-white shadow-[0_16px_30px_rgba(92,55,218,0.28)] transition active:scale-95"
        >
          <span>✦</span>
          {actionLabel}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex h-13 items-center justify-center gap-2 rounded-full bg-white/88 text-sm font-bold text-[#704cff] shadow-[0_14px_28px_rgba(37,23,89,0.14)] backdrop-blur-xl transition active:scale-95"
        >
          <SendIcon />
          {shareLabel}
        </button>
      </div>
    </div>
  );
}
