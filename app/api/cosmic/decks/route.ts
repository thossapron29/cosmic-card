import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.COSMIC_CARD_API_URL ??
  process.env.NEXT_PUBLIC_COSMIC_CARD_API_URL ??
  "http://localhost:8080";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "en";
  const upstreamUrl = new URL("/api/v1/decks", API_BASE_URL);
  upstreamUrl.searchParams.set("locale", locale);

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        Accept: "application/json",
      },
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
