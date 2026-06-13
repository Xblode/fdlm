export type TimeFilter = {
  from: string;
  to: string | null;
};

const FESTIVAL_MORNING_CUTOFF_MINUTES = 6 * 60;

export function parseDisplayTime(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2})H(\d{2})$/i);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

/** Heures avant 6h = fin de nuit / lendemain, triées après la soirée. */
export function festivalSortMinutes(minutes: number) {
  if (minutes < FESTIVAL_MORNING_CUTOFF_MINUTES) {
    return minutes + 24 * 60;
  }

  return minutes;
}

export function compareDisplayTimes(left: string, right: string) {
  const leftMinutes = parseDisplayTime(left);
  const rightMinutes = parseDisplayTime(right);

  if (leftMinutes === null && rightMinutes === null) {
    return left.localeCompare(right, "fr");
  }
  if (leftMinutes === null) return 1;
  if (rightMinutes === null) return -1;

  return (
    festivalSortMinutes(leftMinutes) - festivalSortMinutes(rightMinutes)
  );
}

export function formatDisplayTime(totalMinutes: number) {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}H${String(minutes).padStart(2, "0")}`;
}

export function normalizeTimeRange(startValue: string, endValue?: string | null) {
  const start = parseDisplayTime(startValue);
  if (start === null) return null;

  const endRaw = endValue?.trim() ? parseDisplayTime(endValue) : start;
  if (endRaw === null) return { start, end: start };

  let end = endRaw;
  if (end <= start) end += 24 * 60;

  return { start, end };
}

export function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) {
  return aStart < bEnd && bStart < aEnd;
}

export function matchesTimeFilter(
  startValue: string,
  endValue: string | null | undefined,
  filter: TimeFilter | null,
) {
  if (!filter) return true;

  const subjectRange = normalizeTimeRange(startValue, endValue ?? startValue);
  const filterRange = normalizeTimeRange(
    filter.from,
    filter.to ?? filter.from,
  );

  if (!subjectRange || !filterRange) return true;

  return rangesOverlap(
    subjectRange.start,
    subjectRange.end,
    filterRange.start,
    filterRange.end,
  );
}

export function parseTimeFilterFromSearchParams(
  fromParam: string | null,
  toParam: string | null,
): TimeFilter | null {
  if (!fromParam || parseDisplayTime(fromParam) === null) return null;

  if (!toParam || parseDisplayTime(toParam) === null) {
    return { from: fromParam, to: null };
  }

  return { from: fromParam, to: toParam };
}

export function collectDisplayTimes(values: string[]) {
  const uniqueMinutes = new Map<number, string>();

  for (const value of values) {
    const minutes = parseDisplayTime(value);
    if (minutes === null) continue;
    uniqueMinutes.set(minutes, value.trim().toUpperCase());
  }

  return [...uniqueMinutes.entries()]
    .sort(([left], [right]) => festivalSortMinutes(left) - festivalSortMinutes(right))
    .map(([, label]) => label);
}

export function formatTimeFilterLabel(filter: TimeFilter | null) {
  if (!filter) return null;
  if (!filter.to || filter.to === filter.from) return filter.from;
  return `${filter.from} – ${filter.to}`;
}
