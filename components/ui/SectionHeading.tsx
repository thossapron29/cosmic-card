function Sparkle() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#c8b6ff]"
      fill="currentColor"
    >
      <path d="M12 1.5 14.8 9.2 22.5 12l-7.7 2.8L12 22.5l-2.8-7.7L1.5 12l7.7-2.8L12 1.5Z" />
    </svg>
  );
}

function HeartOutline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8 text-[#ff9ac6]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 20.5s-7-4.5-7-10.5a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 6-7 10.5-7 10.5Z" />
    </svg>
  );
}

interface SectionHeadingProps {
  title: string;
  highlightedTitle: string;
}

export function SectionHeading({
  title,
  highlightedTitle,
}: SectionHeadingProps) {
  return (
    <section aria-labelledby="hero-heading" className="pt-1">
      <div className="mb-3 flex items-center gap-2 pl-2">
        <Sparkle />
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7c7ff]">
          Gentle guidance
        </span>
      </div>

      <div className="relative">
        <h1
          id="hero-heading"
          className="max-w-[17rem] text-[3.45rem] font-extrabold leading-[0.9] tracking-[-0.08em] text-[#16203d]"
        >
          {title}
        </h1>
        <p className="max-w-[18rem] bg-[linear-gradient(90deg,#6d4cff_0%,#bd74ff_52%,#ff8ebc_100%)] bg-clip-text font-[family:var(--font-cormorant)] text-[3.35rem] font-semibold italic leading-[0.9] tracking-[-0.05em] text-transparent">
          {highlightedTitle}
        </p>

        <div className="absolute left-[13.8rem] top-[0.65rem]">
          <Sparkle />
        </div>
        <div className="absolute left-[2.2rem] top-[4.3rem] scale-90">
          <Sparkle />
        </div>
        <div className="absolute right-5 top-[3.85rem]">
          <HeartOutline />
        </div>
      </div>
    </section>
  );
}
