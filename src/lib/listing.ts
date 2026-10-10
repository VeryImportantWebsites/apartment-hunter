// Pure rules for reading listing data. No React, no store, no path aliases, so
// `node --test` can import this file directly (see listing.test.mjs).
//
// The data is scraped and inconsistent (free-text availability, "1B" vs "1 Bed / 1 Bath",
// "No Fee" vs "no-fee", "N/A" phones, Wikipedia "tour" links). Every component reads it
// through these helpers, so the rules live in one place.

export interface ListingLike {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  floorPlan: string;
  floorPlanImageUrl?: string;
  availability?: string;
  feeStatus?: string;
  netEffectiveRent: number;
  rentBase: number;
  rentMonthsFree: number;
  ranking: number;
  lastUpdated?: string;
  notes?: string;
  source?: string;
  perksAndAmenities?: string[];
  buildingAmenities?: string[];
}

// ---------- availability ----------

export type Availability =
  | { kind: "now" }
  | { kind: "within30" }
  | { kind: "date"; date: Date }
  | { kind: "waitlist" }
  | { kind: "unknown"; raw: string };

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseAvailability(raw?: string): Availability {
  const s = (raw || "").trim().toLowerCase();
  if (!s) return { kind: "unknown", raw: "" };
  if (s === "available now" || s === "now") return { kind: "now" };
  if (s === "waitlist") return { kind: "waitlist" };
  if (s.includes("within 30 days")) return { kind: "within30" };
  const m = s.match(/([a-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (m) {
    const month = MONTHS.indexOf(m[1]);
    if (month >= 0) return { kind: "date", date: new Date(Number(m[3]), month, Number(m[2])) };
  }
  return { kind: "unknown", raw: raw || "" };
}

/** A date that has already passed means the unit is available now. */
export function effectiveAvailability(raw: string | undefined, today: Date): Availability {
  const a = parseAvailability(raw);
  if (a.kind === "date" && a.date.getTime() <= startOfDay(today).getTime()) return { kind: "now" };
  return a;
}

export function availabilityLabel(raw: string | undefined, today: Date): string {
  const a = effectiveAvailability(raw, today);
  if (a.kind === "now") return "Available Now";
  if (a.kind === "waitlist") return "Waitlist";
  if (a.kind === "within30") return "Available within 30 days";
  if (a.kind === "date") {
    return `Available ${a.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  }
  return a.raw;
}

const DAY = 24 * 60 * 60 * 1000;

export function isAvailableWithin(raw: string | undefined, days: number, today: Date): boolean {
  const a = effectiveAvailability(raw, today);
  if (a.kind === "now") return true;
  if (a.kind === "within30") return days >= 30;
  if (a.kind === "date") return a.date.getTime() - startOfDay(today).getTime() <= days * DAY;
  return false;
}

/** "YYYY-MM" for dated listings that are still in the future; otherwise null. */
export function availabilityMonth(raw: string | undefined, today: Date): string | null {
  const a = effectiveAvailability(raw, today);
  if (a.kind !== "date") return null;
  return `${a.date.getFullYear()}-${String(a.date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** Lower = sooner. Now, then dated (by day), then "within 30 days", unknown, waitlist last. */
export function availabilitySortKey(raw: string | undefined, today: Date): number {
  const a = effectiveAvailability(raw, today);
  if (a.kind === "now") return 0;
  if (a.kind === "date") return Math.max(1, Math.round((a.date.getTime() - startOfDay(today).getTime()) / DAY));
  if (a.kind === "within30") return 30.5; // after a dated day 30, before day 31
  if (a.kind === "unknown") return 1e9;
  return 2e9; // waitlist
}

// ---------- unit type, fee, rating ----------

export type Beds = "studio" | number | null;

export function bedrooms(floorPlan: string | undefined): Beds {
  const s = (floorPlan || "").trim().toLowerCase();
  if (!s) return null;
  if (s.includes("studio")) return "studio";
  const m = s.match(/^(\d+)\s*(b\b|bd|bed|br)/);
  return m ? Number(m[1]) : null;
}

export function isNoFee(feeStatus: string | undefined): boolean {
  return (feeStatus || "").toLowerCase().replace(/[^a-z]/g, "") === "nofee";
}

export function feeLabel(feeStatus: string | undefined): string | null {
  if (!feeStatus || !feeStatus.trim()) return null;
  return isNoFee(feeStatus) ? "No Fee" : feeStatus.trim();
}

export function formatRating(ranking: number): string {
  return Number.isFinite(ranking) ? ranking.toFixed(1) : "–";
}

/** Whole stars to fill: 4.7 fills 4, never rounds up to 5. */
export function filledStars(ranking: number): number {
  return Math.max(0, Math.min(5, Math.floor(ranking + 1e-9)));
}

// ---------- contact, links, notes ----------

/** null for empty, "N/A"-style values, and fictional 555-01xx / xxx-555-xxxx numbers. */
export function usablePhone(phone: string | undefined): string | null {
  const p = (phone || "").trim();
  if (!p) return null;
  if (/^(n\/?a|none|tbd|unknown|-+)$/i.test(p)) return null;
  const digits = p.replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length !== 10) return null;
  if (local.slice(3, 6) === "555") return null;
  return p;
}

/** A tour / booking link only if it is a real http(s) URL and not an encyclopedia page. */
export function usableBookingLink(url: string | undefined): string | null {
  const u = (url || "").trim();
  if (!u) return null;
  try {
    const host = new URL(u).hostname.toLowerCase();
    if (!/^https?:$/.test(new URL(u).protocol)) return null;
    if (host === "wikipedia.org" || host.endsWith(".wikipedia.org")) return null;
    return u;
  } catch {
    return null;
  }
}

/** Drop internal provenance sentences ("Externally scraped from ...") from public notes. */
export function publicNotes(notes: string | undefined): string {
  return (notes || "")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => !/^externally scraped\b/i.test(s.trim()))
    .join(" ")
    .trim();
}

/** Generic filler that says nothing about this listing is treated as missing. */
export function usableTransit(text: string | undefined): string | null {
  const t = (text || "").trim();
  if (!t) return null;
  if (/^check local mta lines\.?$/i.test(t)) return null;
  if (/^close to transit lines\b/i.test(t)) return null;
  return t;
}

/**
 * Floor-plan image URLs reused across listings with different bedroom counts are search
 * results, not this unit's plan. Returns the set of URLs that must not be shown.
 */
export function untrustedFloorPlanUrls(list: ListingLike[]): Set<string> {
  const beds = new Map<string, Set<string>>();
  for (const a of list) {
    if (!a.floorPlanImageUrl) continue;
    const b = String(bedrooms(a.floorPlan));
    if (!beds.has(a.floorPlanImageUrl)) beds.set(a.floorPlanImageUrl, new Set());
    beds.get(a.floorPlanImageUrl)!.add(b);
  }
  const bad = new Set<string>();
  for (const [url, set] of beds) if (set.size > 1) bad.add(url);
  return bad;
}

// ---------- map ----------

/**
 * Listings that share exact coordinates stack into one unclickable pin. Spread each group on
 * a small circle (about 12 m) so every pin can be picked. Positions are deterministic.
 */
export function spreadCoordinates(list: { id: string; coordinates: [number, number] }[]): Map<string, [number, number]> {
  const groups = new Map<string, string[]>();
  for (const a of list) {
    const key = `${a.coordinates[0].toFixed(6)},${a.coordinates[1].toFixed(6)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a.id);
  }
  const out = new Map<string, [number, number]>();
  const byId = new Map(list.map((a) => [a.id, a.coordinates] as const));
  for (const ids of groups.values()) {
    const [lat, lng] = byId.get(ids[0])!;
    if (ids.length === 1) { out.set(ids[0], [lat, lng]); continue; }
    const r = 0.00011; // ~12 m in latitude
    ids.forEach((id, i) => {
      const t = (2 * Math.PI * i) / ids.length;
      out.set(id, [lat + r * Math.sin(t), lng + (r * Math.cos(t)) / Math.cos((lat * Math.PI) / 180)]);
    });
  }
  return out;
}

// ---------- filtering and sorting ----------

export type QuickFilter = "all" | "now" | "nofee" | "studio" | "1b" | "2b" | "under3500";
export type SortBy = "rent" | "rating" | "name" | "recent" | "availability";
/** "all" | "now" | "30days" | "waitlist" | "YYYY-MM" */
export type AvailabilityFilter = string;

export interface Filters {
  search: string;
  quick: QuickFilter;
  availability: AvailabilityFilter;
  sort: SortBy;
}

export const DEFAULT_FILTERS: Filters = { search: "", quick: "all", availability: "all", sort: "rent" };

export function matchesFilters(apt: ListingLike, f: Filters, today: Date): boolean {
  const beds = bedrooms(apt.floorPlan);
  if (f.quick === "now" && effectiveAvailability(apt.availability, today).kind !== "now") return false;
  if (f.quick === "nofee" && !isNoFee(apt.feeStatus)) return false;
  if (f.quick === "studio" && beds !== "studio") return false;
  if (f.quick === "1b" && beds !== 1) return false;
  if (f.quick === "2b" && beds !== 2) return false;
  if (f.quick === "under3500" && apt.netEffectiveRent >= 3500) return false;

  const q = f.search.toLowerCase().trim();
  if (q) {
    const hay = [
      apt.name, apt.address, apt.floorPlan, apt.feeStatus, apt.source, apt.notes,
      ...(apt.perksAndAmenities || []), ...(apt.buildingAmenities || []),
    ].filter(Boolean).join("\n").toLowerCase();
    if (!hay.includes(q)) return false;
  }

  const av = f.availability;
  if (av === "now" && effectiveAvailability(apt.availability, today).kind !== "now") return false;
  if (av === "30days" && !isAvailableWithin(apt.availability, 30, today)) return false;
  if (av === "waitlist" && parseAvailability(apt.availability).kind !== "waitlist") return false;
  if (/^\d{4}-\d{2}$/.test(av) && availabilityMonth(apt.availability, today) !== av) return false;
  return true;
}

export function compareListings(a: ListingLike, b: ListingLike, sort: SortBy, today: Date): number {
  if (sort === "rent") return a.netEffectiveRent - b.netEffectiveRent || a.name.localeCompare(b.name);
  if (sort === "rating") return b.ranking - a.ranking || a.name.localeCompare(b.name);
  if (sort === "recent") {
    const ta = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
    const tb = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
    return tb - ta || a.name.localeCompare(b.name);
  }
  if (sort === "availability") {
    return availabilitySortKey(a.availability, today) - availabilitySortKey(b.availability, today)
      || a.netEffectiveRent - b.netEffectiveRent;
  }
  return a.name.localeCompare(b.name);
}

export function visibleListings<T extends ListingLike>(list: T[], f: Filters, today: Date): T[] {
  return list.filter((a) => matchesFilters(a, f, today)).sort((a, b) => compareListings(a, b, f.sort, today));
}

/** Future months that have dated listings, for the availability dropdown. */
export function availableMonths(list: ListingLike[], today: Date): string[] {
  const set = new Set<string>();
  for (const a of list) {
    const m = availabilityMonth(a.availability, today);
    if (m) set.add(m);
  }
  return [...set].sort();
}

// ---------- URL state ----------

export function filtersToQuery(f: Filters, apt?: string | null): string {
  const p = new URLSearchParams();
  if (f.search) p.set("q", f.search);
  if (f.quick !== DEFAULT_FILTERS.quick) p.set("chip", f.quick);
  if (f.availability !== DEFAULT_FILTERS.availability) p.set("avail", f.availability);
  if (f.sort !== DEFAULT_FILTERS.sort) p.set("sort", f.sort);
  if (apt) p.set("apt", apt);
  const s = p.toString();
  return s ? `?${s}` : "";
}

const QUICK: QuickFilter[] = ["all", "now", "nofee", "studio", "1b", "2b", "under3500"];
const SORTS: SortBy[] = ["rent", "rating", "name", "recent", "availability"];

export function filtersFromQuery(search: string): { filters: Filters; apt: string | null } {
  const p = new URLSearchParams(search);
  const chip = p.get("chip") as QuickFilter | null;
  const sort = p.get("sort") as SortBy | null;
  const avail = p.get("avail");
  return {
    filters: {
      search: p.get("q") || "",
      quick: chip && QUICK.includes(chip) ? chip : DEFAULT_FILTERS.quick,
      sort: sort && SORTS.includes(sort) ? sort : DEFAULT_FILTERS.sort,
      availability: avail && /^(all|now|30days|waitlist|\d{4}-\d{2})$/.test(avail) ? avail : DEFAULT_FILTERS.availability,
    },
    apt: p.get("apt"),
  };
}
