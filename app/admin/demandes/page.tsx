import type { Metadata } from "next";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { listSubmissions } from "@/lib/data/submissions-store";

export const metadata: Metadata = {
  title: "Demandes — Administration FDLM 2026",
};

export default async function AdminDemandesPage() {
  const initialSubmissions = await listSubmissions();

  return (
    <section className="rounded-3xl border-2 border-brand-black bg-brand-yellow p-5 shadow-[6px_6px_0_0_#0a0a0a]">
      <h2 className="font-display text-3xl leading-none uppercase">
        Demandes
      </h2>

      <div className="mt-5">
        <SubmissionsTable initialSubmissions={initialSubmissions} />
      </div>
    </section>
  );
}
