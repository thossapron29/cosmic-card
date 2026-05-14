import type { ElementType, ReactNode } from "react";

interface AppCardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export function AppCard({
  as: Component = "div",
  children,
  className = "",
}: AppCardProps) {
  return (
    <Component
      className={`rounded-[28px] border border-white/80 bg-white/84 shadow-[0_16px_40px_rgba(29,24,66,0.08)] backdrop-blur-sm ${className}`}
    >
      {children}
    </Component>
  );
}
