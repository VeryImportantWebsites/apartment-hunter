import { create } from "zustand";
import { useMemo } from "react";
import { useApartmentStore } from "@/store/apartmentStore";
import {
  DEFAULT_FILTERS,
  Filters,
  availableMonths,
  untrustedFloorPlanUrls,
  untrustedImageUrls,
  untrustedSqftIds,
  visibleListings,
} from "@/lib/listing";

// Filter, sort and search state shared by the list and the map, so both always show the same
// listings (blind QA #5: map pins ignored the sidebar's filters).
interface FilterStore {
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  /** A map popup is open: small screens hide overlapping controls while it is. */
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
  /** List panel collapsed to its pill: the map re-fits its results to the space it frees. */
  panelCollapsed: boolean;
  setPanelCollapsed: (collapsed: boolean) => void;
}

export const useFilterStore = create<FilterStore>()((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  popupOpen: false,
  setPopupOpen: (popupOpen) => set({ popupOpen }),
  panelCollapsed: false,
  setPanelCollapsed: (panelCollapsed) => set({ panelCollapsed }),
}));

/** The filtered, sorted listings plus derived data every view needs. */
export function useListingView() {
  const { apartments } = useApartmentStore();
  const filters = useFilterStore((s) => s.filters);
  return useMemo(() => {
    const today = new Date();
    return {
      today,
      total: apartments.length,
      visible: visibleListings(apartments, filters, today),
      months: availableMonths(apartments, today),
      untrustedFloorPlans: untrustedFloorPlanUrls(apartments),
      untrustedSqft: untrustedSqftIds(apartments),
      untrustedImages: untrustedImageUrls(apartments),
    };
  }, [apartments, filters]);
}
