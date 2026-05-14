import Image from "next/image";

interface CloudMascotProps {
  className?: string;
  src: string;
}

export function CloudMascot({ className = "", src }: CloudMascotProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* TODO: Replace local placeholder raster with final production artwork when available. */}
      <Image
        src={src}
        alt="A smiling soft purple cloud mascot"
        width={360}
        height={300}
        sizes="140px"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
