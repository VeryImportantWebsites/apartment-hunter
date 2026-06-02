"use client";

import { useApartmentStore } from "@/store/apartmentStore";
import { X, MapPin, Building2, Star, CheckCircle2 } from "lucide-react";

export default function ViewApartmentModal({
  apartmentId,
  onClose,
}: {
  apartmentId: string;
  onClose: () => void;
}) {
  const { apartments } = useApartmentStore();
  const apt = apartments.find((a) => a.id === apartmentId);

  if (!apt) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section (could be an image placeholder) */}
        <div className="h-48 bg-gradient-to-br from-blue-900/40 to-[#050505] relative border-b border-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-6 left-8 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white">
                {apt.floorPlan}
              </span>
              <div className="flex gap-1 ml-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < apt.ranking ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
              {apt.name}
            </h2>
            <div className="text-gray-300 flex items-center gap-1.5 text-sm drop-shadow-md">
              <MapPin className="w-4 h-4" />
              <span>{apt.address}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 grid grid-cols-2 gap-8">
          
          {/* Left Column: Pricing & Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Pricing</h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Base Rent</span>
                  <span className="text-white font-medium">${apt.rentBase}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Concession</span>
                  <span className="text-blue-400 font-medium">{apt.rentMonthsFree} Months Free</span>
                </div>
                <div className="h-px w-full bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-200 font-medium">Net Effective</span>
                  <span className="text-emerald-400 font-bold text-xl">${apt.netEffectiveRent}/mo</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Notes</h3>
              <p className="text-gray-300 text-sm leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4 min-h-[80px]">
                {apt.notes || "No notes available."}
              </p>
            </div>
          </div>

          {/* Right Column: Amenities */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Amenities & Perks</h3>
              <div className="flex flex-col gap-3">
                {apt.perksAndAmenities.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">None listed</p>
                ) : (
                  apt.perksAndAmenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {amenity}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex gap-3">
              {apt.link && (
                <a 
                  href={apt.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary w-full py-3 rounded-xl text-center text-sm"
                >
                  Visit Listing
                </a>
              )}
            </div>
          </div>
          
        </div>

        {/* Floor Plan Image Section */}
        {apt.floorPlanImageUrl && (
          <div className="px-8 pb-8">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Floor Plan</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
              <img 
                src={apt.floorPlanImageUrl} 
                alt={`${apt.name} Floor Plan`} 
                className="max-h-96 w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
