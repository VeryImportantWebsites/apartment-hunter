// Run: npm test   (node --test with native TypeScript stripping)
// Each test pins a defect the 2026-10-10 blind QA run found on the live site (issues #2-#7).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  parseAvailability, effectiveAvailability, availabilityLabel, isAvailableWithin,
  availabilitySortKey, availableMonths, bedrooms, isNoFee, formatRating, filledStars,
  usablePhone, usableBookingLink, publicNotes, usableTransit, untrustedFloorPlanUrls,
  spreadCoordinates, visibleListings, matchesFilters, DEFAULT_FILTERS,
  filtersToQuery, filtersFromQuery, leaseLabel, untrustedSqftIds, formatMoney,
  toggleQuick, starParts, untrustedImageUrls, validateListingInput,
} from "./listing.ts";

const TODAY = new Date(2026, 9, 10); // 2026-10-10, the day of the blind run
const DATA = JSON.parse(readFileSync(new URL("../data/apartments.json", import.meta.url), "utf8"));
const byName = (n) => DATA.find((a) => a.name === n);

test("#3 F8: 'Within 30 Days' keeps a listing available in 5 days (19 Dutch)", () => {
  const dutch = byName("19 Dutch");
  assert.equal(dutch.availability, "Available October 15, 2026");
  assert.equal(isAvailableWithin(dutch.availability, 30, TODAY), true);
  const shown = visibleListings(DATA, { ...DEFAULT_FILTERS, availability: "30days" }, TODAY);
  assert.ok(shown.some((a) => a.name === "19 Dutch"));
  // and still excludes things further out
  assert.equal(isAvailableWithin("Available December 1, 2026", 30, TODAY), false);
  assert.equal(isAvailableWithin("Waitlist", 30, TODAY), false);
});

test("#3 F16: availability sort is chronological, not alphabetical", () => {
  const order = ["Available December 1, 2026", "Available November 1, 2026", "Available October 15, 2026", "Waitlist", "Available Now"]
    .sort((a, b) => availabilitySortKey(a, TODAY) - availabilitySortKey(b, TODAY));
  assert.deepEqual(order, ["Available Now", "Available October 15, 2026", "Available November 1, 2026", "Available December 1, 2026", "Waitlist"]);
  const sorted = visibleListings(DATA, { ...DEFAULT_FILTERS, sort: "availability" }, TODAY);
  const keys = sorted.map((a) => availabilitySortKey(a.availability, TODAY));
  assert.deepEqual(keys, [...keys].sort((x, y) => x - y));
});

test("#3 F7: a date that has passed reads 'Available Now'", () => {
  assert.equal(availabilityLabel("Available October 1, 2026", TODAY), "Available Now");
  assert.equal(effectiveAvailability("Available October 1, 2026", TODAY).kind, "now");
  assert.equal(availabilityLabel("Available November 15, 2026", TODAY), "Available November 15, 2026");
  assert.equal(parseAvailability("Available within 30 days").kind, "within30");
  assert.equal(parseAvailability("").kind, "unknown");
});

test("#3: month options are derived from data and never list a past month", () => {
  const months = availableMonths(DATA, TODAY);
  assert.ok(months.length > 0);
  assert.ok(months.every((m) => m >= "2026-10"));
  assert.ok(months.includes("2026-11"));
});

test("#6 F4: rating shows one decimal, never '4.7.0'; stars do not round up", () => {
  assert.equal(formatRating(4.7), "4.7");
  assert.equal(formatRating(4), "4.0");
  assert.deepEqual(starParts(4.7), { full: 4, half: true });   // 4.7 must not look like 4.0 (run 3 F4)
  assert.deepEqual(starParts(4.0), { full: 4, half: false });
  assert.deepEqual(starParts(4.8), { full: 5, half: false });
  assert.equal(filledStars(5), 5);
  assert.ok(DATA.every((a) => !formatRating(a.ranking).includes(".0.")));
});

test("#6: 'No Fee' chip matches every spelling in the data", () => {
  for (const s of ["No Fee", "no-fee", "No-fee"]) assert.equal(isNoFee(s), true, s);
  assert.equal(isNoFee("Broker fee 1 month"), false);
  const noFee = visibleListings(DATA, { ...DEFAULT_FILTERS, quick: ["nofee"] }, TODAY);
  assert.equal(noFee.length, DATA.filter((a) => isNoFee(a.feeStatus)).length);
  assert.equal(noFee.length, 420); // 397 + 15 + 8; the old includes("no fee") found 397
});

