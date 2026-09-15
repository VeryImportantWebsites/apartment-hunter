import { useApartmentStore } from "@/store/apartmentStore";
import {
  X,
  MapPin,
  Building2,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  CalendarDays,
  TrainFront,
  PawPrint,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Maximize2
} from "lucide-react";
import { useState, useEffect } from "react";

type ModalTab = "overview" | "floorplan" | "amenities" | "transit";

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
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");
  const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && apt?.images && apt.images.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % apt.images!.length);
      } else if (e.key === "ArrowLeft" && apt?.images && apt.images.length > 1) {
        setCurrentImageIndex((prev) => (prev - 1 + apt.images!.length) % apt.images!.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [apt, onClose]);

  if (!apt) return null;

  const copyToClipboard = (text: string, field: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  const tabs: { id: ModalTab; label: string; badge?: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "floorplan", label: "Floor Plan", badge: apt.floorPlanImageUrl ? "Available" : undefined },
    { id: "amenities", label: "Amenities & Perks" },
    { id: "transit", label: "Transit & Contact" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel-elevated w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-white/10 relative">
        
        {/* Header Hero Section */}
        <div className="h-64 sm:h-72 bg-[#0a0a0a] relative border-b border-white/5 overflow-hidden group shrink-0">
          {apt.images && apt.images.length > 0 ? (
            <>
              <img 
                src={apt.images[currentImageIndex]} 
                alt={`${apt.name} view`} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-black/20" />
              
              {apt.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md z-10 transition-all cursor-pointer"
                    title="Previous photo (←)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md z-10 transition-all cursor-pointer"
                    title="Next photo (→)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                    {apt.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === currentImageIndex ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-white/80 font-medium ml-1">
                      {currentImageIndex + 1}/{apt.images.length}
                    </span>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-[#0d0d0d]">
              <Building2 className="w-12 h-12 opacity-30" />
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-gray-300 hover:text-white transition-all backdrop-blur-md border border-white/10 z-20 cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Title Overlay */}
          <div className="absolute bottom-5 left-6 right-6 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                {apt.floorPlan}
              </span>
              {apt.source && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-xs font-medium text-purple-200">
                  {apt.source}
                </span>
              )}
              {apt.availability && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-xs font-medium text-blue-200 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> {apt.availability}
                </span>
              )}
              <div className="flex items-center gap-1 ml-auto bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">{apt.ranking}.0</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
              {apt.name}
            </h2>

            <div className="text-gray-300 flex items-center gap-1.5 text-xs drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{apt.address}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#141414] px-6 gap-2 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 text-xs font-medium relative transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive ? "text-white font-semibold" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pricing Breakdown Card */}
              <div className="flex flex-col gap-4">
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Pricing Structure</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                      Active Promotion
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Gross Monthly Rent</span>
                    <span className="text-white font-medium">${apt.rentBase.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Promotional Concession</span>
                    <span className="text-blue-400 font-medium">
                      {apt.rentMonthsFree > 0 ? `${apt.rentMonthsFree} Month(s) Free` : "No promotion"}
                    </span>
                  </div>

                  <div className="h-px w-full bg-white/10" />

                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-xs text-gray-300 font-medium block">Net Effective Rent</span>
                      <span className="text-[10px] text-gray-500">Amortized over lease term</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-2xl">
                      ${apt.netEffectiveRent.toLocaleString()}<span className="text-xs font-normal text-gray-400">/mo</span>
                    </span>
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5">
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Apartment Details</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-0.5">
                      <span className="text-gray-400 text-[10px]">Layout</span>
                      <span className="font-semibold text-white">{apt.floorPlan}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-0.5">
                      <span className="text-gray-400 text-[10px]">Living Space</span>
                      <span className="font-semibold text-white">{apt.sqft ? `${apt.sqft.toLocaleString()} sqft` : "Inquire"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-0.5">
                      <span className="text-gray-400 text-[10px]">Broker Fee</span>
                      <span className={`font-semibold ${apt.feeStatus?.toLowerCase().includes("no fee") ? "text-emerald-400" : "text-amber-400"}`}>
                        {apt.feeStatus || "Standard"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-0.5">
                      <span className="text-gray-400 text-[10px]">Lease Term</span>
                      <span className="font-semibold text-white">{apt.leaseTerm || "12 Months"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Highlights */}
              <div className="flex flex-col gap-4">
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-4 flex flex-col gap-2 flex-1">
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" /> Building & Unit Notes
                  </span>
                  <p className="text-gray-300 text-xs leading-relaxed pt-1">
                    {apt.notes || "No additional notes specified for this listing."}
                  </p>
                </div>

                {/* Key In-Unit Perks preview */}
                {apt.perksAndAmenities && apt.perksAndAmenities.length > 0 && (
                  <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5">
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Key Unit Perks
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {apt.perksAndAmenities.slice(0, 4).map((perk, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-200 border border-white/10 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "floorplan" && (
            <div className="flex flex-col gap-4">
              {apt.floorPlanImageUrl ? (
                <div className="bg-white rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center min-h-[380px] shadow-inner relative group/fp">
                  <img 
                    src={apt.floorPlanImageUrl} 
                    alt={`${apt.name} Architectural Floor Plan`} 
                    className="max-h-[380px] w-auto object-contain rounded-lg transition-transform duration-300 group-hover/fp:scale-[1.02]"
                  />
                  <div className="absolute bottom-3 right-3 text-xs bg-black/80 text-white px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                    {apt.floorPlan} • {apt.sqft ? `${apt.sqft} sqft` : "Architectural Layout"}
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-gray-500 text-center">
                  <Layers className="w-12 h-12 opacity-30" />
                  <p className="text-sm font-medium">Floor plan image not available for this unit.</p>
                  <p className="text-xs text-gray-600">Please schedule a tour or inquire directly for layout diagrams.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "amenities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* In-unit */}
              <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> In-Unit Amenities
                </span>
                <div className="flex flex-col gap-2 pt-1">
                  {apt.perksAndAmenities && apt.perksAndAmenities.length > 0 ? (
                    apt.perksAndAmenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">None specified</span>
                  )}
                </div>
              </div>

              {/* Building */}
              <div className="flex flex-col gap-4">
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" /> Building Amenities
                  </span>
                  <div className="flex flex-col gap-2 pt-1">
                    {apt.buildingAmenities && apt.buildingAmenities.length > 0 ? (
                      apt.buildingAmenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">None specified</span>
                    )}
                  </div>
                </div>

                {/* Pet Policy */}
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <PawPrint className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pet Policy</span>
                    <span className="text-xs text-gray-200 font-medium">{apt.petPolicy || "Contact building management"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transit Details */}
              <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <TrainFront className="w-3.5 h-3.5 text-blue-400" /> Public Transit & Commute
                </span>
                <p className="text-xs text-gray-200 leading-relaxed pt-1">
                  {apt.transitDetails || "Convenient access to nearby subway and rail stations."}
                </p>
                <div className="mt-2 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{apt.address}</span>
                </div>
              </div>

              {/* Contact Information with copy buttons */}
              <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                  Direct Inquiries
                </span>
                
                <div className="flex flex-col gap-2.5 pt-1">
                  {apt.contactPhone && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{apt.contactPhone}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(apt.contactPhone!, "phone")}
                        className="text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedField === "phone" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {apt.contactEmail && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 text-xs text-white truncate mr-2">
                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate">{apt.contactEmail}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(apt.contactEmail!, "email")}
                        className="text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                      >
                        {copiedField === "email" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {!apt.contactPhone && !apt.contactEmail && (
                    <span className="text-xs text-gray-500 italic">No direct phone/email specified. Use the tour booking link below.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-white/10 bg-[#141414] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-emerald-400">
              ${apt.netEffectiveRent.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">/mo net</span>
          </div>

          <div className="flex items-center gap-2">
            {apt.appointmentLink && (
              <a 
                href={apt.appointmentLink} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white text-black font-semibold hover:bg-gray-200 transition-all py-2 px-4 rounded-xl flex items-center gap-1.5 text-xs shadow-md cursor-pointer"
              >
                <CalendarClock className="w-3.5 h-3.5" /> Schedule Tour
              </a>
            )}
            {apt.link && (
              <a 
                href={apt.link} 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Listing
              </a>
            )}
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
