type MusicStyleFiltersProps = {
  styles: readonly string[];
  selectedStyle: string | null;
  onSelect: (style: string | null) => void;
};

export function MusicStyleFilters({
  styles,
  selectedStyle,
  onSelect,
}: MusicStyleFiltersProps) {
  return (
    <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full border-2 border-brand-black px-3 py-1 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
          selectedStyle === null
            ? "bg-brand-black text-brand-yellow"
            : "bg-white text-brand-black"
        }`}
      >
        Tous
      </button>
      {styles.map((style) => {
        const isActive = selectedStyle === style;

        return (
          <button
            key={style}
            type="button"
            onClick={() => onSelect(isActive ? null : style)}
            className={`shrink-0 rounded-full border-2 border-brand-black px-3 py-1 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
              isActive
                ? "bg-brand-black text-brand-yellow"
                : "bg-white text-brand-black"
            }`}
          >
            {style}
          </button>
        );
      })}
    </div>
  );
}
