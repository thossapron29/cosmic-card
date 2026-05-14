export type DrawMode = "daily" | "guidance" | "support" | "reflection";

export interface CosmicDeck {
  id: number;
  code: string;
  name: string;
  shortDescription: string;
  coverImage: string;
  iconName: string;
  isPremium: boolean;
}

export interface RevealDrawRequest {
  userId: string;
  deckId: number;
  drawMode: DrawMode;
  locale: string;
  questionText?: string;
  clientLocalDate: string;
}

export interface RevealedCard {
  id: number;
  code: string;
  title: string;
  shortMessage: string;
  meaning: string;
  reflectionPrompt: string;
  shareText: string;
  illustrationKey: string;
  energyType: string;
}

export interface RevealDrawResponse {
  drawId: number;
  card: RevealedCard;
  deck: {
    id: number;
    code: string;
    name: string;
  };
}

interface ApiEnvelope<T> {
  data: T;
}

interface ApiErrorEnvelope {
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
}

export class CosmicApiError extends Error {
  code: string;

  constructor(message: string, code = "API_ERROR") {
    super(message);
    this.name = "CosmicApiError";
    this.code = code;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | ApiErrorEnvelope
    | null;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorEnvelope | null;
    throw new CosmicApiError(
      errorPayload?.error?.message ??
        errorPayload?.message ??
        "Something went quiet between the stars. Please try again.",
      errorPayload?.error?.code ?? "API_ERROR",
    );
  }

  return (payload as ApiEnvelope<T>).data;
}

export async function getDecks(locale = "en"): Promise<CosmicDeck[]> {
  const params = new URLSearchParams({ locale });
  const response = await fetch(`/api/cosmic/decks?${params.toString()}`, {
    cache: "no-store",
  });

  return parseResponse<CosmicDeck[]>(response);
}

export async function revealDraw(
  request: RevealDrawRequest,
): Promise<RevealDrawResponse> {
  const response = await fetch("/api/cosmic/draws/reveal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return parseResponse<RevealDrawResponse>(response);
}
