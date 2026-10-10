import { useApartmentStore } from "@/store/apartmentStore";
import { useListingView } from "@/store/filterStore";
import SafeImage from "@/components/SafeImage";
import {
  availabilityLabel,
  feeLabel,
  formatRating,
  isNoFee,
  leaseLabel,
  publicNotes,
  usableBookingLink,
  usablePhone,
  usableTransit,
} from "@/lib/listing";
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
  const { today, untrustedFloorPlans, untrustedSqft, untrustedImages } = useListingView();
  const found = apartments.find((a) => a.id === apartmentId);
  // Photos shared with other buildings are not this building (blind QA run 3, F6).
  const apt = found && { ...found, images: (found.images || []).filter((u) => !untrustedImages.has(u)) };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");
  const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(null);
  const [copyFailed, setCopyFailed] = useState<"phone" | "email" | null>(null);

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

  // Scraped placeholders ("N/A", 555 numbers, Wikipedia "tour" links, reused floor plans) are
  // treated as missing instead of shown as facts (blind QA #7; repo rule: no mock data).
  const phone = usablePhone(apt.contactPhone);
  const bookingLink = usableBookingLink(apt.appointmentLink);
  const transit = usableTransit(apt.transitDetails);
  const notes = publicNotes(apt.notes);
  const fee = feeLabel(apt.feeStatus);
  const lease = leaseLabel(apt.leaseTerm);
  const sqft = apt.sqft && !untrustedSqft.has(apt.id) ? apt.sqft : undefined;
  const floorPlanUrl =
    apt.floorPlanImageUrl && !untrustedFloorPlans.has(apt.floorPlanImageUrl) ? apt.floorPlanImageUrl : undefined;
  const floorPlanHidden = Boolean(apt.floorPlanImageUrl) && !floorPlanUrl;

  // Say "Copied!" only when the browser actually accepted the write.
  const copyToClipboard = (text: string, field: "phone" | "email") => {
    const done = (ok: boolean) => {
      setCopiedField(ok ? field : null);
      setCopyFailed(ok ? null : field);
      setTimeout(() => { setCopiedField(null); setCopyFailed(null); }, 2000);
    };
    if (!navigator.clipboard) return done(false);
    navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
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
    { id: "floorplan", label: "Floor Plan", badge: floorPlanUrl ? "Available" : undefined },
    { id: "amenities", label: "Amenities" },
    { id: "transit", label: "Transit & Contact" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel-elevated w-full max-w-3xl rounded-3xl overflow-hidden [@media(max-height:600px)]:overflow-y-auto shadow-2xl flex flex-col max-h-[92dvh] border border-white/10 relative">
        
        {/* Header Hero Section */}
        <div className="h-64 sm:h-72 [@media(max-height:600px)]:h-44 bg-[#0a0a0a] relative border-b border-white/5 overflow-hidden group shrink-0">
          {apt.images && apt.images.length > 0 ? (
            <>
              <SafeImage
                src={apt.images[currentImageIndex]}
                alt={`${apt.name} view`}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-[#0d0d0d]">
                    <Building2 className="w-12 h-12 opacity-30" />
                  </div>
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-black/20" />
              
              {apt.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-16 [@media(max-height:600px)]:hidden p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md z-10 transition-all cursor-pointer"
                    title="Previous photo (←)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-16 [@media(max-height:600px)]:hidden p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md z-10 transition-all cursor-pointer"
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
                  <CalendarDays className="w-3 h-3" /> {availabilityLabel(apt.availability, today)}
                </span>
              )}
              <div className="flex items-center gap-1 ml-auto bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">{formatRating(apt.ranking)}</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md break-words">
              {apt.name}
            </h2>

            <div className="text-gray-300 flex items-center gap-1.5 text-xs drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{apt.address}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-white/10 bg-[#141414] px-3 sm:px-6 gap-x-1 sm:gap-x-2 shrink-0">
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
        <div className="p-4 sm:p-6 overflow-y-auto [@media(max-height:600px)]:overflow-visible flex-1 [@media(max-height:600px)]:flex-none flex flex-col gap-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pricing Breakdown Card */}
              <div className="flex flex-col gap-4">
                <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Pricing Structure</span>
                    {apt.rentMonthsFree > 0 && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                        Active Promotion
                      </span>
                    )}
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
                      <span className={`font-semibold ${sqft ? "text-white" : "text-gray-500"}`}>{sqft ? `${sqft.toLocaleString()} sqft` : "Not specified"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-0.5">
                      <span className="text-gray-400 text-[10px]">Broker Fee</span>
                      <span className={`font-semibold ${isNoFee(apt.feeStatus) ? "text-emerald-400" : fee ? "text-amber-400" : "text-gray-500"}`}>
                        {fee || "Not specified"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-0.5">
                      <span className="text-gray-400 text-[10px]">Lease Term</span>
                      <span className={`font-semibold ${lease ? "text-white" : "text-gray-500"}`}>{lease || "Not specified"}</span>
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
                    {notes || "No additional notes for this listing."}
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
              {floorPlanUrl ? (
                <div className="bg-white rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center min-h-[240px] sm:min-h-[380px] shadow-inner relative group/fp">
                  <SafeImage
                    src={floorPlanUrl}
                    alt={`${apt.name} Architectural Floor Plan`}
                    className="max-h-[380px] w-auto object-contain rounded-lg transition-transform duration-300 group-hover/fp:scale-[1.02]"
                    fallback={<p className="text-sm text-gray-500">Floor plan image could not be loaded.</p>}
                  />
                  <div className="absolute bottom-3 right-3 text-xs bg-black/80 text-white px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                    {apt.floorPlan}{sqft ? ` • ${sqft.toLocaleString()} sqft` : ""}
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-gray-500 text-center">
                  <Layers className="w-12 h-12 opacity-30" />
                  <p className="text-sm font-medium">
                    {floorPlanHidden ? "Floor plan image hidden." : "Floor plan image not available for this unit."}
                  </p>
                  <p className="text-xs text-gray-600 max-w-sm">
                    {floorPlanHidden
                      ? "The listing's image is also used for units with a different number of bedrooms, so it is probably not this unit's plan."
                      : "Ask the building for the layout when you book a tour."}
                  </p>
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
                    <span className={`text-xs font-medium ${apt.petPolicy ? "text-gray-200" : "text-gray-500"}`}>{apt.petPolicy || "Not specified"}</span>
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
                <p className={`text-xs leading-relaxed pt-1 ${transit ? "text-gray-200" : "text-gray-500 italic"}`}>
                  {transit || "Transit details not available for this listing."}
                </p>
                <div className="mt-2 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{apt.address}</span>
                </div>
                {apt.locationUnverified && (
                  <p className="text-[11px] text-amber-300/80">
                    Map location unverified: this address could not be matched to a map position, so it is not shown on the map.
                  </p>
                )}
              </div>

              {/* Contact Information with copy buttons */}
              <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                  Direct Inquiries
                </span>
                
                <div className="flex flex-col gap-2.5 pt-1">
                  {phone && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{phone}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(phone, "phone")}
                        className="text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedField === "phone" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : copyFailed === "phone" ? (
                          <>Copy failed</>
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
                        ) : copyFailed === "email" ? (
                          <>Copy failed</>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {!phone && !apt.contactEmail && (
                    <span className="text-xs text-gray-500 italic">
                      No verified phone or email for this listing.{bookingLink ? " Use Schedule Tour below." : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#141414] flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0 [@media(max-height:600px)]:sticky [@media(max-height:600px)]:bottom-0 z-10">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-emerald-400">
              ${apt.netEffectiveRent.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">/mo net</span>
          </div>

          <div className="flex items-center gap-2">
            {bookingLink && (
              <a
                href={bookingLink}
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
