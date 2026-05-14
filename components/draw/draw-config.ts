import { CosmicApiError, type DrawMode } from "@/lib/cosmic-api";

export const DRAW_MODES: Array<{
  value: DrawMode;
  label: string;
  caption: string;
}> = [
  { value: "daily", label: "Daily", caption: "Today's ritual" },
  { value: "guidance", label: "Guidance", caption: "Ask softly" },
  { value: "reflection", label: "Reflect", caption: "Look within" },
];

export const DEMO_USER_ID = "user_demo_orion";
export const DRAW_QUESTION = "What do you need right now?";

export function getClientLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getFriendlyError(error: unknown) {
  if (error instanceof CosmicApiError) {
    return error.message;
  }

  return "The card could not be revealed yet. Please try again.";
}
