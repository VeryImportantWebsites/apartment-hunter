"use client";

import { useApartmentStore } from "@/store/apartmentStore";
import { Plus, Building2, MapPin, Star, ArrowUpDown, Pencil } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ onAddClick, onEditClick, onViewClick }: { onAddClick: () => void, onEditClick: (id: string) => void, onViewClick: (id: string) => void }) {
  const { apartments } = useApartmentStore();
  const [sortBy, setSortBy] = useState<"rent" | "rating" | "name">("rent");

  const sortedApartments = [...apartments].sort((a, b) => {
    if (sortBy === "rent") return a.netEffectiveRent - b.netEffectiveRent;
    if (sortBy === "rating") return b.ranking - a.ranking;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="absolute top-4 left-4 z-10 w-96 max-h-[calc(100vh-2rem)] flex flex-col glass-panel rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Apartment Hunter
          </h1>
          <button
            onClick={onAddClick}
            className="btn-primary p-2 rounded-xl flex items-center justify-center"
            title="Add Apartment"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Sorting */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <ArrowUpDown className="w-4 h-4" /> Sort by:
          </span>
          <select
            className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-white/20"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="rent" className="bg-[#111]">Net Rent (Low to High)</option>
            <option value="rating" className="bg-[#111]">Rating (High to Low)</option>
            <option value="name" className="bg-[#111]">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {sortedApartments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
            <Building2 className="w-12 h-12 opacity-20" />
            <p>No apartments tracked yet.</p>
          </div>
        ) : (
          sortedApartments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => onViewClick(apt.id)}
              className="cursor-pointer group p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all relative"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-100 group-hover:text-white transition-colors">{apt.name}</h3>
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
              
              <div className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{apt.address}</span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                    {apt.floorPlan}
                  </span>
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
          ))
        )}
      </div>
    </div>
  );
}
