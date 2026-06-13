import type { TimeFilter } from "@/lib/utils/time-filter";

export function buildListPageParams(
  cityId: string,
  style: string | null,
  timeFilter: TimeFilter | null,
) {
  const params = new URLSearchParams();
  params.set("ville", cityId);
  if (style) params.set("style", style);
  if (timeFilter?.from) {
    params.set("de", timeFilter.from);
    if (timeFilter.to) params.set("a", timeFilter.to);
  }
  return params;
}
