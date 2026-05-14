import Image from "next/image";

interface StarCloudProps {
  className?: string;
  src: string;
}

export function StarCloud({ className = "", src }: StarCloudProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* TODO: Replace local placeholder raster with final production artwork when available. */}
      <Image
        src={src}
        alt="A cheerful yellow star sitting on soft clouds"
        width={380}
        height={300}
        sizes="160px"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
