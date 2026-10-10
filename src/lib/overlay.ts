// The user's own changes (added, edited, removed listings), saved in this browser and applied on
// top of the bundled data. Saving only the changes, not the whole list, keeps returning visitors
// on the current bundled data (fixed coordinates, new listings) while their own edits survive a
// reload (blind QA run 3, F2: an added listing vanished on reload).
// Pure functions only; the store does the reading and writing. No path aliases (node --test).

export interface ListingRecord {
  id: string;
}

export interface Overlay {
  version: 1;
  added: ListingRecord[];
  edits: Record<string, Record<string, unknown>>;
  removed: string[];
}

export const EMPTY_OVERLAY: Overlay = { version: 1, added: [], edits: {}, removed: [] };
export const OVERLAY_KEY = "apartment-hunter:my-changes:v1";

export function applyOverlay<T extends ListingRecord>(base: T[], o: Overlay): T[] {
  const removed = new Set(o.removed);
  const out = base
    .filter((a) => !removed.has(a.id))
    .map((a) => (o.edits[a.id] ? ({ ...a, ...o.edits[a.id] } as T) : a));
  for (const a of o.added as T[]) if (!removed.has(a.id)) out.push((o.edits[a.id] ? { ...a, ...o.edits[a.id] } : a) as T);
  return out;
}

export function recordAdd<T extends ListingRecord>(o: Overlay, apt: T): Overlay {
  return { ...o, added: [...o.added, apt] };
}

export function recordEdit(o: Overlay, id: string, patch: Record<string, unknown>): Overlay {
  return { ...o, edits: { ...o.edits, [id]: { ...(o.edits[id] || {}), ...patch } } };
}

export function recordRemove(o: Overlay, id: string): Overlay {
  const isAdded = o.added.some((a) => a.id === id);
  const edits = { ...o.edits };
  delete edits[id];
  return isAdded
    ? { ...o, added: o.added.filter((a) => a.id !== id), edits }
    : { ...o, edits, removed: [...new Set([...o.removed, id])] };
}

/** Parse what was saved; anything unreadable or from another version counts as no changes. */
export function parseOverlay(raw: string | null): Overlay {
  if (!raw) return EMPTY_OVERLAY;
  try {
    const o = JSON.parse(raw);
    if (o?.version !== 1 || !Array.isArray(o.added) || !Array.isArray(o.removed) || typeof o.edits !== "object" || o.edits === null) {
      return EMPTY_OVERLAY;
    }
    return { version: 1, added: o.added.filter((a: ListingRecord) => a && typeof a.id === "string"), edits: o.edits, removed: o.removed.filter((x: unknown) => typeof x === "string") };
  } catch {
    return EMPTY_OVERLAY;
  }
}

export function overlayCount(o: Overlay): number {
  return o.added.length + Object.keys(o.edits).length + o.removed.length;
}
