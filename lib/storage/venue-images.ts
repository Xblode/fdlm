import { createServerSupabaseClient } from "@/lib/supabase/server";

const BUCKET = "venue-images";

export async function uploadVenueImage(
  file: Buffer,
  filename: string,
  contentType: string,
) {
  const supabase = createServerSupabaseClient();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
