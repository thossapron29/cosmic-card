import { NextResponse } from "next/server";

import {
  getCosmicApiBaseUrl,
  getCosmicApiEnvSource,
  getSafeCosmicApiBaseUrl,
} from "@/lib/cosmic-server-config";

export async function GET() {
  const safeBaseUrl = getSafeCosmicApiBaseUrl();

  return NextResponse.json({
    data: {
      apiBaseUrl: safeBaseUrl,
      envSource: getCosmicApiEnvSource(),
      endpoints: {
        decks: new URL("/api/v1/decks", getCosmicApiBaseUrl()).toString(),
        revealDraw: new URL(
          "/api/v1/draws/reveal",
          getCosmicApiBaseUrl(),
        ).toString(),
      },
      hasEnv: {
        COSMIC_CARD_API_URL: Boolean(process.env.COSMIC_CARD_API_URL),
        NEXT_PUBLIC_COSMIC_CARD_API_URL: Boolean(
          process.env.NEXT_PUBLIC_COSMIC_CARD_API_URL,
        ),
      },
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
