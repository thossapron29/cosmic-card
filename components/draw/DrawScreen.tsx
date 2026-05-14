import Image from "next/image";
import Link from "next/link";

import type { CosmicDeck, DrawMode } from "@/lib/cosmic-api";

import {
  ChevronDownIcon,
  CloseIcon,
  IconButton,
  SlidersIcon,
} from "./DrawIcons";
import { DRAW_QUESTION } from "./draw-config";
import { SparkleField } from "./SparkleField";

type DrawScreenProps = {
  selectedDeck: CosmicDeck | null;
  drawMode: DrawMode;
  canReveal: boolean;
  isPending: boolean;
  error: string;
  onReveal: () => void;
  onOpenSettings: () => void;
};

export function DrawScreen({
  selectedDeck,
  drawMode,
  canReveal,
  isPending,
  error,
  onReveal,
  onOpenSettings,
}: DrawScreenProps) {
  return (
    <div className="relative mx-auto flex h-[100svh] w-full max-w-[430px] flex-col overflow-hidden bg-[linear-gradient(180deg,#fff8fc_0%,#f8ecff_54%,#f2e8ff_100%)] px-5 pb-[calc(env(safe-area-inset-bottom)+88px)] pt-[calc(env(safe-area-inset-top)+12px)] text-[#17203f] sm:px-6">
      <SparkleField />

      <header className="animate-draw-fade relative z-10 flex shrink-0 items-center justify-between">
        <Link
          href="/"
          aria-label="Close draw"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/78 text-[#273052] shadow-[0_12px_26px_rgba(43,35,87,0.1)] backdrop-blur-xl transition active:scale-95"
        >
          <CloseIcon />
        </Link>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-12 max-w-[188px] min-w-0 items-center gap-2 rounded-full border border-white/70 bg-white/82 px-5 text-base font-extrabold text-[#17203f] shadow-[0_12px_26px_rgba(43,35,87,0.1)] backdrop-blur-xl transition active:scale-95"
        >
          <span className="truncate">{selectedDeck?.name ?? "Choose Deck"}</span>
          <ChevronDownIcon />
        </button>

        <IconButton label="Draw settings" onClick={onOpenSettings}>
          <SlidersIcon />
        </IconButton>
      </header>

      <section className="animate-draw-rise relative z-10 shrink-0 pt-5 text-center">
        <div className="text-[1.55rem] leading-none text-[#9b75ff]">✦</div>
        <p className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#9368f4]">
          Take a deep breath
        </p>
        <p className="mx-auto mt-2 max-w-[17rem] text-[1.04rem] font-medium leading-6 text-[#17203f]">
          Focus on your question and trust the timing.
        </p>
        <div className="mx-auto mt-2.5 flex max-w-[9.5rem] items-center gap-4 text-[#ff9ac6]">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#ffb3d2]" />
          <span className="text-[1.45rem] leading-none">♡</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#ffb3d2]" />
        </div>
        <h1 className="mx-auto mt-4 max-w-[18rem] font-[family:var(--font-cormorant)] text-[2.12rem] font-bold leading-[0.95] text-[#17203f]">
          {DRAW_QUESTION}
          <span className="text-[#ffbf66]"> ✦</span>
        </h1>
      </section>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-2">
        <button
          type="button"
          onClick={onReveal}
          disabled={!canReveal}
          className="animate-deck-breathe relative block h-full max-h-[270px] min-h-[170px] w-full max-w-[350px] transition duration-300 active:scale-[0.985] disabled:animate-none disabled:opacity-70"
          aria-label="Tap the deck to draw your card"
        >
          <Image
            src="/assets/cosmic/card-stack.png"
            alt="Large cosmic deck ready to draw"
            fill
            sizes="382px"
            className="object-contain drop-shadow-[0_24px_42px_rgba(78,45,163,0.26)]"
            priority
          />
          {isPending ? (
            <span className="absolute inset-x-0 bottom-6 mx-auto w-fit rounded-full bg-white/88 px-5 py-2 text-sm font-bold text-[#7452ef] shadow-[0_12px_24px_rgba(43,35,87,0.12)] backdrop-blur-xl">
              Revealing...
            </span>
          ) : null}
        </button>
      </div>

      <footer className="animate-draw-rise relative z-10 shrink-0 text-center [animation-delay:120ms]">
        <div className="text-[1.35rem] font-bold leading-none text-[#7452ef]">⌃</div>
        <p className="mx-auto mt-2 max-w-[13rem] text-[1rem] font-medium leading-6 text-[#17203f]">
          Tap the deck to draw your card
        </p>
        <button
          type="button"
          onClick={onOpenSettings}
          className="mt-2.5 rounded-full bg-white/58 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8b74d4] backdrop-blur-xl transition active:scale-95"
        >
          {drawMode} mode
        </button>

        {error ? (
          <div className="mt-3 rounded-[20px] border border-[#ffd2e4] bg-white/82 px-4 py-3 text-sm font-semibold leading-6 text-[#b44470] shadow-[0_12px_26px_rgba(43,35,87,0.08)] backdrop-blur-xl">
            {error}
          </div>
        ) : null}
      </footer>
    </div>
  );
}
