import type { IntentionItem } from "@/types/home";

import { IntentionCard } from "@/components/home/IntentionCard";

interface IntentionGridProps {
  items: IntentionItem[];
}

export function IntentionGrid({ items }: IntentionGridProps) {
  return (
    <section aria-label="Intentions" className="grid grid-cols-4 gap-3">
      {items.map((item) => (
        <IntentionCard key={item.id} item={item} />
      ))}
    </section>
  );
}
