import Image from "next/image";

interface CosmicCardStackProps {
  className?: string;
  src: string;
}

export function CosmicCardStack({
  className = "",
  src,
}: CosmicCardStackProps) {
  return (
    <div className={`relative overflow-visible ${className}`}>
      {/* TODO: Replace local placeholder raster with final production artwork when available. */}
      <Image
        src={src}
        alt="A glowing stack of tarot cards with celestial details"
        width={640}
        height={760}
        sizes="(max-width: 430px) 44vw, 190px"
        className="h-full w-full object-contain drop-shadow-[0_18px_34px_rgba(39,21,98,0.34)]"
        priority
      />
    </div>
  );
}