test("#6: bed chips match '1 Bed / 1 Bath' as well as '1B'", () => {
  assert.equal(bedrooms("1B"), 1);
  assert.equal(bedrooms("1 Bed / 1 Bath"), 1);
  assert.equal(bedrooms("1 Bed / 1.5 Bath"), 1);
  assert.equal(bedrooms("2 Bed / 2 Bath"), 2);
  assert.equal(bedrooms("Studio"), "studio");
  const one = visibleListings(DATA, { ...DEFAULT_FILTERS, quick: ["1b"] }, TODAY);
  assert.equal(one.length, 269 + 7 + 1);
});

test("#7 F11: N/A and 555 phones and Wikipedia 'tour' links are treated as missing", () => {
  assert.equal(usablePhone("N/A"), null);
  assert.equal(usablePhone("212-555-0199"), null);
  assert.equal(usablePhone(""), null);
  assert.equal(usablePhone("(201) 420-1300"), "(201) 420-1300");
  assert.equal(usableBookingLink("https://en.wikipedia.org/wiki/19_Dutch"), null);
  assert.equal(usableBookingLink("javascript:alert(1)"), null);
  assert.equal(usableBookingLink("https://streeteasy.com/building/x"), "https://streeteasy.com/building/x");
  const dutch = byName("19 Dutch");
  assert.equal(usablePhone(dutch.contactPhone), null);
  assert.equal(usableBookingLink(dutch.appointmentLink), null);
  assert.equal(usableTransit(dutch.transitDetails), null);
});

test("#7: provenance notes are not shown to the public", () => {
  assert.equal(publicNotes("Externally scraped from StreetEasy (Jersey City). Great light."), "Great light.");
  assert.equal(publicNotes("Externally scraped from StreetEasy (Jersey City)."), "");
});

test("#7 F5: a floor-plan image reused across different unit types is not trusted", () => {
  const bad = untrustedFloorPlanUrls(DATA);
  assert.ok(bad.size > 0);
  const halladay = byName("399 Halladay Street #204");
  const halo = byName("Halo LIC");
  assert.ok(bad.has(halladay.floorPlanImageUrl) || bad.has(halo.floorPlanImageUrl));
  // a URL used only by one unit type is kept
  const ok = untrustedFloorPlanUrls([
    { ...halo, id: "a", floorPlan: "1B", floorPlanImageUrl: "u1" },
    { ...halo, id: "b", floorPlan: "1 Bed / 1 Bath", floorPlanImageUrl: "u1" },
  ]);
  assert.equal(ok.size, 0);
});

test("#7: stacked pins are spread so every pin is distinct", () => {
  const pos = spreadCoordinates(DATA);
  const keys = new Set([...pos.values()].map(([a, b]) => `${a.toFixed(7)},${b.toFixed(7)}`));
  assert.equal(keys.size, DATA.length);
  // a lone pin does not move
  const lone = DATA.find((a) => DATA.filter((b) => b.coordinates[0] === a.coordinates[0] && b.coordinates[1] === a.coordinates[1]).length === 1);
  assert.deepEqual(pos.get(lone.id), lone.coordinates);
});

test("#5: map and list share one filter result (search 'Halladay' → 1)", () => {
  const f = { ...DEFAULT_FILTERS, search: "Halladay" };
  assert.equal(visibleListings(DATA, f, TODAY).length, 1);
  assert.equal(DATA.filter((a) => matchesFilters(a, { ...DEFAULT_FILTERS, search: "zzzzqqq" }, TODAY)).length, 0);
});

test("#5 F10: filters and the open listing round-trip through the URL", () => {
  const f = { search: "pine", quick: ["under3500", "1b"], availability: "2026-11", sort: "name" };
  const q = filtersToQuery(f, "apt-1");
  const back = filtersFromQuery(q);
  assert.deepEqual(back.filters, f);
  assert.equal(back.apt, "apt-1");
  assert.equal(filtersToQuery(DEFAULT_FILTERS, null), "");
  // junk in the URL falls back to defaults instead of breaking the page
  assert.deepEqual(filtersFromQuery("?chip=evil&sort=drop&avail=x").filters, DEFAULT_FILTERS);
});

test("re-run F8: a bare lease term number reads as months", () => {
  assert.equal(leaseLabel(12), "12 months");
  assert.equal(leaseLabel("12"), "12 months");
  assert.equal(leaseLabel("12 Months"), "12 months");
  assert.equal(leaseLabel(1), "1 month");
  assert.equal(leaseLabel(""), null);
  assert.ok(DATA.every((a) => a.leaseTerm === undefined || !/^\d+$/.test(leaseLabel(a.leaseTerm))));
});

test("re-run F4: implausible or reused square footage is not trusted", () => {
  const bad = untrustedSqftIds(DATA);
  const studio1200 = DATA.find((a) => a.name === "162 East 36th Street #5H");
  assert.ok(studio1200 && studio1200.sqft === 1200 && bad.has(studio1200.id));
  const pacific = DATA.filter((a) => a.address.startsWith("328 Pacific Avenue"));
  assert.ok(pacific.length === 4 && pacific.every((a) => bad.has(a.id))); // 1B and 2B both "700"
  const ok = DATA.find((a) => a.name === "Otto Greenpoint - Unit 5C");
  assert.ok(!ok || !bad.has(ok.id));
  assert.ok(bad.size < DATA.length / 3); // a filter, not a wipe
});

