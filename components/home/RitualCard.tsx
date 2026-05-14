import Image from "next/image";
import Link from "next/link";

import { CosmicCardStack } from "@/components/cosmic/CosmicCardStack";
import { AppCard } from "@/components/ui/AppCard";
import type { RitualCardData } from "@/types/home";

function SparkleDot() {
  return (
    <span
      aria-hidden="true"
      className="absolute text-[1rem] text-white/85 drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
    >
      ✦
    </span>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h12" />
      <path d="m10 4 6 6-6 6" />
    </svg>
  );
}

export function RitualCard({
  eyebrow,
  title,
  italicTitle,
  description,
  buttonLabel,
  cardStackSrc,
  communityText,
  avatars,
}: RitualCardData) {
  return (
    <AppCard className="animate-draw-rise relative overflow-hidden rounded-[32px] border-none bg-[linear-gradient(135deg,#6e4cff_0%,#8e59ff_24%,#be7aff_68%,#f0a7df_100%)] px-5 py-5 text-white shadow-[0_26px_60px_rgba(72,42,182,0.28)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_34%),radial-gradient(circle_at_24%_80%,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_30%)]" />
      <SparkleDot />
      <div className="absolute left-6 top-24">
        <SparkleDot />
      </div>
      <div className="absolute right-5 top-5">
        <SparkleDot />
      </div>
      <div className="absolute bottom-16 right-24">
        <SparkleDot />
      </div>

      <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_152px] items-start gap-3">
        <div className="min-w-0 pr-1">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.24em] text-white/85">
            {eyebrow}
          </p>

          <h3 className="mt-4 max-w-[11rem] text-[2.75rem] font-extrabold leading-[0.92] tracking-[-0.08em]">
            {title}
          </h3>
          <p className="font-[family:var(--font-cormorant)] text-[2.4rem] font-semibold italic leading-[0.95] text-white/94">
            {italicTitle}
          </p>

          <p className="mt-4 max-w-[12rem] text-[1.02rem] leading-7 text-white/82">
            {description}
          </p>

          <Link
            href="/draw"
            className="mt-6 inline-flex w-fit items-center justify-center gap-3 rounded-full bg-white px-5 py-3.5 text-[1rem] font-semibold text-[#182142] shadow-[0_14px_30px_rgba(42,31,94,0.16)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(42,31,94,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#8e59ff] active:scale-[0.98]"
          >
            <span className="text-[#7b57ff]">✦</span>
            {buttonLabel}
            <ArrowRightIcon />
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-3">
              {avatars.map((avatar, index) => (
                <div
                  key={avatar.id}
                  className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/90 shadow-[0_8px_18px_rgba(27,16,76,0.22)]"
                  style={{ zIndex: avatars.length - index }}
                >
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="max-w-[8.5rem] text-[0.98rem] leading-5 text-white/84">
              {communityText}
            </p>
          </div>
        </div>

        <div className="relative min-h-[300px]">
          <div className="absolute inset-x-0 top-8 h-[170px] rounded-full border border-[#f6d07d]/40" />
          <div className="absolute inset-x-3 top-14 h-[150px] rounded-full border border-[#f6d07d]/35" />
          <CosmicCardStack
            src={cardStackSrc}
            className="absolute bottom-0 right-[-12px] h-[295px] w-[190px]"
          />
        </div>
      </div>
    </AppCard>
  );
}
