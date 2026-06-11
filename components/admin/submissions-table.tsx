"use client";

import { useCallback, useState } from "react";
import { getCityById } from "@/config/cities";
import type { StoredSubmission, SubmissionStatus } from "@/config/submissions";

type StatusFilter = "all" | SubmissionStatus;

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "En attente",
  approved: "Approuvée",
  rejected: "Refusée",
};

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "approved", label: "Approuvées" },
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
    return `${submission.payload.hoursStart} – ${submission.payload.hoursEnd} · ${submission.payload.venue} · ${submission.payload.style}`;
  }

  const artistCount = submission.payload.artists.length;
  return `${submission.payload.hoursStart} – ${submission.payload.hoursEnd} · ${artistCount} artiste${artistCount > 1 ? "s" : ""}`;
}

export function SubmissionsTable({
  initialSubmissions,
}: {
  initialSubmissions: StoredSubmission[];
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadSubmissions = useCallback(async (status: StatusFilter) => {
    setIsLoading(true);
    setError(null);

    const query = status === "all" ? "" : `?status=${status}`;

    try {
      const response = await fetch(`/api/admin/submissions${query}`);
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        data?: StoredSubmission[];
      };

      if (!response.ok || !data.ok || !data.data) {
        throw new Error(data.message ?? "Impossible de charger les demandes.");
      }

      setSubmissions(data.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger les demandes.",
      );
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleFilterChange(nextFilter: StatusFilter) {
    setFilter(nextFilter);
    void loadSubmissions(nextFilter);
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

      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === id ? data.data! : submission,
        ),
      );

      if (filter !== "all" && data.data.status !== filter) {
        setSubmissions((current) =>
          current.filter((submission) => submission.id !== id),
        );
      }
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
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

      {isLoading ? (
        <p className="text-sm text-brand-black/70">Chargement des demandes…</p>
      ) : null}

      {error ? (
        <p className="text-sm text-brand-black/80" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && submissions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-black/30 bg-white px-4 py-8 text-center">
          <p className="font-display text-xl uppercase">Aucune demande</p>
          <p className="mt-2 text-sm text-brand-black/70">
            Les soumissions du formulaire apparaîtront ici.
          </p>
        </div>
      ) : null}

      <ul className="flex flex-col gap-3">
        {submissions.map((submission) => {
          const cityName = getCityById(submission.payload.cityId).name;
          const isUpdating = updatingId === submission.id;

          return (
            <li
              key={submission.id}
              className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display rounded-full bg-brand-black px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-yellow uppercase">
                      {submission.payload.type === "artist"
                        ? "Artiste"
                        : "Lieu"}
                    </span>
                    <span className="font-display rounded-full border border-brand-black/20 px-2 py-0.5 text-[0.65rem] uppercase text-brand-black/70">
                      {STATUS_LABELS[submission.status]}
                    </span>
                  </div>

                  <h2 className="mt-2 font-display text-2xl leading-none uppercase">
                    {getSubmissionTitle(submission)}
                  </h2>
                  <p className="mt-2 text-sm uppercase text-brand-black/70">
                    {getSubmissionDetails(submission)}
                  </p>
                  <p className="mt-1 text-xs uppercase text-brand-black/50">
                    {cityName} · {formatDate(submission.createdAt)}
                  </p>
                </div>

                {submission.status === "pending" ? (
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => updateStatus(submission.id, "approved")}
                      className="rounded-full border-2 border-brand-black bg-brand-yellow px-3 py-2 font-display text-xs uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] disabled:opacity-60"
                    >
                      Approuver
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => updateStatus(submission.id, "rejected")}
                      className="rounded-full border-2 border-brand-black bg-white px-3 py-2 font-display text-xs uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] disabled:opacity-60"
                    >
                      Refuser
                    </button>
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
        })}
      </ul>
    </div>
  );
}