test("prices are formatted with thousands separators", () => {
  assert.equal(formatMoney(3250), "$3,250");
  assert.equal(formatMoney(3483.4), "$3,483");
});

test("re-run F2/F5: units of one building share a location, and pins sit on the right side of the river", () => {
  const isNJ = (a) => /\b(NJ|Jersey City|Hoboken|Weehawken)\b/.test(a.address);
  const km = ([a, b], [c, d]) => Math.hypot((a - c) * 111, (b - d) * 111 * Math.cos((a * Math.PI) / 180));
  // A New York address pinned deep in New Jersey (or the reverse) must be flagged unverified.
  const wrongSide = DATA.filter((a) => !a.locationUnverified && (isNJ(a) ? a.coordinates[1] > -73.99 : a.coordinates[1] < -74.035));
  assert.deepEqual(wrongSide.map((a) => a.name), []);
  const pacific = DATA.filter((a) => a.address.startsWith("328 Pacific Avenue"));
  const spread = Math.max(...pacific.flatMap((x) => pacific.map((y) => km(x.coordinates, y.coordinates))));
  assert.ok(spread < 0.05, `328 Pacific units ${spread.toFixed(2)} km apart`);
  assert.deepEqual(DATA.filter((a) => a.locationUnverified).map((a) => a.name), ["1065 Second Avenue #6L"]);
});

test("run 3 F9: chips combine; bed chips replace each other; 'All' clears", () => {
  let q = toggleQuick([], "under3500");
  q = toggleQuick(q, "1b");
  assert.deepEqual(q, ["under3500", "1b"]);
  assert.deepEqual(toggleQuick(q, "2b"), ["under3500", "2b"]);
  assert.deepEqual(toggleQuick(q, "1b"), ["under3500"]);
  assert.deepEqual(toggleQuick(q, "all"), []);
  const both = visibleListings(DATA, { ...DEFAULT_FILTERS, quick: q }, TODAY);
  assert.ok(both.length > 0 && both.every((a) => bedrooms(a.floorPlan) === 1 && a.netEffectiveRent < 3500));
  assert.ok(both.some((a) => a.name === "19 Dutch"));
});

test("run 3 F6: a photo used by more than one building is not trusted", () => {
  const bad = untrustedImageUrls(DATA);
  const e36 = DATA.find((a) => a.name === "162 East 36th Street #5H");
  const degraw = DATA.find((a) => a.name === "500 Degraw Street #403");
  const shared = e36.images.filter((u) => degraw.images.includes(u));
  assert.ok(shared.length > 0 && shared.every((u) => bad.has(u)));
  // units of ONE building may share photos
  const ok = untrustedImageUrls([
    { ...e36, id: "a", address: "1 X St #1, New York, NY", images: ["p"] },
    { ...e36, id: "b", address: "1 X St #2, New York, NY", images: ["p"] },
  ]);
  assert.equal(ok.size, 0);
});

test("run 3 F1/F3: the form rejects bad numbers and accepts a 4.7 rating", () => {
  assert.ok(validateListingInput({ rentBase: -500, rentMonthsFree: 0, ranking: 5 }).rentBase);
  assert.ok(validateListingInput({ rentBase: 3000, rentMonthsFree: 20, ranking: 5, leaseTerm: "12 months" }).rentMonthsFree);
  assert.ok(validateListingInput({ rentBase: 3000, rentMonthsFree: 1, ranking: 6 }).ranking);
  assert.deepEqual(validateListingInput({ rentBase: 2000, rentMonthsFree: 1, ranking: 4.7, leaseTerm: 12 }), {});
});

test("run 3 F5: city labels name the real borough where two sources agree", () => {
  const label = (n) => DATA.find((a) => a.name === n).address;
  assert.match(label("500 Degraw Street #403"), /, Brooklyn, NY$/);   // tour link: society-brooklyn-at-degraw
  assert.match(label("60 Wharf Dr #3304"), /, Brooklyn, NY$/);        // West Wharf, Greenpoint 11222
  assert.match(label("97-12 65th Road #4C"), /, Queens, NY$/);
  // Astor on Third is in Astoria (11102): label AND pin must be in Queens, not Brooklyn's 3rd Street
  const astor = DATA.find((a) => a.name === "26-41 3rd Street #370");
  assert.match(astor.address, /, Queens, NY$/);
  assert.ok(astor.coordinates[0] > 40.74 && astor.coordinates[1] > -73.96, `pin ${astor.coordinates}`);
});
