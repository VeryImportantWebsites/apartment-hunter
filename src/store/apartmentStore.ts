import { create } from 'zustand';
import defaultData from "@/data/apartments.json";

export type FloorPlan = string;

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

export const useApartmentStore = create<ApartmentStore>()((set) => ({
  apartments: defaultData as Apartment[],
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
}));
