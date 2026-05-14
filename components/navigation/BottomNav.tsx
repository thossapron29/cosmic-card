"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { NavItem } from "@/components/navigation/NavItem";
import type { BottomNavItem } from "@/types/home";

interface BottomNavProps {
  items: BottomNavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();
  const routeActiveId =
    items.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
    )?.id ?? items.find((item) => item.active)?.id ?? items[0]?.id ?? "";
  const defaultActiveId =
    items.find((item) => item.active)?.id ?? items[0]?.id ?? "";
  const [pendingActiveId, setPendingActiveId] = useState(defaultActiveId);
  const activeId = routeActiveId || pendingActiveId;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  const gridColumns =
    items.length === 3 ? "grid-cols-3" : "grid-cols-5";
  const activeWidth = items.length > 0 ? `${100 / items.length}%` : "0%";

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+14px)] z-50 px-4"
    >
      <div className="mx-auto w-full max-w-[430px]">
        <div className="relative mx-auto max-w-[318px]">
          <div className="absolute inset-x-8 top-3 h-14 rounded-full bg-[#41366a]/9 blur-2xl" />
          <div className="absolute inset-x-10 -bottom-2 h-9 rounded-full bg-[#1d1933]/10 blur-xl" />

          <div className="relative overflow-hidden rounded-[32px] border border-white/58 bg-[linear-gradient(145deg,rgba(255,255,255,0.64),rgba(255,255,255,0.32)_45%,rgba(250,243,255,0.34)_72%,rgba(255,248,251,0.42))] px-2 py-1.5 shadow-[0_18px_42px_rgba(38,31,78,0.14),0_4px_14px_rgba(96,76,141,0.08),inset_0_1px_0_rgba(255,255,255,0.78),inset_0_-1px_0_rgba(73,61,114,0.07)] backdrop-blur-[16px] backdrop-saturate-150">
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_22%_0%,rgba(255,255,255,0.84),rgba(255,255,255,0)_36%),linear-gradient(180deg,rgba(255,255,255,0.36),rgba(255,255,255,0.07)_38%,rgba(232,218,255,0.07)_100%)]" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[31px] ring-1 ring-white/38" />
            <div className="pointer-events-none absolute left-8 right-8 top-1.5 h-px bg-gradient-to-r from-transparent via-white/78 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#554276]/10 to-transparent" />

            <ul className={`relative z-10 grid ${gridColumns} gap-1`}>
              <span
                aria-hidden="true"
                className="absolute bottom-1.5 top-1.5 left-0 rounded-[19px] px-1 transition-[transform,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  width: activeWidth,
                  transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
                }}
              >
                <span className="relative block h-full overflow-hidden rounded-[19px] bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,255,255,0.22)_55%,rgba(244,237,255,0.3))] shadow-[0_8px_18px_rgba(100,78,170,0.09),inset_0_1px_1px_rgba(255,255,255,0.74),inset_0_-1px_1px_rgba(89,75,128,0.06)] ring-1 ring-white/48">
                  <span className="absolute inset-x-6 top-1 h-1.5 rounded-full bg-white/52 blur-[1px]" />
                  <span className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-[#7253df]/15 to-transparent" />
                </span>
              </span>

              {items.map((item) => (
                <li key={item.id} className="relative z-10">
                  <NavItem
                    item={item}
                    isActive={item.id === activeId}
                    onSelect={setPendingActiveId}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
