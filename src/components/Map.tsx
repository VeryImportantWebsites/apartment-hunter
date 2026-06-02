"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useApartmentStore } from "@/store/apartmentStore";

// Fix Leaflet's default icon issue in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A component to recenter the map if needed
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Map() {
  const [mounted, setMounted] = useState(false);
  const { apartments } = useApartmentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-[#050505] animate-pulse" />;
  }

  // Default to Long Island City coordinates
  const defaultCenter: [number, number] = [40.7447, -73.9485];

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {apartments.map((apt) => (
          <Marker key={apt.id} position={apt.coordinates} icon={customIcon}>
            <Popup className="premium-popup">
              <div className="flex flex-col gap-1 p-1">
                <h3 className="font-semibold text-lg">{apt.name}</h3>
                <p className="text-sm text-gray-300">{apt.floorPlan} • ${apt.rentBase}/mo</p>
                {apt.rentMonthsFree > 0 && (
                  <p className="text-xs text-emerald-400 font-medium">Net Effective: ${apt.netEffectiveRent}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-sm ${i < apt.ranking ? "text-yellow-400" : "text-gray-600"}`}>★</span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
