"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminCityProvider, useAdminCity } from "@/components/admin/admin-city-provider";
import { CityPicker } from "@/components/city-picker";
import { cities } from "@/config/cities";
import type { StoredSubmission } from "@/config/submissions";
import {
  ADMIN_SUBMISSIONS_CHANGED_EVENT,
  countPendingSubmissionsByCityId,
} from "@/lib/utils/pending-submission-counts";

type AdminShellProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { href: "/admin/demandes", label: "Demandes", enabled: true },
  { href: "/admin/lieux", label: "Lieux", enabled: true },
  { href: "/admin/artistes", label: "Artistes", enabled: true },
] as const;

export function AdminShell({ children }: AdminShellProps) {
  return (
    <AdminCityProvider>
      <AdminShellContent>{children}</AdminShellContent>
    </AdminCityProvider>
  );
}

function AdminShellContent({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCityId, setSelectedCityId } = useAdminCity();
  const adminCities = cities.map((city) => ({ ...city, available: true }));
  const [pendingCountsByCityId, setPendingCountsByCityId] = useState<
    Record<string, number>
  >({});

  const refreshPendingCounts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/submissions?status=pending");
      const data = (await response.json()) as {
        ok?: boolean;
        data?: StoredSubmission[];
      };

      if (!response.ok || !data.ok || !data.data) return;

      setPendingCountsByCityId(countPendingSubmissionsByCityId(data.data));
    } catch {
      // Ignore count refresh errors in the shell UI.
    }
  }, []);

  useEffect(() => {
    void refreshPendingCounts();
  }, [pathname, refreshPendingCounts]);

  useEffect(() => {
    function handleSubmissionsChanged() {
      void refreshPendingCounts();
    }

    window.addEventListener(
      ADMIN_SUBMISSIONS_CHANGED_EVENT,
      handleSubmissionsChanged,
    );

    return () => {
      window.removeEventListener(
        ADMIN_SUBMISSIONS_CHANGED_EVENT,
        handleSubmissionsChanged,
      );
    };
  }, [refreshPendingCounts]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-full bg-[#f5f2eb] text-brand-black">
      <header className="border-b-2 border-brand-black bg-brand-black px-4 py-4 text-brand-yellow md:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.2em] uppercase opacity-70">
              FDLM 2026
            </p>
            <h1 className="font-display text-2xl leading-none uppercase md:text-3xl">
              Administration
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="rounded-full border-2 border-brand-yellow px-4 py-2 font-display text-sm uppercase transition-transform active:scale-[0.98]"
            >
              Voir le site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border-2 border-brand-yellow px-4 py-2 font-display text-sm uppercase transition-transform active:scale-[0.98]"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
        <nav className="flex shrink-0 gap-2 overflow-x-auto md:w-48 md:flex-col md:overflow-visible">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            if (!item.enabled) {
              return (
                <span
                  key={item.href}
                  className="shrink-0 rounded-full border-2 border-brand-black/15 px-4 py-2 font-display text-sm uppercase text-brand-black/35"
                >
                  {item.label}
                  <span className="ml-2 text-[0.65rem] tracking-wide">
                    Bientôt
                  </span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full border-2 border-brand-black px-4 py-2 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
                  isActive
                    ? "bg-brand-black text-brand-yellow"
                    : "bg-white text-brand-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1">
          <div className="mb-5">
            <p className="mb-2 font-display text-sm uppercase text-brand-black/70">
              Ville
            </p>
            <CityPicker
              variant="admin"
              cities={adminCities}
              value={selectedCityId}
              onChange={setSelectedCityId}
              pendingCountsByCityId={pendingCountsByCityId}
              onOpen={() => void refreshPendingCounts()}
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
