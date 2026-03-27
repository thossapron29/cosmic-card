"use client";

import type { AnalyticsEventMap, AnalyticsEventName } from "@/lib/analytics/events";

declare global {
  interface Window {
    analytics?: {
      track?: (event: string, payload?: Record<string, unknown>) => void;
    };
  }
}

export function trackEvent<TEvent extends AnalyticsEventName>(
  event: TEvent,
  payload: AnalyticsEventMap[TEvent]
) {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, payload);
  }

  window.dispatchEvent(
    new CustomEvent("cosmic-analytics", {
      detail: { event, payload },
    })
  );

  window.analytics?.track?.(event, payload);
}
