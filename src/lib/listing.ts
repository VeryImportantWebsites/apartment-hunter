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
  sqft?: number;
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

/** Stars rounded to the nearest half: 4.7 -> 4.5 (4 full + 1 half), 4.0 -> 4, 4.8 -> 5.
 *  Whole-star flooring made 4.7 look the same as 4.0 (blind QA run 3, F4). */
export function starParts(ranking: number): { full: number; half: boolean } {
  const r = Math.max(0, Math.min(5, Math.round((Number.isFinite(ranking) ? ranking : 0) * 2) / 2));
  return { full: Math.floor(r), half: r % 1 !== 0 };
}

/** @deprecated use starParts; kept for callers that need whole stars only. */
export function filledStars(ranking: number): number {
  return starParts(ranking).full;
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
  /** Combinable chips: price, fee and "now" stack; studio / 1b / 2b are one choice. Empty = all. */
  quick: QuickFilter[];
  availability: AvailabilityFilter;
  sort: SortBy;
}

export const DEFAULT_FILTERS: Filters = { search: "", quick: [], availability: "all", sort: "rent" };

const BED_CHIPS: QuickFilter[] = ["studio", "1b", "2b"];

/** Toggle one chip. "all" clears; bed chips replace each other; the rest stack (blind QA run 3, F9). */
export function toggleQuick(current: QuickFilter[], id: QuickFilter): QuickFilter[] {
  if (id === "all") return [];
  if (current.includes(id)) return current.filter((q) => q !== id);
  const rest = BED_CHIPS.includes(id) ? current.filter((q) => !BED_CHIPS.includes(q)) : current;
  return [...rest, id];
}

export function matchesFilters(apt: ListingLike, f: Filters, today: Date): boolean {
  const beds = bedrooms(apt.floorPlan);
  const on = (id: QuickFilter) => f.quick.includes(id);
  if (on("now") && effectiveAvailability(apt.availability, today).kind !== "now") return false;
  if (on("nofee") && !isNoFee(apt.feeStatus)) return false;
  if (on("studio") && beds !== "studio") return false;
  if (on("1b") && beds !== 1) return false;
  if (on("2b") && beds !== 2) return false;
  if (on("under3500") && apt.netEffectiveRent >= 3500) return false;

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
  if (f.quick.length) p.set("chip", f.quick.join(","));
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
  const chips = (p.get("chip") || "").split(",").filter((c): c is QuickFilter => QUICK.includes(c as QuickFilter) && c !== "all");
  const sort = p.get("sort") as SortBy | null;
  const avail = p.get("avail");
  return {
    filters: {
      search: p.get("q") || "",
      quick: chips.reduce<QuickFilter[]>((acc, c) => (acc.includes(c) ? acc : toggleQuick(acc, c)), []),
      sort: sort && SORTS.includes(sort) ? sort : DEFAULT_FILTERS.sort,
      availability: avail && /^(all|now|30days|waitlist|\d{4}-\d{2})$/.test(avail) ? avail : DEFAULT_FILTERS.availability,
    },
    apt: p.get("apt"),
  };
}

// ---------- lease term, size ----------

/** "12" (a bare number in 75 records) reads "12 months"; text values pass through. */
export function leaseLabel(lease: string | number | undefined): string | null {
  if (lease === undefined || lease === null || String(lease).trim() === "") return null;
  const s = String(lease).trim();
  if (/^\d+$/.test(s)) return `${s} month${s === "1" ? "" : "s"}`;
  return s.replace(/\bMonths\b/, "months");
}

// Square footage outside these bounds for the unit type is not this unit's size (the scraper
// reused values: studios at 1,200 sqft, 2-beds at 700). Treated as missing, like other
// untrustworthy fields (repo rule: no mock data).
const SQFT_BOUNDS: Record<string, [number, number]> = {
  studio: [250, 900],
  "1": [350, 1300],
  "2": [750, 2200],
  "3": [1000, 3500],
};

function buildingKey(address: string): string {
  return address.split(",")[0].replace(/\s*(#|unit\b|apt\.?)\s*[\w-]+/gi, "").trim().toLowerCase();
}

/** Ids whose sqft is implausible for the unit type, or equal across different unit types in one building. */
export function untrustedSqftIds(list: (ListingLike & { sqft?: number })[]): Set<string> {
  const bad = new Set<string>();
  const byBuilding = new Map<string, (ListingLike & { sqft?: number })[]>();
  for (const a of list) {
    if (!a.sqft) continue;
    const bounds = SQFT_BOUNDS[String(bedrooms(a.floorPlan))];
    if (bounds && (a.sqft < bounds[0] || a.sqft > bounds[1])) bad.add(a.id);
    const k = buildingKey(a.address);
    if (!byBuilding.has(k)) byBuilding.set(k, []);
    byBuilding.get(k)!.push(a);
  }
  for (const units of byBuilding.values()) {
    const bySize = new Map<number, Set<string>>();
    for (const u of units) {
      if (!bySize.has(u.sqft!)) bySize.set(u.sqft!, new Set());
      bySize.get(u.sqft!)!.add(String(bedrooms(u.floorPlan)));
    }
    for (const u of units) if (bySize.get(u.sqft!)!.size > 1) bad.add(u.id);
  }
  return bad;
}

export function formatMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

// ---------- photos ----------

/** Photo URLs that appear on listings in more than one building are stock or search results,
 *  not this building (blind QA run 3, F6). Same rule as floor plans. */
export function untrustedImageUrls(list: (ListingLike & { images?: string[] })[]): Set<string> {
  const buildings = new Map<string, Set<string>>();
  for (const a of list) {
    for (const u of a.images || []) {
      if (!buildings.has(u)) buildings.set(u, new Set());
      buildings.get(u)!.add(buildingKey(a.address));
    }
  }
  return new Set([...buildings].filter(([, b]) => b.size > 1).map(([u]) => u));
}

// ---------- add / edit form ----------

export interface ListingInput {
  rentBase: number;
  rentMonthsFree: number;
  ranking: number;
  leaseTerm?: string | number;
  sqft?: number;
}

/** Returns a message per invalid field (blind QA run 3, F1); empty object = valid. */
export function validateListingInput(v: ListingInput): Partial<Record<keyof ListingInput, string>> {
  const errors: Partial<Record<keyof ListingInput, string>> = {};
  const lease = Number(String(v.leaseTerm ?? "").match(/\d+/)?.[0] ?? 12) || 12;
  if (!Number.isFinite(v.rentBase) || v.rentBase <= 0) errors.rentBase = "Base rent must be more than $0.";
  if (!Number.isFinite(v.rentMonthsFree) || v.rentMonthsFree < 0) errors.rentMonthsFree = "Months free cannot be negative.";
  else if (v.rentMonthsFree >= lease) errors.rentMonthsFree = `Months free must be less than the ${lease}-month lease.`;
  if (!Number.isFinite(v.ranking) || v.ranking < 1 || v.ranking > 5) errors.ranking = "Rating must be between 1 and 5.";
  if (v.sqft !== undefined && (!Number.isFinite(v.sqft) || v.sqft <= 0)) errors.sqft = "Size must be more than 0 sqft.";
  return errors;
}
