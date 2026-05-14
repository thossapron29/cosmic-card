"use client";

import Link from "next/link";

import type { BottomNavItem } from "@/types/home";

type NavIconName = BottomNavItem["icon"];

interface NavItemProps {
  item: BottomNavItem;
  isActive: boolean;
  onSelect: (id: string) => void;
}

function Icon({ name }: { name: NavIconName }) {
  const iconProps = {
    viewBox: "0 0 24 24",
    className: "h-[22px] w-[22px]",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "decks":
      return (
        <svg aria-hidden="true" {...iconProps}>
          <rect x="7" y="3.75" width="10" height="15.5" rx="2.2" />
          <path d="M10.5 6.2h3" />
          <path d="M5.7 6.2 4.2 17.1a2 2 0 0 0 1.7 2.2l5 .7" />
        </svg>
      );
    case "journal":
      return (
        <svg aria-hidden="true" {...iconProps}>
          <path d="M5.5 5.4A2.4 2.4 0 0 1 7.9 3h10.6v17H7.9a2.4 2.4 0 0 0-2.4 2.4Z" />
          <path d="M5.5 5.4v17" />
          <path d="M10 6.8h5" />
          <path d="M10 10.5h5" />
        </svg>
      );
    case "draw":
      return (
        <svg aria-hidden="true" {...iconProps}>
          <rect x="8.2" y="3.5" width="8.8" height="16.2" rx="2.1" />
          <path d="M10.3 6.3h4.6" />
          <path d="M12.6 16.1v.1" />
          <path d="M5.2 9.7c-1.6 1.1-2.2 2.7-1.6 4.4.5 1.4 1.7 2.2 3.2 2.5" />
        </svg>
      );
    case "insights":
      return (
        <svg aria-hidden="true" {...iconProps}>
          <path d="M4.5 19.5V12" />
          <path d="M9.5 19.5V7.5" />
          <path d="M14.5 19.5v-9" />
          <path d="M19.5 19.5V5" />
          <path d="M3 19.5h18" />
        </svg>
      );
    case "profile":
      return (
        <svg aria-hidden="true" {...iconProps}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.3 20c1.45-3.1 3.7-4.65 6.7-4.65S17.25 16.9 18.7 20" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" {...iconProps}>
          <path d="m4.2 11.4 7.8-7 7.8 7" />
          <path d="M6.7 10.2v9.1h10.6v-9.1" />
          <path d="M10 19.3v-5.4h4v5.4" />
        </svg>
      );
  }
}

export function NavItem({ item, isActive, onSelect }: NavItemProps) {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={() => onSelect(item.id)}
      className="group relative flex min-h-[54px] w-full touch-manipulation flex-col items-center justify-center gap-1 rounded-[22px] text-[0.72rem] font-semibold transition duration-300 ease-out active:scale-[0.97]"
    >
      <span className="absolute inset-x-2 top-1.5 h-[calc(100%-12px)] rounded-[19px] opacity-0 transition duration-300 ease-out group-hover:bg-white/20 group-hover:opacity-100" />

      <span
        className={`relative z-10 transition duration-300 ease-out ${
          isActive
            ? "translate-y-[-1px] text-[#7655ea] drop-shadow-[0_4px_9px_rgba(117,82,255,0.12)]"
            : "text-[#283153]/75 group-hover:text-[#273052]/90"
        }`}
      >
        <Icon name={item.icon} />
      </span>

      <span
        className={`relative z-10 leading-none tracking-[0.01em] transition duration-300 ease-out ${
          isActive
            ? "translate-y-[-1px] text-[#7253df]"
            : "text-[#283153]/70 group-hover:text-[#273052]/88"
        }`}
      >
        {item.label}
      </span>

      {item.hasNotification ? (
        <span className="absolute right-[18%] top-2 z-20 h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#ff78a8,#ff4f92)] shadow-[0_0_0_2px_rgba(255,255,255,0.82),0_5px_10px_rgba(255,83,142,0.25)]" />
      ) : null}
    </Link>
  );
}
