import { ReactNode } from "react";
import { CosmicBackground } from "./cosmic-background";
import { cn } from "@/lib/utils";

interface ScreenShellProps {
  children: ReactNode;
  className?: string;
}

export function ScreenShell({ children, className }: ScreenShellProps) {
  return (
    <div className={cn("relative min-h-screen w-full flex flex-col pt-12 pb-24 px-6 md:max-w-md md:mx-auto", className)}>
      <CosmicBackground />
      {children}
    </div>
  );
}
