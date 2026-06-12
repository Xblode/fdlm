"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultCityId } from "@/config/cities";

const STORAGE_KEY = "fdlm-admin-city";

type AdminCityContextValue = {
  selectedCityId: string;
  setSelectedCityId: (cityId: string) => void;
};

const AdminCityContext = createContext<AdminCityContextValue | null>(null);

export function AdminCityProvider({ children }: { children: ReactNode }) {
  const [selectedCityId, setSelectedCityIdState] = useState(defaultCityId);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSelectedCityIdState(stored);
    }
  }, []);

  function setSelectedCityId(cityId: string) {
    setSelectedCityIdState(cityId);
    window.localStorage.setItem(STORAGE_KEY, cityId);
  }

  return (
    <AdminCityContext.Provider value={{ selectedCityId, setSelectedCityId }}>
      {children}
    </AdminCityContext.Provider>
  );
}

export function useAdminCity() {
  const context = useContext(AdminCityContext);

  if (!context) {
    throw new Error("useAdminCity must be used within AdminCityProvider");
  }

  return context;
}
