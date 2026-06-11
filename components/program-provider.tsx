"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ProgramEntry = {
  id: string;
  artistName: string;
  slot: string;
  genre: string;
  venueName: string;
};

type ProgramContextValue = {
  entries: ProgramEntry[];
  addToProgram: (entry: Omit<ProgramEntry, "id">) => void;
  removeFromProgram: (id: string) => void;
  removeFromProgramByArtist: (artistName: string, venueName: string) => void;
  isInProgram: (artistName: string, venueName: string) => boolean;
};

const ProgramContext = createContext<ProgramContextValue | null>(null);

const PROGRAM_STORAGE_KEY = "fdlm-program";

function buildProgramEntryId(artistName: string, venueName: string) {
  return `${artistName.toLowerCase()}::${venueName.toLowerCase()}`;
}

function readStoredEntries(): ProgramEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(PROGRAM_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is ProgramEntry =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.artistName === "string" &&
        typeof item.slot === "string" &&
        typeof item.genre === "string" &&
        typeof item.venueName === "string",
    );
  } catch {
    return [];
  }
}

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ProgramEntry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredEntries();
    // Hydratation client depuis localStorage après le montage (SSR → client)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pattern d'hydratation localStorage
    setEntries(stored);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(entries));
  }, [entries, isHydrated]);

  const addToProgram = useCallback((entry: Omit<ProgramEntry, "id">) => {
    const id = buildProgramEntryId(entry.artistName, entry.venueName);

    setEntries((current) => {
      if (current.some((item) => item.id === id)) return current;
      return [...current, { ...entry, id }];
    });
  }, []);

  const removeFromProgram = useCallback((id: string) => {
    setEntries((current) => current.filter((item) => item.id !== id));
  }, []);

  const removeFromProgramByArtist = useCallback(
    (artistName: string, venueName: string) => {
      const id = buildProgramEntryId(artistName, venueName);
      setEntries((current) => current.filter((item) => item.id !== id));
    },
    [],
  );

  const isInProgram = useCallback(
    (artistName: string, venueName: string) => {
      const id = buildProgramEntryId(artistName, venueName);
      return entries.some((item) => item.id === id);
    },
    [entries],
  );

  const value = useMemo(
    () => ({
      entries,
      addToProgram,
      removeFromProgram,
      removeFromProgramByArtist,
      isInProgram,
    }),
    [
      entries,
      addToProgram,
      removeFromProgram,
      removeFromProgramByArtist,
      isInProgram,
    ],
  );

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  );
}

export function useProgram() {
  const context = useContext(ProgramContext);

  if (!context) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }

  return context;
}
