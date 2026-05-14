import type { BottomNavItem } from "@/types/home";

function NavIcon({ icon }: { icon: BottomNavItem["icon"] }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "decks":
      return (
        <svg {...commonProps}>
          <path d="m7 3 10 2.2a2 2 0 0 1 1.5 2.4L16.8 18a2 2 0 0 1-2.4 1.5L4.5 17.3A2 2 0 0 1 3 14.9L4.7 4.5A2 2 0 0 1 7 3Z" />
          <path d="M8.5 5.3 6.3 18" />
        </svg>
      );
    case "journal":
      return (
        <svg {...commonProps}>
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v17.5H7.5A2.5 2.5 0 0 0 5 23Z" />
          <path d="M5 5.5V20.5" />
          <path d="M12 3v17.5" />
        </svg>
      );
    case "insights":
      return (
        <svg {...commonProps}>
          <path d="M4 20V10" />
          <path d="M10 20V5" />
          <path d="M16 20v-8" />
          <path d="M22 20V8" />
          <path d="M2 20h20" />
        </svg>
      );
    case "profile":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.8-3 4-4.5 7-4.5S17.2 17 19 20" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M3.5 11.5 12 4l8.5 7.5" />
          <path d="M6.5 10.5V20h11v-9.5" />
        </svg>
      );
  }
}

interface BottomNavProps {
  items: BottomNavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[398px] -translate-x-1/2"
    >
      <div className="rounded-[30px] border border-white/85 bg-white/88 px-3 py-3 shadow-[0_24px_50px_rgba(28,22,67,0.12)] backdrop-blur-xl">
        <ul className="grid grid-cols-5 gap-1">
          {items.map((item) => {
            const isActive = Boolean(item.active);

            return (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex w-full flex-col items-center justify-center gap-1 rounded-[20px] px-1.5 py-2.5 text-[0.83rem] font-medium transition ${
                    isActive
                      ? "text-[#7a4dff]"
                      : "text-[#56607f] hover:bg-[#faf7ff]"
                  }`}
                >
                  <NavIcon icon={item.icon} />
                  <span>{item.label}</span>
                  {item.hasNotification ? (
                    <span className="absolute right-3 top-2 h-2.5 w-2.5 rounded-full bg-[#ff73a6]" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
