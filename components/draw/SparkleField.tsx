export function SparkleField({ dark = false }: { dark?: boolean }) {
  const sparkles = [
    "left-[10%] top-[22%]",
    "right-[10%] top-[24%]",
    "left-[14%] top-[48%]",
    "right-[16%] top-[56%]",
    "left-[8%] bottom-[23%]",
    "right-[9%] bottom-[30%]",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((position, index) => (
        <span
          key={position}
          className={`animate-cosmic-twinkle absolute ${position} text-[1.2rem] ${
            dark
              ? index % 2 === 0
                ? "text-[#ffe3a8]"
                : "text-white/70"
              : index % 2 === 0
                ? "text-[#c8a8ff]"
                : "text-[#ff9ac6]"
          }`}
          style={{ animationDelay: `${index * 180}ms` }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
