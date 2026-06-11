import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Connexion — Fête de la musique 2026",
  description: "Accès administration FDLM 2026",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin/demandes");
  }

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-brand-yellow px-4 py-10 text-brand-black">
      <div className="w-full max-w-md rounded-3xl border-2 border-brand-black bg-brand-yellow p-6 shadow-[8px_8px_0_0_#0a0a0a]">
        <p className="font-display text-xs tracking-[0.2em] uppercase opacity-70">
          Administration
        </p>
        <h1 className="mt-1 font-display text-4xl leading-none uppercase">
          Connexion
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-black/70">
          Accès réservé à l&apos;équipe pour gérer les demandes du site.
        </p>

        <div className="mt-6">
          <Suspense fallback={<p className="text-sm">Chargement…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      <Link
        href="/"
        className="mt-6 font-display text-sm uppercase underline underline-offset-4"
      >
        Retour au site
      </Link>
    </main>
  );
}
