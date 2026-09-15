"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useApartmentStore, Apartment } from "@/store/apartmentStore";
import { Building2, MapPin, Star, Calendar, ChevronLeft, ChevronRight, Eye, ExternalLink, Plus, Minus, Navigation } from "lucide-react";

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

function ApartmentPopupCard({
  apt,
  onViewClick
}: {
  apt: Apartment;
  onViewClick?: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"photo" | "floorplan">("photo");
  const [photoIndex, setPhotoIndex] = useState(0);

  const hasPhotos = Boolean(apt.images && apt.images.length > 0);
  const hasFloorPlan = Boolean(apt.floorPlanImageUrl);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (apt.images && apt.images.length > 0) {
      setPhotoIndex((prev) => (prev + 1) % apt.images!.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (apt.images && apt.images.length > 0) {
      setPhotoIndex((prev) => (prev - 1 + apt.images!.length) % apt.images!.length);
    }
  };

  return (
    <div className="flex flex-col w-[300px] text-white select-none">
      {/* Media Header with Photo / Floor Plan tabs */}
      <div className="relative h-44 w-full bg-[#0a0a0a] overflow-hidden group">
        {activeTab === "photo" && hasPhotos ? (
          <>
            <img
              src={apt.images![photoIndex]}
              alt={`${apt.name} interior`}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
              onClick={() => onViewClick?.(apt.id)}
            />
            {apt.images!.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevPhoto}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm z-10 transition-opacity"
                  title="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm z-10 transition-opacity"
                  title="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="absolute bottom-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white/90 border border-white/10">
                  {photoIndex + 1} / {apt.images!.length}
                </span>
              </>
            )}
          </>
        ) : activeTab === "floorplan" && hasFloorPlan ? (
          <div
            className="w-full h-full bg-white flex items-center justify-center p-2 cursor-pointer group/fp relative"
            onClick={() => onViewClick?.(apt.id)}
            title="Click to view large"
          >
            <img
              src={apt.floorPlanImageUrl}
              alt={`${apt.name} floor plan layout`}
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-sm">
              Enlarge
            </span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-1 bg-[#111]">
            <Building2 className="w-8 h-8 opacity-40" />
            <span className="text-xs">No media available</span>
          </div>
        )}

        {/* Media Switcher Tab (Photos vs Floor Plan) */}
        {hasFloorPlan && hasPhotos && (
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            <button
              type="button"
              onClick={() => setActiveTab("photo")}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md transition-all ${
                activeTab === "photo"
                  ? "bg-white text-black font-semibold shadow"
                  : "bg-black/60 text-white/80 hover:bg-black/80"
              }`}
            >
              Photos ({apt.images?.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("floorplan")}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md transition-all ${
                activeTab === "floorplan"
                  ? "bg-white text-black font-semibold shadow"
                  : "bg-black/60 text-white/80 hover:bg-black/80"
              }`}
            >
              Floor Plan
            </button>
          </div>
        )}

        {/* Source badge */}
        {apt.source && (
          <span className="absolute bottom-2 left-2 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-200 border border-purple-500/30 backdrop-blur-sm">
            {apt.source}
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className="p-3 flex flex-col gap-2 bg-[#121212]">
        {/* Name & Rating */}
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3
              onClick={() => onViewClick?.(apt.id)}
              className="font-bold text-sm text-white tracking-tight leading-snug cursor-pointer hover:text-blue-400 transition-colors line-clamp-1"
              title={apt.name}
            >
              {apt.name}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-white">{apt.ranking}.0</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span className="truncate" title={apt.address}>{apt.address}</span>
          </div>
        </div>

        {/* Specs Badges */}
        <div className="flex flex-wrap items-center gap-1 text-[10px]">
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium border border-white/10">
            {apt.floorPlan}
          </span>
          {apt.sqft && (
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5">
              {apt.sqft.toLocaleString()} sqft
            </span>
          )}
          {apt.feeStatus && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
              {apt.feeStatus}
            </span>
          )}
        </div>

        {/* Pricing & Availability */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-emerald-400">
                ${apt.netEffectiveRent.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400">/mo net</span>
            </div>
            {apt.rentMonthsFree > 0 && (
              <span className="text-[9px] text-gray-400 block -mt-0.5">
                Base ${apt.rentBase.toLocaleString()} ({apt.rentMonthsFree} mo free)
              </span>
            )}
          </div>

          {apt.availability && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-medium border border-blue-500/30 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              {apt.availability}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="pt-1 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onViewClick?.(apt.id)}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            View Full Details
          </button>
          {apt.appointmentLink && (
            <a
              href={apt.appointmentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all flex items-center justify-center"
              title="Official Website / Tour"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// A component to recenter the map if needed
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function MapControls({ totalCount }: { totalCount: number }) {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2 pointer-events-auto">
      <div className="glass-panel px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-white shadow-2xl border border-white/10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{totalCount} Units Tracked</span>
      </div>

      <div className="glass-panel p-1 rounded-xl flex flex-col gap-1 shadow-2xl border border-white/10">
        <button
          type="button"
          onClick={() => map.zoomIn()}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => map.zoomOut()}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="h-px w-full bg-white/10 my-0.5" />
        <button
          type="button"
          onClick={() => map.setView([40.7447, -73.9485], 14, { animate: true })}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
          title="Recenter Map (NYC / LIC)"
        >
          <Navigation className="w-4 h-4 text-blue-400" />
        </button>
      </div>
    </div>
  );
}

export default function Map({
  onViewClick
}: {
  onViewClick?: (id: string) => void;
}) {
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
        <MapControls totalCount={apartments.length} />
        {apartments.map((apt) => (
          <Marker key={apt.id} position={apt.coordinates} icon={customIcon}>
            <Popup className="premium-popup" minWidth={300} maxWidth={320}>
              <ApartmentPopupCard apt={apt} onViewClick={onViewClick} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
