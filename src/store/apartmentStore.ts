import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FloorPlan = 'Studio' | '1B' | '2B' | '3B';

export interface Apartment {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  floorPlan: FloorPlan;
  rentBase: number;
  rentMonthsFree: number;
  netEffectiveRent: number;
  perksAndAmenities: string[];
  ranking: number; // 1 to 5
  notes: string;
  link?: string;
}

interface ApartmentStore {
  apartments: Apartment[];
  addApartment: (apt: Omit<Apartment, 'id' | 'netEffectiveRent'>) => void;
  updateApartment: (id: string, apt: Partial<Omit<Apartment, 'id' | 'netEffectiveRent'>>) => void;
  removeApartment: (id: string) => void;
}

function calculateNetEffective(base: number, monthsFree: number): number {
  return Math.round((base * (12 - monthsFree)) / 12);
}

export const useApartmentStore = create<ApartmentStore>()(
  persist(
    (set) => ({
      apartments: [
        {
          id: "mock-1",
          name: "Jackson Park",
          address: "28-10 Jackson Ave, LIC",
          coordinates: [40.7486, -73.9385],
          floorPlan: "1B",
          rentBase: 4200,
          rentMonthsFree: 1.5,
          netEffectiveRent: 3675,
          perksAndAmenities: ["Gym", "Pool", "In-unit W/D"],
          ranking: 5,
          notes: "Amazing amenities but pricey.",
        },
        {
          id: "mock-2",
          name: "Sven",
          address: "29-59 Northern Blvd, LIC",
          coordinates: [40.7505, -73.9366],
          floorPlan: "2B",
          rentBase: 5800,
          rentMonthsFree: 0,
          netEffectiveRent: 5800,
          perksAndAmenities: ["LEED Certified", "Outdoor pool"],
          ranking: 4,
          notes: "Brand new, great location.",
        },
        {
          id: "mock-3",
          name: "The Hayden",
          address: "43-25 Hunter St, LIC",
          coordinates: [40.7490, -73.9427],
          floorPlan: "Studio",
          rentBase: 3100,
          rentMonthsFree: 1,
          netEffectiveRent: 2842,
          perksAndAmenities: ["Basketball court", "Dog run"],
          ranking: 4,
          notes: "Good value for money.",
        },
        {
          id: "mock-4",
          name: "Lumen LIC",
          address: "42-02 Crescent St, LIC",
          coordinates: [40.7503, -73.9416],
          floorPlan: "1B",
          rentBase: 4100,
          rentMonthsFree: 1,
          netEffectiveRent: 3758,
          perksAndAmenities: ["Pool", "Fitness Center", "Coworking Space"],
          ranking: 5,
          notes: "Panoramic Manhattan skyline views.",
        },
        {
          id: "mock-5",
          name: "4545 Center Blvd",
          address: "45-45 Center Blvd, LIC",
          coordinates: [40.7471, -73.9576],
          floorPlan: "2B",
          rentBase: 6500,
          rentMonthsFree: 2,
          netEffectiveRent: 5416,
          perksAndAmenities: ["Waterfront", "Tennis Courts", "Roof deck"],
          ranking: 5,
          notes: "Incredible views, directly on the water.",
        },
        {
          id: "mock-6",
          name: "Linc LIC",
          address: "43-10 Crescent St, LIC",
          coordinates: [40.7497, -73.9419],
          floorPlan: "1B",
          rentBase: 3850,
          rentMonthsFree: 0.5,
          netEffectiveRent: 3689,
          perksAndAmenities: ["Basketball Court", "Resident Lounges"],
          ranking: 4,
          notes: "Close to Court Square subway lines.",
        }
      ],
      addApartment: (apt) => set((state) => {
        const id = crypto.randomUUID();
        const netEffectiveRent = calculateNetEffective(apt.rentBase, apt.rentMonthsFree);
        return {
          apartments: [...state.apartments, { ...apt, id, netEffectiveRent }],
        };
      }),
      updateApartment: (id, apt) => set((state) => {
        return {
          apartments: state.apartments.map((a) => {
            if (a.id === id) {
              const updated = { ...a, ...apt };
              updated.netEffectiveRent = calculateNetEffective(updated.rentBase, updated.rentMonthsFree);
              return updated;
            }
            return a;
          }),
        };
      }),
      removeApartment: (id) => set((state) => ({
        apartments: state.apartments.filter((a) => a.id !== id),
      })),
    }),
    {
      name: 'apartment-storage',
    }
  )
);
