---
name: update-apartment-database
description: >-
  Workflow for finding new apartments, adding them to the database, and fetching real images using Puppeteer.
---

# Update Apartment Database

## Overview
This skill provides the standard workflow for adding new apartments to the Apartment Hunter database and automatically fetching real photos and floor plans for them to adhere to the "No Mock Data" rule.

## Workflow

### 1. Find New Apartments
- Search the web or utilize real estate listings for actual apartments matching the desired criteria (location, price, amenities).
- Extract real details: Name, Address, Price Range, Beds/Baths, Amenities, Rating, etc.

### 2. Add to Database
- Edit `src/data/apartments.json`.
- Add the new apartments to the JSON array. Leave `images` empty (`[]`) and `floorPlanImageUrl` empty (`""`) if you don't have them yet.
- Ensure the schema strictly matches existing entries.

### 3. Fetch Real Images
- Run the provided script to automatically fetch real images and floor plans for any apartment missing them.
- Command: `node scripts/fetch_real_images.js`
- The script uses Puppeteer to search for and scrape images from the web based on the apartment name and address. It will update `apartments.json` directly.

### 4. Verify
- Ensure the script updated the `images` and `floorPlanImageUrl` fields in `src/data/apartments.json`.
- Check the UI to ensure the new apartments render correctly.
