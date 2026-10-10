// Find listings whose map pin contradicts their address, and re-geocode them with real data.
//
//   node scripts/fix_coordinates.mjs            # dry run: report only
//   node scripts/fix_coordinates.mjs --apply    # write src/data/apartments.json
//   node scripts/fix_coordinates.mjs --nyc-check [--apply]
//        check EVERY New York City listing against NYC Planning's GeoSearch (the city's own
//        address database, keyless). A pin within 100 m of a match is OK. Otherwise, if the
//        listing's own borough hints (link text, city) and GeoSearch agree on one borough, move
//        the pin to GeoSearch's point and name the borough. Anything else is held for review.
//        Added after the 2026-10-10 audit: 13 pins were 2-20 km off, and Nominatim had matched
//        same-named streets in the wrong borough (737 Park Avenue -> Brooklyn).
//   node scripts/fix_coordinates.mjs --boroughs [--apply]
//        relabel generic "New York, NY" addresses with their real borough ("Brooklyn, NY"),
//        only when the street geocodes inside that borough AND within 1.5 km of the stored pin
//        (two sources agree). Found by the 2026-10-10 blind QA run 3 (F5).
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
// "26-41 3rd Street" style numbers are a Queens convention. Nominatim matched one to Brooklyn's
// 3rd Street (the pin it produced then "agreed" with itself in --boroughs). Such a result is held
// for review, never applied. Manhattan has hyphenated *ranges* ("25-27 Mercer"), so this only
// blocks; it never forces Queens.
const MANHATTAN_RANGE_STREETS = /^\d+-\d+\s+(Mercer|Broadway|Greene|Wooster|Crosby)\b/i; // ranges, not Queens numbers
const queensStyle = (addr) => /^\d{1,3}-\d{1,3}\s/.test(addr.trim()) && !MANHATTAN_RANGE_STREETS.test(addr.trim());
const ALREADY_OK_KM = 0.05; // within 50 m of the geocode: the pin is right, nothing to do

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function geocode(q) {
  // viewbox = left,top,right,bottom around the NYC metro; bounded=1 keeps results inside it
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&addressdetails=1&viewbox=-74.30,40.95,-73.70,40.48&bounded=1&q=${encodeURIComponent(q)}`;
  // 15 s timeout: a stalled connection once hung the whole run for 37 minutes.
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en" }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const [hit] = await res.json();
  return hit || null;
}

if (process.argv.includes("--nyc-check")) {
  const BORO_CITY = { Manhattan: "New York", Brooklyn: "Brooklyn", Queens: "Queens", Bronx: "Bronx", "Staten Island": "Staten Island" };
  const hints = (a) => {
    const t = `${a.address} ${a.appointmentLink || ""} ${a.link || ""}`.toLowerCase();
    const h = new Set();
    if (/brooklyn|greenpoint|williamsburg|bushwick|dumbo|park[-_ ]slope|sunset/.test(t)) h.add("Brooklyn");
    if (/queens|long[-_ ]island[-_ ]city|\blic\b|astoria|rego[-_ ]park|forest[-_ ]hills/.test(t)) h.add("Queens");
    if (/bronx/.test(t)) h.add("Bronx");
    // A generic "New York, NY" is what is being checked, so it is not evidence; only links count.
    const links = `${a.appointmentLink || ""} ${a.link || ""}`.toLowerCase();
    if (/manhattan|new[-_]york\b|nyc/.test(links) && !h.size) h.add("Manhattan");
    return h;
  };
  // "11 Beach St" and "288 W 14th St" found nothing or the wrong borough until spelled out.
  const expand = (q) => q
    .replace(/\bW\b\.?/g, "West").replace(/\bE\b\.?/g, "East").replace(/\bN\b\.?/g, "North").replace(/\bS\b\.?(?=\s+\d)/g, "South")
    .replace(/\bSt\b\.?/gi, "Street").replace(/\bAve\b\.?/gi, "Avenue").replace(/\bBlvd\b\.?/gi, "Boulevard").replace(/\bPl\b\.?/gi, "Place").replace(/\bDr\b\.?/gi, "Drive").replace(/\bRd\b\.?/gi, "Road");
  // Compare street names, not just house numbers: "260 Kent Ave" matched 260 Kent *Street* in
  // Greenpoint and would have moved a correct pin 2.2 km.
  const ORD = { FIRST: 1, SECOND: 2, THIRD: 3, FOURTH: 4, FIFTH: 5, SIXTH: 6, SEVENTH: 7, EIGHTH: 8, NINTH: 9, TENTH: 10, ELEVENTH: 11, TWELFTH: 12 };
  const normStreet = (x) => expand(String(x || "")).toUpperCase()
    .replace(/\b(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|ELEVENTH|TWELFTH)\b/g, (w) => String(ORD[w]))
    .replace(/\b(\d+)(ST|ND|RD|TH)\b/g, "$1").replace(/[^A-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const ourStreet = (st) => normStreet(st.replace(/^[\d-]+[A-Z]?\s+/i, ""));
  const gs = async (q) => {
    await sleep(350);
    const r = await fetch(`https://geosearch.planninglabs.nyc/v2/search?size=6&text=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return ((await r.json()).features || []).filter((f) => f.properties?.housenumber);
  };
  const nycListings = data.filter((a) => !isNJ(a.address));
  const byBuilding = new Map();
  for (const a of nycListings) {
    const k = building(a.address);
    if (!byBuilding.has(k)) byBuilding.set(k, []);
    byBuilding.get(k).push(a);
  }
  let ok = 0, moved = 0, held = 0;
  for (const [street, units] of byBuilding) {
    let feats;
    try { feats = await gs(expand(street)); } catch (e) { console.log(`HOLD  ${street}: ${e.message}`); held++; continue; }
    const hn = street.match(/^[\d-]+[A-Z]?/i)?.[0]?.toUpperCase();
    const want = ourStreet(street);
    const exact = feats.filter((f) => String(f.properties.housenumber).toUpperCase() === hn && normStreet(f.properties.street) === want);
    const pts = exact.map((f) => ({ boro: f.properties.borough, zip: f.properties.postalcode, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] }));
    // Within 300 m of ANY match is the same building: a building's middle vs the city's address
    // point (97 of the first run's 123 "moves" were this). Any match, so ranges ("25-27 Mercer")
    // and pairs ("173 and 176 Perry") count too.
    const anyPts = feats.map((f) => [f.geometry.coordinates[1], f.geometry.coordinates[0]]);
    if (units.every((a) => anyPts.some((q) => km(a.coordinates, q) < 0.3))) { ok++; continue; }
    const h = hints(units[0]);
    const boros = [...new Set(pts.map((p) => p.boro))];
    let pick = boros.filter((b) => h.has(b));
    // No link hint and GeoSearch found one borough: accept only if Nominatim, a separate
    // database, independently puts the street in the same borough ("W 14th" alone matched
    // Coney Island in GeoSearch; this check stops a Manhattan building moving to Brooklyn).
    if (pick.length === 0 && h.size === 0 && boros.length === 1) {
      const COUNTY = { Manhattan: "New York County", Brooklyn: "Kings County", Queens: "Queens County", Bronx: "Bronx County", "Staten Island": "Richmond County" };
      let second = null;
      try { await sleep(1100); second = await geocode(`${expand(street)}, New York City, NY`); } catch {}
      const c = second?.address?.county || second?.address?.city_district || "";
      if (c === COUNTY[boros[0]]) pick = boros;
      else { console.log(`HOLD  ${street}: GeoSearch says ${boros[0]}, Nominatim says ${c || "nothing"}`); held++; continue; }
    }
    if (pick.length !== 1) { console.log(`HOLD  ${street}: GeoSearch boroughs [${boros}] vs hints [${[...h]}]`); held++; continue; }
    const p = pts.find((x) => x.boro === pick[0]);
    for (const a of units) {
      const city = BORO_CITY[p.boro];
      const nextAddr = a.address.replace(/,\s*(New York|Brooklyn|Queens|Bronx|Staten Island),\s*NY\b/i, `, ${city}, NY`);
      console.log(`${APPLY ? "FIX  " : "WOULD"} ${a.name}: ${km(a.coordinates, [p.lat, p.lng]).toFixed(2)} km -> ${p.boro} ${p.zip}${nextAddr !== a.address ? ` | "${nextAddr}"` : ""}`);
      if (APPLY) {
        a.coordinates = [Number(p.lat.toFixed(6)), Number(p.lng.toFixed(6))];
        a.address = nextAddr;
        delete a.locationUnverified;
      }
      moved++;
    }
  }
  console.log(`${byBuilding.size} NYC buildings: ${ok} pins confirmed, ${moved} listings ${APPLY ? "fixed" : "would be fixed"}, ${held} buildings held for review`);
  if (APPLY) writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
  process.exit(0);
}

