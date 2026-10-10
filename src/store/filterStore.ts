import { create } from "zustand";
import { useMemo } from "react";
import { useApartmentStore } from "@/store/apartmentStore";
import {
  DEFAULT_FILTERS,
  Filters,
  availableMonths,
  untrustedFloorPlanUrls,
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
}

export const useFilterStore = create<FilterStore>()((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  popupOpen: false,
  setPopupOpen: (popupOpen) => set({ popupOpen }),
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
    };
  }, [apartments, filters]);
}
