import Link from "next/link";

import { CloudMascot } from "@/components/cosmic/CloudMascot";
import { AppCard } from "@/components/ui/AppCard";
import type { DailyCheckInCardData } from "@/types/home";

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

export function DailyCheckInCard({
  title,
  description,
  buttonLabel,
  imageSrc,
}: DailyCheckInCardData) {
  return (
    <AppCard className="rounded-[28px] bg-[linear-gradient(180deg,rgba(249,244,255,0.96)_0%,rgba(245,241,255,0.92)_60%,rgba(255,248,252,0.95)_100%)] p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[#1d2546]">
          {title}
        </h3>
        <span className="text-[#b26dff]" aria-hidden="true">
          ♥
        </span>
      </div>

      <p className="mt-5 max-w-[8rem] text-[1.65rem] leading-[1.15] tracking-[-0.06em] text-[#1f2747]">
        {description}
      </p>

      <Link
        href="/profile"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-[0.98rem] font-semibold text-[#7a4dff] shadow-[0_14px_30px_rgba(42,31,94,0.16)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d63ff] focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        {buttonLabel}
        <ChevronRightIcon />
      </Link>

      <CloudMascot
        src={imageSrc}
        className="ml-auto mt-4 h-[116px] w-[116px]"
      />
    </AppCard>
  );
}
