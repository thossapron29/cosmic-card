import { ReactNode } from "react";
import { CosmicBackground } from "./cosmic-background";
import { cn } from "@/lib/utils";

interface ScreenShellProps {
  children: ReactNode;
  className?: string;
}

export function ScreenShell({ children, className }: ScreenShellProps) {
  return (
    <div 
      className={cn("relative w-full flex flex-col px-6 md:max-w-md md:mx-auto overflow-auto", className)} 
      style={{ 
        minHeight: '100dvh',
        paddingTop: 'max(1.5rem, env(safe-area-inset-top, 1.5rem))',
        paddingBottom: '0.5rem',
        paddingLeft: 'max(1.5rem, env(safe-area-inset-left, 1.5rem))',
        paddingRight: 'max(1.5rem, env(safe-area-inset-right, 1.5rem))'
      }}
    >
      <CosmicBackground />
      {children}
    </div>
  );
}
