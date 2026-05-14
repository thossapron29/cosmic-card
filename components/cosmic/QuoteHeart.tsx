import Image from "next/image";

interface QuoteHeartProps {
  className?: string;
  src: string;
}

export function QuoteHeart({ className = "", src }: QuoteHeartProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* TODO: Replace local placeholder raster with final production artwork when available. */}
      <Image
        src={src}
        alt="Pink heart illustration with sparkles"
        width={280}
        height={220}
        sizes="84px"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
