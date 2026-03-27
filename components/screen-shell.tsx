import { ReactNode } from "react";
import { CosmicBackground } from "./cosmic-background";
import { cn } from "@/lib/utils";

interface ScreenShellProps {
  children: ReactNode;
  className?: string;
  scrollMode?: "page" | "locked";
}

export function ScreenShell({
  children,
  className,
  scrollMode = "page",
}: ScreenShellProps) {
  return (
    <div
      className={cn(
        "relative h-[100dvh] w-full md:mx-auto md:max-w-md",
        scrollMode === "page" ? "overflow-y-auto overscroll-y-contain" : "overflow-hidden"
      )}
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top, 1.5rem))",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))",
        paddingLeft: "max(1.5rem, env(safe-area-inset-left, 1.5rem))",
        paddingRight: "max(1.5rem, env(safe-area-inset-right, 1.5rem))",
      }}
    >
      <CosmicBackground />
      <div className={cn("relative z-10 flex min-h-full w-full flex-col", className)}>
        {children}
      </div>
    </div>
  );
}
