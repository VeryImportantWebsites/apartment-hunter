---
name: apartment-data-gatherer
description: Standard operating procedure and tools for dispatching agents to fetch apartment listings, real images, and floor plans.
---

# Apartment Data Gatherer

This skill standardizes the process for finding, scraping, and safely merging luxury apartment listings into the `apartment-hunter` application.

## Strict Rules

1. **NO MOCK DATA**: Never use mock data, placeholder images, or fake floor plans. If a real image or floor plan is not available, leave the field undefined or empty. The UI will handle it gracefully.
2. **MAINTAIN IDs**: When updating existing apartments, never overwrite or regenerate their `id` values.
3. **ONLY LUXURY**: Focus entirely on luxury buildings with no-fee options in the NYC and Jersey City areas.

## Apartment Schema

The extracted data MUST conform to this structure:
```typescript
interface Apartment {
  id: string; // Auto-generated during merge, do not provide manually unless updating
  name: string; // Include unit number if applicable (e.g. "The Beach - Unit 1405")
  source: string; // The site the data was found on
  address: string;
  coordinates: [number, number]; // [lat, lng]
  floorPlan: "Studio" | "1B" | "2B" | "3B";
  images?: string[]; // Array of real interior/exterior photo URLs
  floorPlanImageUrl?: string; // Real floor plan image URL
  rentBase: number;
  rentMonthsFree: number;
  netEffectiveRent: number;
  sqft?: number;
  petPolicy: string;
  feeStatus: string;
  availability: string;
  contactPhone?: string;
  appointmentLink?: string;
  transitDetails?: string;
  leaseTerm?: string;
  unitAmenities: string[];
  buildingAmenities: string[];
  perksAndAmenities?: string[]; // Used interchangeably with the above
  ranking: number; // 1-5
  notes?: string;
  lastUpdated: string; // ISO timestamp
}
```

## Workflow: Updating Existing Apartments (Images & Floor Plans)

When instructed to find floor plans/images for existing apartments:
1. Divide the target apartments into batches of ~25.
2. Use `invoke_subagent` to spawn concurrent `research` agents.
3. Provide the agents with the following prompt template:
   > Search the web (official building websites, Zillow, StreetEasy) to find the **actual, real** floor plan image URL and interior property image URLs for the following specific apartments.
   > [LIST OF APARTMENTS: Name, Address]
   > Return a JSON object mapping the exact apartment name to an object containing `floorPlanImageUrl` and `images` (array of strings). Do NOT use any placeholders. If you cannot find a real image, omit the field. Return ONLY the JSON object.
4. Once all agents finish, save their JSON responses to the `scratch/` directory.
5. Execute `node .gemini/skills/apartment-data-gatherer/scripts/merge_apartments.js <path-to-json-1> <path-to-json-2> ...` to merge the data safely.

## Workflow: Scraping New Apartments

When instructed to find entirely new apartments:
1. Spawn subagents focused on specific aggregators (e.g., Zillow, StreetEasy) or direct properties (e.g., KRE Group, Avalon).
2. Prompt them to extract all fields in the schema above.
3. Use the merge script to append the new apartments to the dataset.
