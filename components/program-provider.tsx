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
import { getOrCreateUserUuid } from "@/lib/anonymous-user";

export type ProgramEntry = {
  id: string;
  artistId: string;
  artistName: string;
  slot: string;
  genre: string;
  venueName: string;
};

type ProgramContextValue = {
  entries: ProgramEntry[];
  isReady: boolean;
  addToProgram: (entry: Omit<ProgramEntry, "id">) => Promise<void>;
  removeFromProgram: (artistId: string) => Promise<void>;
  removeFromProgramByArtist: (artistId: string) => Promise<void>;
  isInProgram: (artistId: string) => boolean;
};

const ProgramContext = createContext<ProgramContextValue | null>(null);

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ProgramEntry[]>([]);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const uuid = getOrCreateUserUuid();
    if (!uuid) return;

    setUserUuid(uuid);

    fetch(`/api/program?uuid=${encodeURIComponent(uuid)}`)
      .then((response) => response.json())
      .then((payload) => {
        if (payload.ok && Array.isArray(payload.data)) {
          setEntries(payload.data);
        }
      })
      .catch(() => {
        setEntries([]);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  const addToProgram = useCallback(
    async (entry: Omit<ProgramEntry, "id">) => {
      if (!userUuid) return;

      setEntries((current) => {
        if (current.some((item) => item.artistId === entry.artistId)) {
          return current;
        }

        return [...current, { ...entry, id: entry.artistId }];
      });

      try {
        const response = await fetch("/api/program", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid: userUuid, ...entry }),
        });

        const payload = await response.json();

        if (!response.ok || !payload.ok) {
          throw new Error(payload.message ?? "Erreur programme");
        }

        setEntries((current) => {
          const without = current.filter(
            (item) => item.artistId !== entry.artistId,
          );
          return [...without, payload.data as ProgramEntry];
        });
      } catch {
        setEntries((current) =>
          current.filter((item) => item.artistId !== entry.artistId),
        );
      }
    },
    [userUuid],
  );

  const removeFromProgram = useCallback(
    async (artistId: string) => {
      if (!userUuid) return;

      setEntries((current) => current.filter((item) => item.artistId !== artistId));

      try {
        await fetch("/api/program", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid: userUuid, artistId }),
        });
      } catch {
        const response = await fetch(
          `/api/program?uuid=${encodeURIComponent(userUuid)}`,
        );
        const payload = await response.json();
        if (payload.ok && Array.isArray(payload.data)) {
          setEntries(payload.data);
        }
      }
    },
    [userUuid],
  );

  const removeFromProgramByArtist = removeFromProgram;

  const isInProgram = useCallback(
    (artistId: string) => entries.some((item) => item.artistId === artistId),
    [entries],
  );

  const value = useMemo(
    () => ({
      entries,
      isReady,
      addToProgram,
      removeFromProgram,
      removeFromProgramByArtist,
      isInProgram,
    }),
    [
      entries,
      isReady,
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
