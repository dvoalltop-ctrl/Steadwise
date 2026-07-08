/** Returns today's date as an ISO `YYYY-MM-DD` string. */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Human-friendly greeting based on the local hour. */
export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
