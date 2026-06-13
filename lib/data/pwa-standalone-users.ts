import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function recordPwaStandaloneOpen(userUuid: string) {
  const supabase = createServerSupabaseClient();
  const now = new Date().toISOString();

  const { error } = await supabase.from("pwa_standalone_users").upsert(
    {
      user_uuid: userUuid,
      first_seen_at: now,
      last_seen_at: now,
      open_count: 1,
    },
    { onConflict: "user_uuid", ignoreDuplicates: true },
  );

  if (error) throw error;
}

export async function getPwaStandaloneStats() {
  const supabase = createServerSupabaseClient();

  const { count, error } = await supabase
    .from("pwa_standalone_users")
    .select("*", { count: "exact", head: true });

  if (error) throw error;

  return {
    uniqueUsers: count ?? 0,
  };
}
