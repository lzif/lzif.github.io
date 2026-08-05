/**
 * Accepts a zero-padded ISO calendar date ("2024-01-15"), a non-padded one
 * ("2024-1-15"), or a full timestamp ("2024-01-15T00:00:00.000Z"). Post dates are
 * already normalised by `getPosts()`; this tolerance is defence in depth so a
 * caller elsewhere can never render the string "Invalid Date" into the page.
 */
export function formatDate(date: string): string {
  const raw = date.trim();
  const dateOnly = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);
  const parsed = dateOnly
    ? new Date(`${dateOnly[1]}-${dateOnly[2].padStart(2, "0")}-${dateOnly[3].padStart(2, "0")}T00:00:00Z`)
    : new Date(raw);

  if (Number.isNaN(parsed.getTime())) return raw;

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
