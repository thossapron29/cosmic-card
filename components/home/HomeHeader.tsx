import Image from "next/image";
import Link from "next/link";

import { AppCard } from "@/components/ui/AppCard";
import { MoodChip } from "@/components/home/MoodChip";

function FlameIcon() {
  return (
    <span className="text-[1.6rem]" aria-hidden="true">
      🔥
    </span>
  );
}

function ChevronRightIcon() {
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
      <path d="m7 4 6 6-6 6" />
    </svg>
  );
}

interface HomeHeaderProps {
  greeting: string;
  name: string;
  moodChip: {
    label: string;
  };
  streakCount: number;
  streakLabel: string;
  avatarSrc: string;
}

export function HomeHeader({
  greeting,
  name,
  moodChip,
  streakCount,
  streakLabel,
  avatarSrc,
}: HomeHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3 pt-2">
      <div className="flex min-w-0 items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-[3px] border-white/90 shadow-[0_14px_34px_rgba(40,32,89,0.12)]">
          <Image
            src={avatarSrc}
            alt="Portrait avatar for Orion"
            fill
            sizes="64px"
            className="object-cover"
            priority
          />
        </div>

        <div className="min-w-0 pt-1.5">
          <p className="text-sm font-medium text-[#4e5675]">
            {greeting}
          </p>
          <h2 className="text-[2.1rem] font-extrabold leading-none tracking-[-0.07em] text-[#16203d]">
            {name}
            <span className="ml-1.5 text-[1.35rem] text-[#ffbd52]">✨</span>
          </h2>
          <div className="mt-2.5">
            <MoodChip label={moodChip.label} />
          </div>
        </div>
      </div>

      <Link href="/profile" aria-label="View your day streak" className="shrink-0">
        <AppCard className="w-[116px] shrink-0 rounded-[26px] bg-white/88 px-3 py-3 shadow-[0_18px_42px_rgba(40,32,89,0.1)] transition hover:-translate-y-0.5 active:scale-[0.98]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-start gap-2">
              <FlameIcon />
              <div>
                <p className="text-[1.65rem] font-extrabold leading-none tracking-[-0.06em] text-[#16203d]">
                  {streakCount}
                </p>
                <p className="mt-1 text-[0.82rem] leading-tight text-[#4f5676]">
                  {streakLabel}
                </p>
              </div>
            </div>

            <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#3c4567]">
              <ChevronRightIcon />
            </span>
          </div>
        </AppCard>
      </Link>
    </header>
  );
}
