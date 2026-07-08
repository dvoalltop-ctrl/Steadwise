/**
 * Lightweight unique id generator for mock/in-memory data.
 * Replace with a proper UUID once persistence is introduced.
 */
export function createId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
