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

export function ShareCardView({ card, width = 600, height = 1067 }: ShareCardViewProps) {
  return (
    <div
      id="share-card-container"
      className="relative flex flex-col items-center justify-center text-center overflow-hidden bg-cosmic-bg text-cosmic-text font-sans"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: "radial-gradient(circle at 50% 0%, #1a103c 0%, #050117 60%)",
      }}
    >
      {/* Decorative stars / dust could go here */}

      <div className="absolute top-8">
        <h1 className="text-base tracking-[0.4em] text-white/40 uppercase font-light">Cosmic Card</h1>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 px-8 max-w-xl">
        <div>
          <p className="text-cosmic-accent text-xs tracking-[0.3em] uppercase mb-1.5">Message</p>
          <h2 className="text-3xl font-light tracking-widest text-white mb-3">{card.title}</h2>
          <div className="w-10 h-[1.5px] bg-white/30 mx-auto" />
        </div>

        <p className="text-lg leading-relaxed text-white/90 font-light italic px-4">
          &quot;{card.message}&quot;
        </p>

        <div className="pt-2 space-y-4">
          <div>
            <h3 className="text-xs text-white/50 uppercase tracking-[0.2em] mb-1.5">Affirmation</h3>
            <p className="text-base font-medium text-cosmic-accent px-4">{card.affirmation}</p>
          </div>
          
          <div>
            <h3 className="text-xs text-white/50 uppercase tracking-[0.2em] mb-1.5">Reflection</h3>
            <p className="text-sm text-white/80 px-4">{card.reflection}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-white/30 text-xs tracking-widest font-light">
        Shared via Cosmic Card
      </div>
    </div>
  );
}
