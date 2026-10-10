"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Apartment } from "@/store/apartmentStore";
import { useFilterStore, useListingView } from "@/store/filterStore";
import SafeImage from "@/components/SafeImage";
import { availabilityLabel, feeLabel, formatRating, spreadCoordinates, usableBookingLink } from "@/lib/listing";
import { Building2, MapPin, Star, Calendar, ChevronLeft, ChevronRight, Eye, ExternalLink, Plus, Minus, Navigation } from "lucide-react";

// Fix Leaflet's default icon issue in Next.js
// Icons are served from /public/leaflet (copied from the leaflet package) instead of unpkg /
// raw.githubusercontent.com, so the map does not depend on third-party hosts for its pins.
const customIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Selected Pin Icon (Gold accent with prominent sizing)
const selectedIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  className: "marker-selected",
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -38],
  shadowSize: [41, 41]
});

function ApartmentPopupCard({
  apt,
  onViewClick,
  today,
  untrustedFloorPlans,
  untrustedSqft,
}: {
  apt: Apartment;
  onViewClick?: (id: string) => void;
  today: Date;
  untrustedFloorPlans: Set<string>;
  untrustedSqft: Set<string>;
}) {
  const bookingLink = usableBookingLink(apt.appointmentLink);
  const [activeTab, setActiveTab] = useState<"photo" | "floorplan">("photo");
  const [photoIndex, setPhotoIndex] = useState(0);

  const hasPhotos = Boolean(apt.images && apt.images.length > 0);
  const hasFloorPlan = Boolean(apt.floorPlanImageUrl) && !untrustedFloorPlans.has(apt.floorPlanImageUrl!);

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
    <div className="flex flex-col w-[min(300px,calc(100vw-5rem))] text-white select-none">
      {/* Media Header with Photo / Floor Plan tabs */}
      <div className="relative h-44 w-full bg-[#0a0a0a] overflow-hidden group">
        {activeTab === "photo" && hasPhotos ? (
          <>
            <SafeImage
              src={apt.images![photoIndex]}
              alt={`${apt.name} interior`}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
              onClick={() => onViewClick?.(apt.id)}
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-1 bg-[#111]">
                  <Building2 className="w-8 h-8 opacity-40" />
                  <span className="text-xs">Photo unavailable</span>
                </div>
              }
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
              <span className="text-xs font-semibold text-white">{formatRating(apt.ranking)}</span>
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
          {apt.sqft && !untrustedSqft.has(apt.id) && (
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5">
              {apt.sqft.toLocaleString()} sqft
            </span>
          )}
          {feeLabel(apt.feeStatus) && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
              {feeLabel(apt.feeStatus)}
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
              {availabilityLabel(apt.availability, today)}
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
          {bookingLink && (
            <a
              href={bookingLink}
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


function MapControls({ shownCount, totalCount }: { shownCount: number; totalCount: number }) {
  const map = useMap();
  const popupOpen = useFilterStore((s) => s.popupOpen);

  return (
    <div className={`absolute top-4 right-4 max-sm:top-auto max-sm:bottom-8 max-sm:flex-row max-sm:items-end z-[400] flex flex-col items-end gap-2 pointer-events-auto ${popupOpen ? "max-sm:hidden" : ""}`}>
      <div className="glass-panel px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-white shadow-2xl border border-white/10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{shownCount === totalCount ? `${totalCount} Units Tracked` : `${shownCount} of ${totalCount} Units`}</span>
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

// Tracks whether a popup is open so phone-sized layouts can move overlapping controls aside.
function PopupTracker() {
  const setPopupOpen = useFilterStore((s) => s.setPopupOpen);
  useMapEvents({
    popupopen: () => setPopupOpen(true),
    popupclose: () => setPopupOpen(false),
  });
  return null;
}

// CARTO raster basemaps now need a free key (keyless tiles come back as an "API KEY REQUIRED"
// image, blind QA #2). With NEXT_PUBLIC_CARTO_API_KEY set we use CARTO dark_all; without it we
// fall back to keyless OpenStreetMap tiles, darkened in CSS (.tiles-dark in globals.css).
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY;
const TILES = CARTO_KEY
  ? {
      url: `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      className: "",
    }
  : {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      className: "tiles-dark",
    };

// When filters narrow the list, move the map so the matching pins are in the visible area, not
// under the list panel (blind QA re-run F6). Desktop pads for the 410px panel on the left; phones
// pad for the collapsed pill at the top and the controls strip at the bottom.
function FitToResults({ positions, filtered }: { positions: globalThis.Map<string, [number, number]>; filtered: boolean }) {
  const map = useMap();
  const key = [...positions.keys()].join(",");
  useEffect(() => {
    if (!filtered || positions.size === 0) return;
    const pts = [...positions.values()];
    const wide = window.innerWidth >= 640;
    map.flyToBounds(L.latLngBounds(pts), {
      paddingTopLeft: wide ? [458, 32] : [24, 96],
      paddingBottomRight: wide ? [80, 32] : [24, 96],
      maxZoom: 16,
      duration: 0.8,
    });
    // positions is derived from the same filter result as key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, filtered, map]);
  return null;
}

export interface FocusCommand {
  id: string;
  coordinates: [number, number];
  zoom?: number;
  timestamp: number;
}

function MapController({
  focusCommand,
  markerRefs
}: {
  focusCommand?: FocusCommand | null;
  markerRefs: React.MutableRefObject<Record<string, L.Marker>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!focusCommand) return;
    const { coordinates, zoom, id } = focusCommand;

    if (zoom !== undefined) {
      // Zoom and center (from list selection)
      map.flyTo(coordinates, zoom, {
        animate: true,
        duration: 1.2
      });
    } else {
      // Center (no zoom) (from pin selection)
      map.panTo(coordinates, {
        animate: true,
        duration: 0.5
      });
    }

    const marker = markerRefs.current[id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 350);
    }
  }, [focusCommand, map, markerRefs]);

  return null;
}

export default function Map({
  selectedId,
  focusCommand,
  onSelectPin,
  onViewClick
}: {
  selectedId?: string | null;
  focusCommand?: FocusCommand | null;
  onSelectPin?: (apt: Apartment) => void;
  onViewClick?: (id: string) => void;
}) {
  const { visible, total, today, untrustedFloorPlans, untrustedSqft } = useListingView();
  const markerRefs = useRef<Record<string, L.Marker>>({});
  // Spread listings that share exact coordinates so each pin can be picked.
  // Listings whose pin is known to be wrong (locationUnverified) are not drawn.
  const mapped = useMemo(() => visible.filter((a) => !a.locationUnverified), [visible]);
  const positions = useMemo(() => spreadCoordinates(mapped), [mapped]);

  // No mounted guard needed: page.tsx loads this component with dynamic(..., { ssr: false }).

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
        <TileLayer attribution={TILES.attribution} url={TILES.url} className={TILES.className} />
        <MapControls shownCount={visible.length} totalCount={total} />
        <PopupTracker />
        <FitToResults positions={positions} filtered={visible.length < total} />
        <MapController focusCommand={focusCommand} markerRefs={markerRefs} />
        {mapped.map((apt) => {
          const isSelected = selectedId === apt.id;
          return (
            <Marker
              key={apt.id}
              position={positions.get(apt.id) ?? apt.coordinates}
              icon={isSelected ? selectedIcon : customIcon}
              zIndexOffset={isSelected ? 1000 : 0}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[apt.id] = ref;
                } else {
                  delete markerRefs.current[apt.id];
                }
              }}
              eventHandlers={{
                click: () => {
                  onSelectPin?.(apt);
                }
              }}
            >
              <Popup
                className="premium-popup"
                minWidth={260}
                maxWidth={320}
                autoPanPaddingTopLeft={[16, 88]}
                autoPanPaddingBottomRight={[16, 16]}
              >
                <ApartmentPopupCard apt={apt} onViewClick={onViewClick} today={today} untrustedFloorPlans={untrustedFloorPlans} untrustedSqft={untrustedSqft} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
