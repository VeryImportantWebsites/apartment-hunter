import { create } from 'zustand';
import defaultData from "@/data/apartments.json";
import {
  EMPTY_OVERLAY,
  OVERLAY_KEY,
  Overlay,
  applyOverlay,
  overlayCount,
  parseOverlay,
  recordAdd,
  recordEdit,
  recordRemove,
} from "@/lib/overlay";

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
  /** Set by scripts/fix_coordinates.mjs when the address could not be geocoded: the stored pin
   *  is known to be wrong, so the map does not draw it. */
  locationUnverified?: boolean;
}

interface ApartmentStore {
  apartments: Apartment[];
  /** The user's own changes, saved in this browser (see lib/overlay.ts). */
  overlay: Overlay;
  /** False when the browser refused storage (private mode, blocked site data). */
  canSave: boolean;
  /** Apply saved changes; called once after the page mounts (the static HTML has none). */
  loadMyChanges: () => void;
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

const BASE = defaultData as Apartment[];

function save(o: Overlay): boolean {
  try {
    if (overlayCount(o) === 0) localStorage.removeItem(OVERLAY_KEY);
    else localStorage.setItem(OVERLAY_KEY, JSON.stringify(o));
    return true;
  } catch {
    return false; // storage blocked or full: changes still work for this tab
  }
}

export const useApartmentStore = create<ApartmentStore>()((set, get) => {
  const commit = (overlay: Overlay) => {
    const canSave = save(overlay);
    set({ overlay, canSave, apartments: applyOverlay(BASE, overlay) });
  };
  return {
    apartments: BASE,
    overlay: EMPTY_OVERLAY,
    canSave: true,
    loadMyChanges: () => {
      let raw: string | null = null;
      let canSave = true;
      try { raw = localStorage.getItem(OVERLAY_KEY); } catch { canSave = false; }
      const overlay = parseOverlay(raw);
      set({ overlay, canSave, apartments: applyOverlay(BASE, overlay) });
    },
    addApartment: (apt) => {
      const id = crypto.randomUUID();
      const netEffectiveRent = calculateNetEffective(apt.rentBase, apt.rentMonthsFree, apt.leaseTerm);
      const lastUpdated = new Date().toISOString();
      commit(recordAdd(get().overlay, { ...apt, id, netEffectiveRent, lastUpdated }));
    },
    updateApartment: (id, apt) => {
      const current = get().apartments.find((a) => a.id === id);
      if (!current) return;
      const merged = { ...current, ...apt };
      const patch = {
        ...apt,
        netEffectiveRent: calculateNetEffective(merged.rentBase, merged.rentMonthsFree, merged.leaseTerm),
        lastUpdated: new Date().toISOString(),
      };
      commit(recordEdit(get().overlay, id, patch));
    },
    removeApartment: (id) => commit(recordRemove(get().overlay, id)),
  };
});
