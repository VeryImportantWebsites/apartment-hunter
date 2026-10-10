"use client";

import { useState } from "react";
import { useApartmentStore, FloorPlan } from "@/store/apartmentStore";
import { X } from "lucide-react";

export default function AddApartmentModal({ onClose, editingId }: { onClose: () => void, editingId?: string | null }) {
  const { addApartment, updateApartment, apartments } = useApartmentStore();
  
  // The modal mounts fresh on every open, so seed the fields from the listing being edited.
  // (Copying them in an effect re-ran whenever the store changed and could wipe typed edits.)
  const editing = editingId ? apartments.find((a) => a.id === editingId) : undefined;

  const [name, setName] = useState(editing?.name ?? "");
  const [address, setAddress] = useState(editing?.address ?? "");
  const [lat, setLat] = useState(editing ? editing.coordinates[0].toString() : "40.7447");
  const [lng, setLng] = useState(editing ? editing.coordinates[1].toString() : "-73.9485");
  const [floorPlan, setFloorPlan] = useState<FloorPlan>(editing?.floorPlan ?? "1B");
  const [floorPlanImageUrl, setFloorPlanImageUrl] = useState(editing?.floorPlanImageUrl ?? "");
  const [rentBase, setRentBase] = useState(editing ? editing.rentBase.toString() : "");
  const [rentMonthsFree, setRentMonthsFree] = useState(editing ? editing.rentMonthsFree.toString() : "0");
  const [ranking, setRanking] = useState(editing ? editing.ranking.toString() : "3");
  const [notes, setNotes] = useState(editing?.notes ?? "");

  const [sqft, setSqft] = useState(editing?.sqft?.toString() ?? "");
  const [petPolicy, setPetPolicy] = useState(editing?.petPolicy ?? "");
  const [feeStatus, setFeeStatus] = useState(editing?.feeStatus ?? "");
  const [availability, setAvailability] = useState(editing?.availability ?? "");
  const [contactPhone, setContactPhone] = useState(editing?.contactPhone ?? "");
  const [contactEmail, setContactEmail] = useState(editing?.contactEmail ?? "");
  const [appointmentLink, setAppointmentLink] = useState(editing?.appointmentLink ?? "");
  const [transitDetails, setTransitDetails] = useState(editing?.transitDetails ?? "");
  const [leaseTerm, setLeaseTerm] = useState(editing?.leaseTerm ?? "");
  const [source, setSource] = useState(editing?.source ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      address,
      coordinates: [parseFloat(lat), parseFloat(lng)] as [number, number],
      floorPlan,
      floorPlanImageUrl,
      rentBase: parseFloat(rentBase),
      rentMonthsFree: parseFloat(rentMonthsFree),
      ranking: parseInt(ranking),
      notes,
      sqft: sqft ? parseInt(sqft) : undefined,
      petPolicy,
      feeStatus,
      availability,
      contactPhone,
      contactEmail,
      appointmentLink,
      transitDetails,
      leaseTerm,
      source,
    };

    if (editingId) {
      updateApartment(editingId, payload);
    } else {
      addApartment({ ...payload, perksAndAmenities: [], buildingAmenities: [] });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-24">
      <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#050505] sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-white">{editingId ? "Edit Apartment" : "Add Apartment"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Name</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. Jackson Park" />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Address</label>
            <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. 28-10 Jackson Ave" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Latitude</label>
            <input required type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Longitude</label>
            <input required type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Floor Plan</label>
            <input required type="text" value={floorPlan} onChange={(e) => setFloorPlan(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. 1B, Loft" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Rating (1-5)</label>
            <input required type="number" min="1" max="5" value={ranking} onChange={(e) => setRanking(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Base Rent ($)</label>
            <input required type="number" value={rentBase} onChange={(e) => setRentBase(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="4000" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Months Free</label>
            <input required type="number" step="0.1" value={rentMonthsFree} onChange={(e) => setRentMonthsFree(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="1.5" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Sqft</label>
            <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. 750" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Fee Status</label>
            <input type="text" value={feeStatus} onChange={(e) => setFeeStatus(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. No Fee, 15%" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Availability</label>
            <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. Available Now" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Lease Term</label>
            <input type="text" value={leaseTerm} onChange={(e) => setLeaseTerm(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. 12 months" />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Pet Policy</label>
            <input type="text" value={petPolicy} onChange={(e) => setPetPolicy(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. Dogs and Cats allowed" />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Transit Details</label>
            <input type="text" value={transitDetails} onChange={(e) => setTransitDetails(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. 5 min walk to E train" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Contact Phone</label>
            <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. 212-555-0198" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Contact Email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="leasing@building.com" />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Appointment Link</label>
            <input type="url" value={appointmentLink} onChange={(e) => setAppointmentLink(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="https://calendly.com/..." />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Floor Plan Image URL</label>
            <input type="url" value={floorPlanImageUrl} onChange={(e) => setFloorPlanImageUrl(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="https://...image.jpg" />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Listing Source</label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. StreetEasy, Zillow" />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm h-20 resize-none" placeholder="Pros and cons..." />
          </div>

          <div className="col-span-2 pt-4 flex justify-end gap-3 sticky bottom-0 bg-[#050505] p-4 border-t border-white/5 -mx-6 -mb-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2 rounded-xl text-sm">Save Apartment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
