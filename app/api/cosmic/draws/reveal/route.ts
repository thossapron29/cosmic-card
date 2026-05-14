import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.COSMIC_CARD_API_URL ??
  process.env.NEXT_PUBLIC_COSMIC_CARD_API_URL ??
  "http://localhost:8080";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const upstreamUrl = new URL("/api/v1/draws/reveal", API_BASE_URL);

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
