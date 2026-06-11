"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const inputClassName =
  "w-full rounded-2xl border-2 border-brand-black bg-white px-4 py-3 font-display text-base uppercase text-brand-black shadow-[3px_3px_0_0_#0a0a0a] outline-none focus:ring-2 focus:ring-brand-black/20";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin/demandes";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "Connexion impossible.");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Connexion impossible.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-username"
          className="font-display text-sm uppercase text-brand-black/70"
        >
          Identifiant
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={inputClassName}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-password"
          className="font-display text-sm uppercase text-brand-black/70"
        >
          Mot de passe
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-brand-black/80" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-full border-2 border-brand-black bg-brand-black px-4 py-3 font-display text-lg tracking-wide text-brand-yellow uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {isSubmitting ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
