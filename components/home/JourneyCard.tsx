import Link from "next/link";

import { StarCloud } from "@/components/cosmic/StarCloud";
import { AppCard } from "@/components/ui/AppCard";
import type { JourneyCardData } from "@/types/home";

export function JourneyCard({
  title,
  days,
  description,
  imageSrc,
}: JourneyCardData) {
  return (
    <Link href="/profile" aria-label="View your journey" className="block">
      <AppCard className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,251,241,0.98)_0%,rgba(255,248,234,0.95)_56%,rgba(255,246,252,0.94)_100%)] p-5 transition hover:-translate-y-0.5 active:scale-[0.99]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[#1d2546]">
            {title}
          </h3>
          <span className="text-[#f5c45e]" aria-hidden="true">
            ✦
          </span>
        </div>

        <p className="mt-5 text-[3.45rem] font-extrabold leading-none tracking-[-0.08em] text-[#16203d]">
          {days}
          <span className="ml-1 align-middle text-[1.75rem] font-bold">
            days
          </span>
        </p>
        <p className="mt-3 max-w-[9rem] text-[1.05rem] leading-7 text-[#4d5777]">
          {description}
        </p>

        <div className="mt-5 flex gap-2" aria-label="Journey progress">
          <span className="h-2.5 w-12 rounded-full bg-[#8158ff]" />
          <span className="h-2.5 w-12 rounded-full bg-[#bc8dff]" />
          <span className="h-2.5 w-12 rounded-full bg-[#e7dbf7]" />
        </div>

        <StarCloud
          src={imageSrc}
          className="ml-auto mt-5 h-[118px] w-[126px]"
        />
      </AppCard>
    </Link>
  );
}
