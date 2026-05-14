import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  srLabel: string;
}

export function IconButton({
  icon,
  srLabel,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={srLabel}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#6d4cff] shadow-[0_8px_24px_rgba(112,84,220,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(112,84,220,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d63ff] focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
