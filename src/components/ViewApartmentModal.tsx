"use client";

import { useApartmentStore } from "@/store/apartmentStore";
import { X, MapPin, Building2, Star, CheckCircle2, Phone, Mail, CalendarDays, TrainFront, PawPrint, CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ViewApartmentModal({
  apartmentId,
  onClose,
}: {
  apartmentId: string;
  onClose: () => void;
}) {
  const { apartments } = useApartmentStore();
  const apt = apartments.find((a) => a.id === apartmentId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!apt) return null;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (apt.images) {
      setCurrentImageIndex((prev) => (prev + 1) % apt.images!.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (apt.images) {
      setCurrentImageIndex((prev) => (prev - 1 + apt.images!.length) % apt.images!.length);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-y-auto overflow-x-hidden max-h-[90vh] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="h-64 bg-gradient-to-br from-blue-900/40 to-[#050505] relative border-b border-white/5 overflow-hidden group">
          {apt.images && apt.images.length > 0 && (
            <>
              <img 
                src={apt.images[currentImageIndex]} 
                alt={`${apt.name} view`} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {apt.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {apt.images.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
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
              {apt.source && (
                <span className="px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-sm font-medium text-purple-200">
                  {apt.source}
                </span>
              )}
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

            {/* Quick Facts */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Quick Facts</h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                {apt.sqft && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Size</span>
                    <span className="text-white">{apt.sqft} sqft</span>
                  </div>
                )}
                {apt.feeStatus && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Broker Fee</span>
                    <span className={apt.feeStatus.toLowerCase().includes("no fee") ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                      {apt.feeStatus}
                    </span>
                  </div>
                )}
                {apt.availability && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Available</span>
                    <span className="text-white">{apt.availability}</span>
                  </div>
                )}
                {apt.leaseTerm && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Lease Term</span>
                    <span className="text-white">{apt.leaseTerm}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact & Transit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Contact</span>
                </div>
                {apt.contactPhone && <div className="text-sm text-gray-200">{apt.contactPhone}</div>}
                {apt.contactEmail && <div className="text-sm text-gray-200 truncate" title={apt.contactEmail}>{apt.contactEmail}</div>}
                {!apt.contactPhone && !apt.contactEmail && <div className="text-sm text-gray-500 italic">No contact info</div>}
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <TrainFront className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Transit</span>
                </div>
                <div className="text-sm text-gray-200">
                  {apt.transitDetails || <span className="text-gray-500 italic">Not specified</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Amenities */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Amenities & Perks</h3>
              <div className="flex flex-col gap-3">
                {!apt.perksAndAmenities || apt.perksAndAmenities.length === 0 ? (
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

            {/* Building Amenities */}
            {apt.buildingAmenities && apt.buildingAmenities.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 mt-2">Building Amenities</h3>
                <div className="flex flex-col gap-3">
                  {apt.buildingAmenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pet Policy */}
            <div className="mt-2">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Pet Policy</h3>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <PawPrint className="w-4 h-4 text-amber-400" />
                {apt.petPolicy || <span className="text-gray-500 italic">Not specified</span>}
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex gap-3 flex-col sm:flex-row">
              {apt.appointmentLink && (
                <a 
                  href={apt.appointmentLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white text-black font-semibold hover:bg-gray-200 transition-colors w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  <CalendarClock className="w-4 h-4" /> Schedule Tour
                </a>
              )}
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
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden p-4 flex items-center justify-center min-h-[300px]">
              <img 
                src={apt.floorPlanImageUrl} 
                alt={`${apt.name} Floor Plan`} 
                className="max-h-96 w-auto object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
