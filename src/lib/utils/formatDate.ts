/**
 * Formats ISO date string into consistent UTC date format to prevent SSR/hydration locale mismatches
 */
export function formatDate(isoString?: string): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toISOString().split('T')[0];
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = d.toISOString().split('T')[1].substring(0, 5);
    return `${dateStr} ${timeStr} UTC`;
  } catch {
    return isoString;
  }
}
