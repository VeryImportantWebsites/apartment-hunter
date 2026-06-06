import { create } from 'zustand';
import defaultData from "@/data/apartments.json";

export type FloorPlan = string;

export interface Apartment {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  floorPlan: FloorPlan;
  images?: string[];
  floorPlanImageUrl?: string;
  rentBase: number;
  rentMonthsFree: number;
  netEffectiveRent: number;
  perksAndAmenities: string[];
  ranking: number; // 1 to 5
  notes: string;
  link?: string;
  sqft?: number;
  petPolicy?: string;
  feeStatus?: string;
  availability?: string;
  contactPhone?: string;
  contactEmail?: string;
  appointmentLink?: string;
  transitDetails?: string;
  leaseTerm?: string;
  source?: string;
  buildingAmenities?: string[];
  lastUpdated?: string;
}

interface ApartmentStore {
  apartments: Apartment[];
  addApartment: (apt: Omit<Apartment, 'id' | 'netEffectiveRent'>) => void;
  updateApartment: (id: string, apt: Partial<Omit<Apartment, 'id' | 'netEffectiveRent'>>) => void;
  removeApartment: (id: string) => void;
}

function calculateNetEffective(base: number, monthsFree: number, leaseTerm?: string): number {
  let termMonths = 12;
  if (leaseTerm) {
    const match = leaseTerm.match(/(\d+)/);
    if (match) {
      termMonths = parseInt(match[1], 10);
    }
  }
  if (termMonths <= 0) termMonths = 12;
  
  return Math.round((base * (termMonths - monthsFree)) / termMonths);
}

export const useApartmentStore = create<ApartmentStore>()((set) => ({
  apartments: defaultData as Apartment[],
  addApartment: (apt) => set((state) => {
    const id = crypto.randomUUID();
    const netEffectiveRent = calculateNetEffective(apt.rentBase, apt.rentMonthsFree, apt.leaseTerm);
    const lastUpdated = new Date().toISOString();
    return {
      apartments: [...state.apartments, { ...apt, id, netEffectiveRent, lastUpdated }],
    };
  }),
  updateApartment: (id, apt) => set((state) => {
    return {
      apartments: state.apartments.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...apt };
          updated.netEffectiveRent = calculateNetEffective(updated.rentBase, updated.rentMonthsFree, updated.leaseTerm);
          updated.lastUpdated = new Date().toISOString();
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
