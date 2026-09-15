const fs = require('fs');
const path = require('path');

const APARTMENTS_FILE = path.join(__dirname, '../src/data/apartments.json');

function normalizeCoordinates(coords) {
  if (Array.isArray(coords)) {
    return [parseFloat(coords[0]), parseFloat(coords[1])];
  } else if (coords && typeof coords === 'object') {
    return [parseFloat(coords.lat), parseFloat(coords.lng)];
  }
  return [40.7303, -74.0321]; // default fallback
}

function normalizeAvailability(val) {
  if (!val) return "Available Now";
  const str = val.trim();
  
  if (str === "Immediate" || str === "Available Now" || str === "Immediate move-in") {
    return "Available Now";
  }
  if (str.includes("September 15") || str === "Available September 15, 2026") {
    return "Available September 15, 2026";
  }
  if (str.includes("October 1") || str === "Available October 1, 2026" || str === "Oct 1") {
    return "Available October 1, 2026";
  }
  if (str.includes("October 15") || str === "Available October 15, 2026" || str === "Oct 15") {
    return "Available October 15, 2026";
  }
  if (str.includes("November 1") || str === "Available November 1, 2026" || str === "Nov 1") {
    return "Available November 1, 2026";
  }
  if (str.includes("November 15") || str === "Available November 15, 2026" || str === "Nov 15") {
    return "Available November 15, 2026";
  }
  if (str.includes("December 1") || str === "Available December 1, 2026" || str === "Dec 1") {
    return "Available December 1, 2026";
  }
  if (str === "July 1st" || str === "Available July 1st" || str === "July 1, 2026" || str === "July 7, 2026" || str === "August 1st" || str === "August 1, 2026") {
    return "Available Now"; // Past dates rolled over to Available Now
  }
  if (str === "Available within 30 days" || str === "Available in 30 days" || str === "Available Soon") {
    return "Available within 30 days";
  }
  if (str === "Available within 60 days" || str === "Available in 60 days") {
    return "Available within 60 days";
  }
  if (str === "Available in 15 days") {
    return "Available in 15 days";
  }
  if (str === "Available in 45 days") {
    return "Available in 45 days";
  }
  if (str === "Waitlist") {
    return "Waitlist";
  }
  return str;
}

function mergeApartments() {
  if (!fs.existsSync(APARTMENTS_FILE)) {
    console.error("Apartments file not found!");
    return;
  }

  const db = JSON.parse(fs.readFileSync(APARTMENTS_FILE, 'utf8'));
  console.log(`Original database size: ${db.length}`);

  const mergedMap = new Map();

  for (const apt of db) {
    const key = `${apt.name.trim().toLowerCase()}|||${apt.address.trim().toLowerCase()}`;
    
    // Normalize properties
    apt.coordinates = normalizeCoordinates(apt.coordinates);
    apt.availability = normalizeAvailability(apt.availability);
    
    // Map unitAmenities to perksAndAmenities
    const perks = [
      ...(apt.perksAndAmenities || []),
      ...(apt.unitAmenities || [])
    ];
    // Deduplicate perks
    apt.perksAndAmenities = Array.from(new Set(perks));
    delete apt.unitAmenities; // Remove non-standard field

    if (mergedMap.has(key)) {
      const existing = mergedMap.get(key);
      console.log(`Merging duplicate: "${apt.name}"`);

      // Merge images
      const images = Array.from(new Set([
        ...(existing.images || []),
        ...(apt.images || [])
      ]));
      existing.images = images.filter(Boolean);

      // Merge floor plan image
      if (!existing.floorPlanImageUrl && apt.floorPlanImageUrl) {
        existing.floorPlanImageUrl = apt.floorPlanImageUrl;
      }

      // Merge building amenities
      const bldgAmenities = Array.from(new Set([
        ...(existing.buildingAmenities || []),
        ...(apt.buildingAmenities || [])
      ]));
      existing.buildingAmenities = bldgAmenities.filter(Boolean);

      // Merge perks
      const perksMerged = Array.from(new Set([
        ...(existing.perksAndAmenities || []),
        ...(apt.perksAndAmenities || [])
      ]));
      existing.perksAndAmenities = perksMerged.filter(Boolean);

      // Prefer non-UUID IDs if one is shorter (e.g. "1" instead of a UUID)
      if (existing.id.length > apt.id.length) {
        existing.id = apt.id;
      }

      // Merge basic fields if missing in existing
      if (!existing.sqft && apt.sqft) existing.sqft = apt.sqft;
      if (!existing.transitDetails && apt.transitDetails) existing.transitDetails = apt.transitDetails;
      if (!existing.leaseTerm && apt.leaseTerm) existing.leaseTerm = apt.leaseTerm;
      if (!existing.source && apt.source) existing.source = apt.source;
      if (!existing.petPolicy && apt.petPolicy) existing.petPolicy = apt.petPolicy;
      if (!existing.feeStatus && apt.feeStatus) existing.feeStatus = apt.feeStatus;
      if (!existing.contactPhone && apt.contactPhone) existing.contactPhone = apt.contactPhone;
      if (!existing.appointmentLink && apt.appointmentLink) existing.appointmentLink = apt.appointmentLink;
      
      existing.lastUpdated = new Date().toISOString();
    } else {
      mergedMap.set(key, apt);
    }
  }

  const cleanedDb = Array.from(mergedMap.values());
  fs.writeFileSync(APARTMENTS_FILE, JSON.stringify(cleanedDb, null, 2));
  console.log(`Cleaned database size: ${cleanedDb.length} (Merged ${db.length - cleanedDb.length} duplicates).`);
}

mergeApartments();
