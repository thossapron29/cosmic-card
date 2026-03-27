import type { Card } from "@/types/card";

interface InterpretationInput {
  card: Card;
  journalNote?: string | null;
  mode?: "gentle" | "deep";
}

export async function generateCardInterpretation({
  card,
  journalNote,
  mode = "gentle",
}: InterpretationInput) {
  const prefix =
    mode === "deep"
      ? "A deeper reflection for this card:"
      : "A gentle reflection for this card:";

  const noteLine = journalNote
    ? ` Your journal note suggests this message may be landing close to ${journalNote.slice(0, 120)}.`
    : "";

  return `${prefix} ${card.short_message} ${card.full_message}${noteLine}`.trim();
}

export async function generateJournalPrompt(card: Card) {
  return `Where is "${card.title}" asking for more honesty, gentleness, or grounded action in your life today?`;
}
