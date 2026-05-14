import type { CosmicDeck, DrawMode } from "@/lib/cosmic-api";

import { DRAW_MODES } from "./draw-config";

type SettingsSheetProps = {
  open: boolean;
  decks: CosmicDeck[];
  selectedDeckId: number | null;
  drawMode: DrawMode;
  isLoading: boolean;
  onClose: () => void;
  onDeckChange: (id: number) => void;
  onModeChange: (mode: DrawMode) => void;
};

export function SettingsSheet({
  open,
  decks,
  selectedDeckId,
  drawMode,
  isLoading,
  onClose,
  onDeckChange,
  onModeChange,
}: SettingsSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="animate-draw-fade fixed inset-0 z-[80] flex items-end justify-center bg-[#17112e]/18 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] backdrop-blur-[6px]">
      <button
        type="button"
        aria-label="Close deck settings"
        className="absolute inset-0"
        onClick={onClose}
      />
      <section className="animate-sheet-in relative w-full max-w-[398px] rounded-[34px] border border-white/70 bg-white/86 p-4 shadow-[0_24px_70px_rgba(37,31,79,0.18)] backdrop-blur-2xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#d8cdec]" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#17203f]">
              Draw setup
            </h2>
            <p className="mt-1 text-sm text-[#65708d]">
              Pick the energy before you tap the deck.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#f6f1ff] px-4 py-2 text-sm font-bold text-[#7452ef] transition active:scale-95"
          >
            Done
          </button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a84d8]">
            Deck
          </p>
          <div className="mt-3 grid gap-2">
            {isLoading ? (
              <div className="rounded-[22px] bg-white/70 px-4 py-4 text-sm font-semibold text-[#65708d]">
                Loading decks...
              </div>
            ) : (
              decks.map((deck) => {
                const isActive = deck.id === selectedDeckId;

                return (
                  <button
                    key={deck.id}
                    type="button"
                    onClick={() => onDeckChange(deck.id)}
                    className={`rounded-[22px] border px-4 py-3 text-left transition active:scale-[0.99] ${
                      isActive
                        ? "border-[#d8c8ff] bg-[linear-gradient(145deg,#ffffff,#f4eeff)] shadow-[0_12px_26px_rgba(102,78,170,0.1)]"
                        : "border-white/70 bg-white/48"
                    }`}
                  >
                    <span className="block text-base font-extrabold text-[#17203f]">
                      {deck.name}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-[#65708d]">
                      {deck.shortDescription}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a84d8]">
            Ritual
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {DRAW_MODES.map((mode) => {
              const isActive = mode.value === drawMode;

              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => onModeChange(mode.value)}
                  className={`rounded-[20px] px-3 py-3 text-center transition active:scale-[0.98] ${
                    isActive
                      ? "bg-[#17203f] text-white shadow-[0_12px_24px_rgba(23,32,63,0.18)]"
                      : "bg-white/58 text-[#4f5876]"
                  }`}
                >
                  <span className="block text-sm font-extrabold">
                    {mode.label}
                  </span>
                  <span className="mt-1 block text-[0.68rem] font-semibold opacity-70">
                    {mode.caption}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
