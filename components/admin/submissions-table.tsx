"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCityById } from "@/config/cities";
import type { StoredSubmission, SubmissionStatus } from "@/config/submissions";
import { useAdminCity } from "@/components/admin/admin-city-provider";
import { SearchBar } from "@/components/search-bar";
import { matchesAdminSearch } from "@/lib/utils/admin-search";
import { ADMIN_SUBMISSIONS_CHANGED_EVENT } from "@/lib/utils/pending-submission-counts";

type DemandesFilter = Extract<SubmissionStatus, "pending" | "rejected">;

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "En attente",
  approved: "Approuvée",
  rejected: "Refusée",
};

const DEMANDES_FILTER_OPTIONS: { value: DemandesFilter; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "rejected", label: "Refusées" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSubmissionTitle(submission: StoredSubmission) {
  if (submission.payload.type === "artist") {
    return submission.payload.name;
  }

  return submission.payload.venueName;
}

function getSubmissionDetails(submission: StoredSubmission) {
  if (submission.payload.type === "artist") {
    return `${submission.payload.venue} · ${submission.payload.style}`;
  }

  const artists = submission.payload.artists
    .map((artist) => `${artist.name} (${artist.style})`)
    .join(", ");

  return `${submission.payload.artists.length} artiste(s) · ${artists}`;
}

function getSubmissionSearchValues(submission: StoredSubmission) {
  const values = [
    getSubmissionTitle(submission),
    getSubmissionDetails(submission),
    getCityById(submission.payload.cityId).name,
    submission.payload.type === "artist" ? "artiste" : "lieu",
    STATUS_LABELS[submission.status],
  ];

  if (submission.payload.type === "artist") {
    values.push(
      submission.payload.name,
      submission.payload.venue,
      submission.payload.style,
    );
  } else {
    values.push(
      submission.payload.venueName,
      ...submission.payload.artists.flatMap((artist) => [
        artist.name,
        artist.style,
      ]),
    );
  }

  return values;
}

function notifySubmissionsChanged() {
  window.dispatchEvent(new Event(ADMIN_SUBMISSIONS_CHANGED_EVENT));
}

function SubmissionCard({
  submission,
  showActions,
  isUpdating,
  onApprove,
  onReject,
  onDelete,
}: {
  submission: StoredSubmission;
  showActions?: boolean;
  isUpdating?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
}) {
  const cityName = getCityById(submission.payload.cityId).name;
  const showPendingActions = showActions && submission.status === "pending";

  return (
    <li className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display rounded-full bg-brand-black px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-yellow uppercase">
              {submission.payload.type === "artist" ? "Artiste" : "Lieu"}
            </span>
            <span className="font-display rounded-full border border-brand-black/20 px-2 py-0.5 text-[0.65rem] uppercase text-brand-black/70">
              {STATUS_LABELS[submission.status]}
            </span>
          </div>

          <h3 className="mt-2 font-display text-2xl leading-none uppercase">
            {getSubmissionTitle(submission)}
          </h3>
          <p className="mt-2 text-sm uppercase text-brand-black/70">
            {getSubmissionDetails(submission)}
          </p>
          <p className="mt-1 text-xs uppercase text-brand-black/50">
            {cityName} · {formatDate(submission.createdAt)}
            {submission.reviewedAt
              ? ` · Traité le ${formatDate(submission.reviewedAt)}`
              : ""}
          </p>
        </div>

        {showPendingActions || onDelete ? (
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            {showPendingActions ? (
              <>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={onApprove}
                  className="rounded-full border-2 border-brand-black bg-brand-yellow px-3 py-2 font-display text-xs uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] disabled:opacity-60"
                >
                  Approuver
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={onReject}
                  className="rounded-full border-2 border-brand-black bg-white px-3 py-2 font-display text-xs uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] disabled:opacity-60"
                >
                  Refuser
                </button>
              </>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                disabled={isUpdating}
                onClick={onDelete}
                className="font-display text-xs uppercase text-red-700 underline disabled:opacity-60"
              >
                Supprimer
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {submission.payload.type === "venue" ? (
        <ul className="mt-4 flex flex-col gap-2 border-t border-brand-black/10 pt-4">
          {submission.payload.artists.map((artist) => (
            <li
              key={`${submission.id}-${artist.name}`}
              className="text-sm uppercase text-brand-black/75"
            >
              {artist.name} · {artist.hoursStart} – {artist.hoursEnd} ·{" "}
              {artist.style}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function SubmissionsTable({
  initialSubmissions,
}: {
  initialSubmissions: StoredSubmission[];
}) {
  const { selectedCityId } = useAdminCity();
  const [demandes, setDemandes] = useState(
    initialSubmissions.filter((submission) => submission.status === "pending"),
  );
  const [approved, setApproved] = useState(
    initialSubmissions.filter((submission) => submission.status === "approved"),
  );
  const [filter, setFilter] = useState<DemandesFilter>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadDemandes = useCallback(async (status: DemandesFilter) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/submissions?status=${status}`);
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        data?: StoredSubmission[];
      };

      if (!response.ok || !data.ok || !data.data) {
        throw new Error(data.message ?? "Impossible de charger les demandes.");
      }

      setDemandes(data.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger les demandes.",
      );
      setDemandes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadApproved = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/submissions?status=approved");
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        data?: StoredSubmission[];
      };

      if (!response.ok || !data.ok || !data.data) {
        throw new Error(data.message ?? "Impossible de charger les approuvées.");
      }

      setApproved(data.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger les approuvées.",
      );
    }
  }, []);

  useEffect(() => {
    void loadApproved();
  }, [loadApproved]);

  const filteredDemandes = useMemo(
    () =>
      demandes
        .filter((submission) => submission.payload.cityId === selectedCityId)
        .filter((submission) =>
          matchesAdminSearch(searchQuery, getSubmissionSearchValues(submission)),
        ),
    [demandes, selectedCityId, searchQuery],
  );

  const filteredApproved = useMemo(
    () =>
      approved
        .filter((submission) => submission.payload.cityId === selectedCityId)
        .filter((submission) =>
          matchesAdminSearch(searchQuery, getSubmissionSearchValues(submission)),
        ),
    [approved, selectedCityId, searchQuery],
  );

  function handleFilterChange(nextFilter: DemandesFilter) {
    setFilter(nextFilter);
    void loadDemandes(nextFilter);
  }

  async function updateStatus(id: string, status: SubmissionStatus) {
    setUpdatingId(id);

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        data?: StoredSubmission;
      };

      if (!response.ok || !data.ok || !data.data) {
        throw new Error(data.message ?? "Mise à jour impossible.");
      }

      const updated = data.data;

      if (updated.status === "approved") {
        setDemandes((current) =>
          current.filter((submission) => submission.id !== id),
        );
        setApproved((current) => [updated, ...current]);
      } else {
        setDemandes((current) =>
          current.map((submission) =>
            submission.id === id ? updated : submission,
          ),
        );

        if (filter !== updated.status) {
          setDemandes((current) =>
            current.filter((submission) => submission.id !== id),
          );
        }
      }

      notifySubmissionsChanged();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Mise à jour impossible.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cette demande ?")) return;

    setUpdatingId(id);

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "Suppression impossible.");
      }

      setDemandes((current) =>
        current.filter((submission) => submission.id !== id),
      );
      setApproved((current) =>
        current.filter((submission) => submission.id !== id),
      );
      notifySubmissionsChanged();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Suppression impossible.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {DEMANDES_FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFilterChange(option.value)}
              className={`rounded-full border-2 border-brand-black px-3 py-1.5 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
                filter === option.value
                  ? "bg-brand-black text-brand-yellow"
                  : "bg-white text-brand-black"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher une demande..."
          className=""
        />

        {isLoading ? (
          <p className="text-sm text-brand-black/70">Chargement des demandes…</p>
        ) : null}

        {error ? (
          <p className="text-sm text-brand-black/80" role="alert">
            {error}
          </p>
        ) : null}

        {!isLoading && filteredDemandes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center">
            <p className="font-display text-xl uppercase">
              {searchQuery.trim() ? "Aucun résultat" : "Aucune demande"}
            </p>
            <p className="mt-2 text-sm text-brand-black/70">
              {searchQuery.trim()
                ? `Aucune demande ne correspond à « ${searchQuery.trim()} ».`
                : `Aucune demande ${filter === "pending" ? "en attente" : "refusée"} pour ${getCityById(selectedCityId).name}.`}
            </p>
          </div>
        ) : null}

        <ul className="flex flex-col gap-3">
          {filteredDemandes.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              showActions
              isUpdating={updatingId === submission.id}
              onApprove={() => void updateStatus(submission.id, "approved")}
              onReject={() => void updateStatus(submission.id, "rejected")}
              onDelete={() => void handleDelete(submission.id)}
            />
          ))}
        </ul>
      </div>

      <section className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]">
        <h3 className="font-display text-2xl uppercase">Approuvées</h3>
        <p className="mt-1 text-sm text-brand-black/70">
          Demandes publiées sur le site pour{" "}
          {getCityById(selectedCityId).name}.
        </p>

        {filteredApproved.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-brand-black px-4 py-8 text-center">
            <p className="font-display text-lg uppercase">
              {searchQuery.trim() ? "Aucun résultat" : "Aucune approuvée"}
            </p>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {filteredApproved.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isUpdating={updatingId === submission.id}
                onDelete={() => void handleDelete(submission.id)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
