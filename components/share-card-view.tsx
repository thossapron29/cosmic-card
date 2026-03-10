import { Card } from "@/types/card";

interface ShareCardViewProps {
  card: Card;
  /**
   * We use a fixed width/height for consistent image generation
   * e.g., 1080x1920 scaled down visually via CSS transform if needed.
   */
  width?: number;
  height?: number;
}

export function ShareCardView({ card, width = 1080, height = 1920 }: ShareCardViewProps) {
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

      <div className="absolute top-24">
        <h1 className="text-4xl tracking-[0.4em] text-white/40 uppercase font-light">Cosmic Card</h1>
      </div>

      <div className="flex flex-col items-center justify-center space-y-16 p-24 max-w-3xl">
        <div>
          <p className="text-cosmic-accent text-2xl tracking-[0.3em] uppercase mb-6">Message</p>
          <h2 className="text-8xl font-light tracking-widest text-white mb-12">{card.title}</h2>
          <div className="w-24 h-[2px] bg-white/30 mx-auto" />
        </div>

        <p className="text-5xl leading-relaxed text-white/90 font-light italic">
          &quot;{card.message}&quot;
        </p>

        <div className="pt-12 space-y-12">
          <div>
            <h3 className="text-xl text-white/50 uppercase tracking-[0.2em] mb-4">Affirmation</h3>
            <p className="text-3xl font-medium text-cosmic-accent">{card.affirmation}</p>
          </div>
          
          <div>
            <h3 className="text-xl text-white/50 uppercase tracking-[0.2em] mb-4">Reflection</h3>
            <p className="text-2xl text-white/80">{card.reflection}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 text-white/30 text-2xl tracking-widest font-light">
        Shared via Cosmic Card
      </div>
    </div>
  );
}
