import { Card } from "@/types/card";

interface ShareCardViewProps {
  card: Card;
  /**
   * We use a fixed width/height for consistent image generation
   * e.g., 600x1067 scaled down visually via CSS transform if needed.
   */
  width?: number;
  height?: number;
}

function formatLabel(value: string) {
  return value
    .split(/[-\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ShareCardView({ card, width = 600, height = 1067 }: ShareCardViewProps) {
  return (
    <div
      id="share-card-container"
      className="relative overflow-hidden bg-cosmic-bg text-cosmic-text font-sans"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background:
          "radial-gradient(circle at 50% -12%, rgba(235, 226, 255, 0.2) 0%, transparent 28%), radial-gradient(circle at 20% 18%, rgba(126, 95, 206, 0.16) 0%, transparent 24%), radial-gradient(circle at 80% 22%, rgba(92, 64, 176, 0.14) 0%, transparent 22%), linear-gradient(180deg, #2a1860 0%, #1b103d 48%, #140b30 100%)",
      }}
    >
      {Array.from({ length: 18 }, (_, index) => {
        const top = ((index * 57) % 100) + 1;
        const left = ((index * 83) % 100) + 1;
        const size = (index % 3) + 1.5;
        return (
          <div
            key={index}
            className="absolute rounded-full bg-white/60"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        );
      })}

      <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_64%)]" />
      <div className="absolute inset-x-0 bottom-0 h-60 bg-[linear-gradient(180deg,transparent,rgba(8,4,23,0.46))]" />
      <div className="absolute left-1/2 top-[34%] h-64 w-64 -translate-x-1/2 rounded-full bg-cosmic-accent/[0.05] blur-3xl" />

      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <h1 className="text-sm tracking-[0.42em] text-white/58 uppercase font-light">Cosmic Card</h1>
      </div>

      <div className="relative flex h-full flex-col px-10 pb-14 pt-24">
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/60">
          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1">
            {formatLabel(card.category)}
          </span>
          <span className="rounded-full border border-cosmic-accent/20 bg-cosmic-accent/10 px-3 py-1 text-cosmic-accent">
            {formatLabel(card.energy_tag)}
          </span>
        </div>

        <div className="mt-16 text-center">
          <p className="mb-2 text-[11px] uppercase tracking-[0.32em] text-cosmic-accent">Today&apos;s Message</p>
          <h2 className="mx-auto max-w-[15rem] text-[2.6rem] font-light tracking-[0.12em] text-white">
            {card.title}
          </h2>
          <div className="mx-auto mt-4 h-[1.5px] w-12 bg-white/40" />
        </div>

        <div className="mt-24 rounded-[2rem] border border-white/10 bg-white/[0.06] px-7 py-8 text-center shadow-[0_24px_70px_-45px_rgba(7,3,22,0.95)] backdrop-blur-lg">
          <p className="text-[1.65rem] leading-[1.55] text-white/94 font-light italic">
            &quot;{card.short_message}&quot;
          </p>

          <div className="mt-8 border-t border-white/8 pt-6">
            <h3 className="mb-2 text-[11px] text-white/62 uppercase tracking-[0.26em]">Reflection</h3>
            <p className="text-[0.96rem] text-white/88 leading-8">
              {card.full_message}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 text-center">
          <div className="mx-auto mb-3 h-px w-16 bg-white/12" />
          <p className="text-[11px] tracking-[0.3em] text-white/44 uppercase font-light">
            Shared via Cosmic Card
          </p>
        </div>
      </div>
    </div>
  );
}
