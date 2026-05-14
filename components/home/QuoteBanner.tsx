import Link from "next/link";

import { QuoteHeart } from "@/components/cosmic/QuoteHeart";
import { AppCard } from "@/components/ui/AppCard";
import type { QuoteBannerData } from "@/types/home";

export function QuoteBanner({
  text,
  highlightedText,
  imageSrc,
}: QuoteBannerData) {
  return (
    <Link href="/draw" aria-label="Draw a card from this quote">
      <AppCard className="rounded-[28px] bg-white/92 px-5 py-4 shadow-[0_16px_36px_rgba(29,24,66,0.08)] transition hover:-translate-y-0.5 active:scale-[0.99]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fff1f7] text-[1.9rem] text-[#ff86b8]">
            ❝
          </div>

          <p className="min-w-0 flex-1 text-[1.1rem] leading-7 text-[#1d2546]">
            {text}{" "}
            <span className="font-[family:var(--font-cormorant)] text-[1.3rem] italic text-[#ff82b4]">
              {highlightedText}
            </span>
          </p>

          <QuoteHeart
            src={imageSrc}
            className="h-[74px] w-[74px] shrink-0"
          />
        </div>
      </AppCard>
    </Link>
  );
}
