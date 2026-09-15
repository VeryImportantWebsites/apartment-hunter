"use client";

import { useApartmentStore } from "@/store/apartmentStore";
import { Plus, Building2, MapPin, Star, ArrowUpDown, Pencil, Search, X, Calendar, ChevronLeft, ChevronRight, Sparkles, Filter } from "lucide-react";
import { useState } from "react";

type QuickFilterType = "all" | "now" | "nofee" | "studio" | "1b" | "2b" | "under3500";

export default function Sidebar({ onAddClick, onEditClick, onViewClick }: { onAddClick: () => void, onEditClick: (id: string) => void, onViewClick: (id: string) => void }) {
  const { apartments } = useApartmentStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>("all");
  const [sortBy, setSortBy] = useState<"rent" | "rating" | "name" | "recent" | "availability">("rent");

  const filteredApartments = apartments.filter((apt) => {
    // Quick filter pills
    if (quickFilter === "now" && apt.availability !== "Available Now") return false;
    if (quickFilter === "nofee" && !apt.feeStatus?.toLowerCase().includes("no fee")) return false;
    if (quickFilter === "studio" && !apt.floorPlan.toLowerCase().includes("studio")) return false;
    if (quickFilter === "1b" && apt.floorPlan !== "1B") return false;
    if (quickFilter === "2b" && apt.floorPlan !== "2B") return false;
    if (quickFilter === "under3500" && apt.netEffectiveRent >= 3500) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        apt.name.toLowerCase().includes(q) ||
        apt.address.toLowerCase().includes(q) ||
        apt.floorPlan.toLowerCase().includes(q) ||
        (apt.feeStatus && apt.feeStatus.toLowerCase().includes(q)) ||
        (apt.source && apt.source.toLowerCase().includes(q)) ||
        (apt.notes && apt.notes.toLowerCase().includes(q)) ||
        (apt.perksAndAmenities && apt.perksAndAmenities.some((p) => p.toLowerCase().includes(q))) ||
        (apt.buildingAmenities && apt.buildingAmenities.some((p) => p.toLowerCase().includes(q)));
      if (!match) return false;
    }

    // Availability filter
    if (availabilityFilter !== "all") {
      const avail = (apt.availability || "").toLowerCase();
      if (availabilityFilter === "now") {
        if (avail !== "available now") return false;
      } else if (availabilityFilter === "30days") {
        if (avail !== "available within 30 days" && avail !== "available now") return false;
      } else if (availabilityFilter === "october") {
        if (!avail.includes("october")) return false;
      } else if (availabilityFilter === "november") {
        if (!avail.includes("november")) return false;
      } else if (availabilityFilter === "waitlist") {
        if (avail !== "waitlist") return false;
      }
    }

    return true;
  });

  const sortedApartments = [...filteredApartments].sort((a, b) => {
    if (sortBy === "rent") return a.netEffectiveRent - b.netEffectiveRent;
    if (sortBy === "rating") return b.ranking - a.ranking;
    if (sortBy === "recent") {
      const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return dateB - dateA;
    }
    if (sortBy === "availability") {
      if (a.availability === b.availability) return 0;
      if (a.availability === "Available Now") return -1;
      if (b.availability === "Available Now") return 1;
      if (a.availability === "Waitlist") return 1;
      if (b.availability === "Waitlist") return -1;
      return (a.availability || "").localeCompare(b.availability || "");
    }
    return a.name.localeCompare(b.name);
  });

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="absolute top-4 left-4 z-20 glass-panel-elevated p-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/10 hover:border-white/30 transition-all text-white group cursor-pointer"
        title="Open Apartment List"
      >
        <Building2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold leading-none">Apartments</span>
          <span className="text-[10px] text-gray-400 leading-none mt-1">
            {filteredApartments.length} matching
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
    );
  }

  const quickPills: { id: QuickFilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "now", label: "Available Now" },
    { id: "nofee", label: "No Fee" },
    { id: "studio", label: "Studio" },
    { id: "1b", label: "1 Bed" },
    { id: "2b", label: "2 Bed" },
    { id: "under3500", label: "Under $3.5k" },
  ];

  return (
    <div className="absolute top-4 left-4 z-10 w-[410px] max-h-[calc(100vh-2rem)] flex flex-col glass-panel-elevated rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold tracking-tight text-white">
              Apartment Hunter
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/25">
              {filteredApartments.length === apartments.length
                ? apartments.length
                : `${filteredApartments.length}/${apartments.length}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onAddClick}
              className="btn-primary p-2 rounded-xl flex items-center justify-center cursor-pointer"
              title="Add Apartment"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, address, amenities, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {quickPills.map((pill) => {
            const isActive = quickFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setQuickFilter(pill.id)}
                className={`pill-filter text-[11px] font-medium whitespace-nowrap px-2.5 py-1 rounded-full border cursor-pointer ${
                  isActive
                    ? "bg-white text-black font-semibold border-white shadow-sm"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Filters & Sorting */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 flex items-center gap-1 font-medium text-[11px]">
              <Calendar className="w-3 h-3 text-blue-400" /> Availability:
            </span>
            <select
              className="bg-[#141414] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/25 cursor-pointer"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">All Availability</option>
              <option value="now">Available Now</option>
              <option value="30days">Within 30 Days</option>
              <option value="october">October 2026</option>
              <option value="november">November 2026</option>
              <option value="waitlist">Waitlist</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-gray-400 flex items-center gap-1 font-medium text-[11px]">
              <ArrowUpDown className="w-3 h-3 text-blue-400" /> Sort by:
            </span>
            <select
              className="bg-[#141414] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/25 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="rent">Rent (Low to High)</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="availability">Availability (Now First)</option>
              <option value="recent">Recently Updated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {sortedApartments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3 text-center px-4">
            <Building2 className="w-12 h-12 opacity-20" />
            <p className="text-sm">No apartments match your search or filter criteria.</p>
            {(searchQuery || availabilityFilter !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setAvailabilityFilter("all"); }}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          sortedApartments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => onViewClick(apt.id)}
              className="cursor-pointer group p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15 hover:shadow-xl transition-all duration-200 relative"
            >
              <div className="flex gap-3.5">
                {/* Thumbnail */}
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-[#0d0d0d] border border-white/10 relative">
                  {apt.images && apt.images.length > 0 ? (
                    <img
                      src={apt.images[0]}
                      alt={apt.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <Building2 className="w-8 h-8" />
                    </div>
                  )}
                  {apt.source && (
                    <span className="absolute bottom-1 left-1 text-[8px] uppercase font-bold tracking-wider px-1 py-0.5 rounded bg-black/70 backdrop-blur-sm text-purple-200 border border-white/10">
                      {apt.source}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-100 group-hover:text-white transition-colors">{apt.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEditClick(apt.id); }} 
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < apt.ranking ? "text-yellow-400 fill-yellow-400" : "text-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 flex items-center justify-between gap-1 mb-2.5">
                    <div className="flex items-center gap-1 min-w-0 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0 text-gray-500" />
                      <span className="truncate">{apt.address}</span>
                    </div>
                    {apt.availability && (
                      <span className={`text-[10px] whitespace-nowrap px-1.5 py-0.5 rounded font-medium border flex-shrink-0 ${
                        apt.availability === "Available Now"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : apt.availability === "Waitlist"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                      }`}>
                        {apt.availability}
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                        {apt.floorPlan}
                      </span>
                      {apt.sqft && (
                        <span className="text-xs text-gray-400">
                          {apt.sqft} sqft
                        </span>
                      )}
                      {apt.feeStatus && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {apt.feeStatus}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      {apt.rentMonthsFree > 0 ? (
                        <>
                          <div className="text-[10px] text-gray-500 line-through">${apt.rentBase}/mo</div>
                          <div className="text-sm font-medium text-emerald-400">${apt.netEffectiveRent}/mo</div>
                        </>
                      ) : (
                        <div className="text-sm font-medium text-emerald-400">${apt.rentBase}/mo</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
