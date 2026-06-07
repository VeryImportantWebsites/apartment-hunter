const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const APARTMENTS_FILE = path.join(__dirname, '../../../../src/data/apartments.json');

// Get all files passed as arguments
const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: node merge_apartments.js <file1.json> <file2.json> ...");
  process.exit(1);
}

let db = [];
try {
  if (fs.existsSync(APARTMENTS_FILE)) {
    db = JSON.parse(fs.readFileSync(APARTMENTS_FILE, 'utf8'));
  }
} catch (e) {
  console.error("Failed to read apartments DB:", e);
  process.exit(1);
}

let newCount = 0;
let updatedCount = 0;

for (const file of files) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Handle Array format (Scraping new apartments)
  if (Array.isArray(data)) {
    for (const apt of data) {
      // Basic deduplication by name
      const existing = db.find(a => a.name === apt.name);
      if (existing) {
        Object.assign(existing, apt);
        existing.lastUpdated = new Date().toISOString();
        updatedCount++;
      } else {
        apt.id = uuidv4();
        if (!apt.lastUpdated) apt.lastUpdated = new Date().toISOString();
        db.push(apt);
        newCount++;
      }
    }
  } 
  // Handle Object format (Updating existing apartments map by name)
  else if (typeof data === 'object') {
    for (const [name, updates] of Object.entries(data)) {
      const existing = db.find(a => a.name === name);
      if (existing) {
        if (updates.floorPlanImageUrl) existing.floorPlanImageUrl = updates.floorPlanImageUrl;
        if (updates.images && Array.isArray(updates.images)) existing.images = updates.images;
        existing.lastUpdated = new Date().toISOString();
        updatedCount++;
      }
    }
  }
}

fs.writeFileSync(APARTMENTS_FILE, JSON.stringify(db, null, 2));
console.log(`Merge complete. Inserted ${newCount} new apartments, updated ${updatedCount} existing apartments.`);