if (process.argv.includes("--boroughs")) {
  const BORO = { "Kings County": "Brooklyn", "Queens County": "Queens", "Bronx County": "Bronx", "Richmond County": "Staten Island" };
  const generic = new Map(); // street -> listings
  for (const a of data) {
    if (!/,\s*New York,\s*NY\b/i.test(a.address) || a.locationUnverified) continue;
    const street = building(a.address);
    if (!generic.has(street)) generic.set(street, []);
    generic.get(street).push(a);
  }
  let relabeled = 0, manhattan = 0, unsure = 0;
  console.log(`${generic.size} buildings with a generic "New York, NY" address`);
  for (const [street, units] of generic) {
    await sleep(1100);
    let hit;
    try { hit = await geocode(`${street}, New York City, NY`); } catch (e) { console.log(`SKIP  ${street}: ${e.message}`); unsure++; continue; }
    const county = hit?.address?.county || hit?.address?.city_district || ""; // NYC: county is in city_district
    if (!hit || !NYC.includes(county)) { console.log(`SKIP  ${street}: ${hit ? county || "?" : "no result"}`); unsure++; continue; }
    const far = units.some((a) => km(a.coordinates, [Number(hit.lat), Number(hit.lon)]) > 1.5);
    if (far) { console.log(`SKIP  ${street}: geocode in ${county} disagrees with the stored pin`); unsure++; continue; }
    if (queensStyle(units[0].address) && county !== "Queens County") { console.log(`HOLD  ${street}: Queens-style number but result in ${county}; review by hand`); unsure++; continue; }
    if (!BORO[county]) { manhattan++; continue; }
    for (const a of units) {
      const next = a.address.replace(/,\s*New York,\s*NY\b/i, `, ${BORO[county]}, NY`);
      console.log(`${APPLY ? "LABEL" : "WOULD"} ${a.address} -> ${next}`);
      if (APPLY) a.address = next;
      relabeled++;
    }
  }
  console.log(`${APPLY ? "relabeled" : "would relabel"} ${relabeled} listings; ${manhattan} buildings confirmed Manhattan; ${unsure} buildings left unchanged (no agreement)`);
  if (APPLY) writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
  process.exit(0);
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
  if (queensStyle(anyAddr) && county !== "Queens County") {
    console.log(`HOLD  ${s.query}: Queens-style number but result in ${county || "?"}; review by hand`); skipped++; markUnverified(s); continue;
  }
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
