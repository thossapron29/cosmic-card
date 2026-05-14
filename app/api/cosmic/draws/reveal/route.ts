import { NextRequest, NextResponse } from "next/server";

import { getCosmicApiBaseUrl } from "@/lib/cosmic-server-config";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const upstreamUrl = new URL("/api/v1/draws/reveal", getCosmicApiBaseUrl());

  try {
    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });
    const payload = await response.json();

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "API_UNAVAILABLE",
          message: "Could not reach the Cosmic Card API.",
        },
      },
      { status: 502 },
    );
  }
}
