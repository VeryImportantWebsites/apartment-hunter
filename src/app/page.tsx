"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import AddApartmentModal from "@/components/AddApartmentModal";

// Dynamically import the map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {/* Interactive Map Background */}
      <Map />

      {/* Sidebar Overlay */}
      <Sidebar onAddClick={() => setIsModalOpen(true)} />

      {/* Add Apartment Modal */}
      {isModalOpen && <AddApartmentModal onClose={() => setIsModalOpen(false)} />}
    </main>
  );
}
