// Find listings whose map pin contradicts their address, and re-geocode them with real data.
//
//   node scripts/fix_coordinates.mjs            # dry run: report only
//   node scripts/fix_coordinates.mjs --apply    # write src/data/apartments.json
//
// A listing is suspect when its pin is on the wrong side of the Hudson for its city (a New York
// address with a New Jersey pin, or the reverse), or when units of one building are pinned more
// than 300 m apart. Each suspect building is geocoded once with OpenStreetMap Nominatim, at most
// one request per second as its usage policy requires, inside a box around the NYC metro. A
// result is used only if its county fits the address (Brooklyn -> Kings, a NJ address -> Hudson /
// Bergen / Essex, "New York, NY" -> any of the five boroughs) and it moves the pin less than
// 20 km; otherwise the record is left unchanged and reported. The first dry run without these
// checks matched a same-named street 235 km away, which is why they exist.
// Found by the 2026-10-10 blind QA re-run (findings F2, F5).
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../src/data/apartments.json", import.meta.url);
const APPLY = process.argv.includes("--apply");
const UA = "apartment-hunter-data-fix/1.0 (github.com/VeryImportantWebsites/apartment-hunter)";
const HUDSON_LNG = -74.02; // west of this is New Jersey for the listings in this dataset

const data = JSON.parse(readFileSync(FILE, "utf8"));
const building = (addr) =>
  addr.split(",")[0].replace(/\s*(#|unit\b|apt\.?)\s*[\w-]+/gi, "").trim();
const cityPart = (addr) => addr.split(",").slice(1).join(",").trim();
const isNJ = (addr) => /\b(NJ|Jersey City|Hoboken|Weehawken|Newark)\b/i.test(addr);
const km = ([a, b], [c, d]) => Math.hypot((a - c) * 111, (b - d) * 111 * Math.cos((a * Math.PI) / 180));

const suspects = new Map(); // building query -> { query, nj, ids: [] }
const flag = (a, why) => {
  const q = `${building(a.address)}, ${cityPart(a.address)}`;
  if (!suspects.has(q)) suspects.set(q, { query: q, nj: isNJ(a.address), ids: new Set(), why: new Set() });
  suspects.get(q).ids.add(a.id);
  suspects.get(q).why.add(why);
};

for (const a of data) {
  const pinNJ = a.coordinates[1] < HUDSON_LNG;
  if (pinNJ !== isNJ(a.address)) flag(a, "pin on wrong side of the Hudson");
}
const groups = new Map();
for (const a of data) {
  const k = `${building(a.address).toLowerCase()}|${cityPart(a.address).toLowerCase()}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(a);
}
for (const units of groups.values()) {
  if (units.length < 2) continue;
  const spread = Math.max(...units.flatMap((x) => units.map((y) => km(x.coordinates, y.coordinates))));
  if (spread > 0.3) units.forEach((a) => flag(a, `building units ${spread.toFixed(1)} km apart`));
}

const NYC = ["New York County", "Kings County", "Queens County", "Bronx County", "Richmond County"];
function expectedCounties(addr) {
  if (isNJ(addr)) return ["Hudson County", "Bergen County", "Essex County"];
  if (/\bBrooklyn\b/i.test(addr)) return ["Kings County"];
  if (/\b(Queens|Long Island City|Astoria|Flushing|Forest Hills|Rego Park|Jackson Heights)\b/i.test(addr)) return ["Queens County"];
  if (/\bBronx\b/i.test(addr)) return ["Bronx County"];
  return NYC; // "New York, NY" is used loosely for every borough in this data
}
// Backstop only: the county check and the metro box already reject same-named streets elsewhere.
// 405 West 206th Street (Inwood) was pinned in Jersey City, 16.9 km from its real spot.
const MAX_MOVE_KM = 20;
const ALREADY_OK_KM = 0.05; // within 50 m of the geocode: the pin is right, nothing to do

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function geocode(q) {
  // viewbox = left,top,right,bottom around the NYC metro; bounded=1 keeps results inside it
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&addressdetails=1&viewbox=-74.30,40.95,-73.70,40.48&bounded=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const [hit] = await res.json();
  return hit || null;
}

let fixed = 0, skipped = 0, alreadyOk = 0;
// A building that cannot be geocoded keeps its (known wrong) pin but is marked
// locationUnverified, so the app does not draw it on the map.
const markUnverified = (s) => { if (APPLY) for (const id of s.ids) byId.get(id).locationUnverified = true; };
const byId = new Map(data.map((a) => [a.id, a]));
console.log(`${suspects.size} suspect buildings, ${[...suspects.values()].reduce((n, s) => n + s.ids.size, 0)} listings`);
for (const s of suspects.values()) {
  await sleep(1100);
  let hit;
  try {
    hit = await geocode(s.query);
    // "New York, NY" is ambiguous; if it did not land in a borough, retry as Manhattan.
    const generic = /,\s*New York,\s*NY\b/i.test(s.query) && !/Brooklyn|Queens|Bronx/i.test(s.query);
    const inBorough = (h) => h && NYC.includes(h.address?.county || "");
    if (generic && !inBorough(hit)) {
      await sleep(1100);
      const ORD = { First: "1st", Second: "2nd", Third: "3rd", Fourth: "4th", Fifth: "5th", Sixth: "6th", Seventh: "7th", Eighth: "8th", Ninth: "9th", Tenth: "10th" };
      const manhattan = s.query
        .replace(/\b(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth)\b/g, (w) => ORD[w])
        .replace(/,\s*New York,\s*NY/i, ", Manhattan, New York, NY");
      const retry = await geocode(manhattan);
      if (inBorough(retry)) hit = retry; // keep the first answer unless the retry is better
    }
  } catch (e) { console.log(`SKIP  ${s.query}: ${e.message}`); skipped++; markUnverified(s); continue; }
  if (!hit) { console.log(`SKIP  ${s.query}: no result`); skipped++; markUnverified(s); continue; }
  const lat = Number(hit.lat), lng = Number(hit.lon);
  const county = hit.address?.county || hit.address?.city_district || "";
  const anyAddr = byId.get([...s.ids][0]).address;
  if (!expectedCounties(anyAddr).includes(county)) {
    console.log(`SKIP  ${s.query}: result in ${county || "?"} (${hit.display_name})`); skipped++; markUnverified(s); continue;
  }
  const far = [...s.ids].map((id) => km(byId.get(id).coordinates, [lat, lng])).filter((d) => d > MAX_MOVE_KM);
  if (far.length) { console.log(`SKIP  ${s.query}: would move ${far[0].toFixed(1)} km (> ${MAX_MOVE_KM})`); skipped++; markUnverified(s); continue; }
  if ([...s.ids].every((id) => km(byId.get(id).coordinates, [lat, lng]) < ALREADY_OK_KM)) {
    console.log(`OK    ${s.query}: pin already matches the geocode`); alreadyOk++; continue;
  }
  for (const id of s.ids) {
    const a = byId.get(id);
    const moved = km(a.coordinates, [lat, lng]);
    if (APPLY) delete a.locationUnverified;
    console.log(`${APPLY ? "FIX " : "WOULD"} ${a.name}: moved ${moved.toFixed(2)} km [${[...s.why].join("; ")}]`);
    if (APPLY) a.coordinates = [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
    fixed++;
  }
}
console.log(`${APPLY ? "fixed" : "would fix"} ${fixed} listings, ${alreadyOk} buildings already correct, skipped ${skipped} buildings${APPLY && skipped ? " (marked locationUnverified)" : ""}`);
if (APPLY) writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
