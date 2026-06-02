"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import AddApartmentModal from "@/components/AddApartmentModal";

// Dynamically import the map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [editingAptId, setEditingAptId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (id?: string) => {
    setEditingAptId(id || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAptId(null);
    setIsModalOpen(false);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {/* Interactive Map Background */}
      <Map />

      {/* Sidebar Overlay */}
      <Sidebar onAddClick={() => handleOpenModal()} onEditClick={(id) => handleOpenModal(id)} />

      {/* Add/Edit Apartment Modal */}
      {isModalOpen && <AddApartmentModal editingId={editingAptId} onClose={handleCloseModal} />}
    </main>
  );
}
