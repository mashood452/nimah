export type SavedCartLine = { slug: string; color: string; qty: number };

export function parseCartLines(value: unknown): SavedCartLine[] | null {
  if (!Array.isArray(value) || value.length > 50) return null;
  const map = new Map<string, SavedCartLine>();
  for (const line of value) {
    if (!line || typeof line !== "object" || typeof line.slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,190}$/.test(line.slug)
      || typeof line.color !== "string" || !line.color || line.color.length > 80 || /[\u0000-\u001f]/.test(line.color)
      || !Number.isInteger(line.qty) || line.qty < 1 || line.qty > 10) return null;
    const key = `${line.slug}:${line.color}`;
    map.set(key, { slug: line.slug, color: line.color, qty: Math.min(10, (map.get(key)?.qty ?? 0) + line.qty) });
  }
  return [...map.values()].sort((a, b) => `${a.slug}:${a.color}`.localeCompare(`${b.slug}:${b.color}`));
}

export function mergeSavedCarts(base: SavedCartLine[], guest: SavedCartLine[]) {
  const map = new Map(base.map((line) => [`${line.slug}:${line.color}`, line]));
  for (const line of guest) {
    const key = `${line.slug}:${line.color}`;
    map.set(key, { ...line, qty: Math.max(map.get(key)?.qty ?? 0, line.qty) });
  }
  return [...map.values()];
}
