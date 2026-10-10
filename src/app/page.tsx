"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import AddApartmentModal from "@/components/AddApartmentModal";
import ViewApartmentModal from "@/components/ViewApartmentModal";
import { useFilterStore } from "@/store/filterStore";
import { filtersFromQuery, filtersToQuery } from "@/lib/listing";

// Dynamically import the map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [editingAptId, setEditingAptId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingAptId, setViewingAptId] = useState<string | null>(null);
  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);
  const hydrated = useRef(false);

  // URL state (blind QA #5 / F10): filters live in the query string so a reload or a shared link
  // restores them, and an open listing is a history entry so Back closes it instead of leaving
  // the site. This is a static export, so read window.location directly (no server params).
  useEffect(() => {
    const apply = () => {
      const { filters: f, apt } = filtersFromQuery(window.location.search);
      setFilters(f);
      setViewingAptId(apt);
    };
    apply();
    hydrated.current = true;
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, [setFilters]);

  // Filter changes replace the current entry (typing should not flood the history).
  useEffect(() => {
    if (!hydrated.current) return;
    const apt = new URLSearchParams(window.location.search).get("apt");
    const next = `${window.location.pathname}${filtersToQuery(filters, apt)}`;
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [filters]);

  const openListing = (id: string) => {
    if (id === viewingAptId) return;
    window.history.pushState({ apt: id }, "", `${window.location.pathname}${filtersToQuery(filters, id)}`);
    setViewingAptId(id);
  };

  const closeListing = () => {
    // If we pushed the entry, going back restores the previous URL and fires popstate.
    if (window.history.state?.apt) {
      window.history.back();
    } else {
      window.history.replaceState(null, "", `${window.location.pathname}${filtersToQuery(filters, null)}`);
      setViewingAptId(null);
    }
  };

  const handleOpenModal = (id?: string) => {
    setEditingAptId(id || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAptId(null);
    setIsModalOpen(false);
  };

  return (
    <main className="relative w-full h-dvh overflow-hidden bg-[#050505]">
      {/* Interactive Map Background */}
      <Map onViewClick={openListing} />

      {/* Sidebar Overlay */}
      <Sidebar
        onAddClick={() => handleOpenModal()}
        onEditClick={(id) => handleOpenModal(id)}
        onViewClick={openListing}
      />

      {/* Add/Edit Apartment Modal */}
      {isModalOpen && <AddApartmentModal editingId={editingAptId} onClose={handleCloseModal} />}

      {/* View Apartment Modal */}
      {viewingAptId && <ViewApartmentModal apartmentId={viewingAptId} onClose={closeListing} />}
    </main>
  );
}
