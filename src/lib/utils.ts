export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Format a worship request event date from its stored parts. */
export function formatEventDate(
  month: number | null,
  day: number | null,
  year: number | null,
  time: string | null,
  dateTbd: boolean
): string {
  if (dateTbd) return "Date TBD";
  if (!month) return "No date specified";
  return `${MONTHS[month - 1]} ${day}, ${year}${time ? ` · ${time}` : ""}`;
}

/** Format a UTC timestamp for display. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
