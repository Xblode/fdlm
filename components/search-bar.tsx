function SearchIcon() {
  return (
    <svg
      className="size-5 shrink-0 text-brand-black"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="mb-3 flex h-12 items-center gap-3 rounded-2xl border-2 border-brand-black bg-white px-4 shadow-[3px_3px_0_0_#0a0a0a]">
      <SearchIcon />
      <span className="sr-only">Rechercher</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher un lieu, un artiste..."
        className="w-full bg-transparent text-base text-brand-black outline-none placeholder:text-brand-black/40"
      />
    </label>
  );
}
