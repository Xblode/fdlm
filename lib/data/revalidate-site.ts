import { revalidatePath } from "next/cache";

export function revalidateVenuePages(venueId?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/lieux");
  revalidatePath("/admin/lieux");

  if (venueId) {
    revalidatePath(`/lieux/${venueId}`);
  }
}
