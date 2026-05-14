import Link from "next/link";

import type { IntentionItem } from "@/types/home";

import { AppCard } from "@/components/ui/AppCard";

function SparkleIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 1.5 14.8 9.2 22.5 12l-7.7 2.8L12 22.5l-2.8-7.7L1.5 12l7.7-2.8L12 1.5Z" />
    </svg>
  );
}

function MoonIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M15.8 2.3a9.4 9.4 0 1 0 5.9 16.7A9 9 0 0 1 15.8 2.3Z" />
    </svg>
  );
}

function SunIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.2 2.2M7.5 16.5l-2.2 2.2M18.7 18.7l-2.2-2.2M7.5 7.5 5.3 5.3" />
    </svg>
  );
}

function HeartIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 20.5s-7-4.5-7-10.5a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 6-7 10.5-7 10.5Z" />
    </svg>
  );
}

function IntentionIcon({ item }: { item: IntentionItem }) {
  const className = `h-10 w-10 ${item.iconClassName}`;

  switch (item.icon) {
    case "moon":
      return <MoonIcon className={className} />;
    case "sun":
      return <SunIcon className={className} />;
    case "heart":
      return <HeartIcon className={className} />;
    default:
      return <SparkleIcon className={className} />;
  }
}

interface IntentionCardProps {
  item: IntentionItem;
}

export function IntentionCard({ item }: IntentionCardProps) {
  return (
    <Link
      href={`/draw?intention=${item.id}`}
      aria-label={`Draw a card for ${item.label.toLowerCase()}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d63ff] focus-visible:ring-offset-2"
    >
      <AppCard
        className={`${item.gradientClassName} flex min-h-[126px] flex-col items-center justify-center rounded-[26px] border border-white/90 px-4 py-5 text-center shadow-[0_16px_34px_rgba(41,33,89,0.06)] transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:border-[#d8c4ff] hover:shadow-[0_20px_38px_rgba(84,68,154,0.12)] active:scale-[0.99]`}
      >
        <IntentionIcon item={item} />
        <span className="mt-4 text-[1.02rem] font-semibold tracking-[-0.03em] text-[#1f2747]">
          {item.label}
        </span>
      </AppCard>
    </Link>
  );
}
