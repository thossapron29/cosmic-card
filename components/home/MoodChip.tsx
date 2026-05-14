function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M12 20.5s-7-4.5-7-10.5a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 6-7 10.5-7 10.5Z" />
    </svg>
  );
}

function ChevronIcon() {
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

interface MoodChipProps {
  label: string;
}

export function MoodChip({ label }: MoodChipProps) {
  return (
    <Link
      href="/draw"
      className="inline-flex items-center gap-2 rounded-full border border-[#ecdfff] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(249,243,255,0.95))] px-3.5 py-2 text-sm font-semibold text-[#6f4ee8] shadow-[0_10px_24px_rgba(158,133,255,0.16)] transition hover:-translate-y-0.5 hover:border-[#cfb8ff] hover:shadow-[0_14px_28px_rgba(158,133,255,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d63ff] focus-visible:ring-offset-2"
    >
      <HeartIcon />
      <span className="text-[#4f5477]">{label}</span>
      <ChevronIcon />
    </Link>
  );
}
import Link from "next/link";
