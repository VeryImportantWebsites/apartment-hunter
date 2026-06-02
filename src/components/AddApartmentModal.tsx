"use client";

import { useState } from "react";
import { useApartmentStore, FloorPlan } from "@/store/apartmentStore";
import { X } from "lucide-react";

export default function AddApartmentModal({ onClose }: { onClose: () => void }) {
  const { addApartment } = useApartmentStore();
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("40.7447");
  const [lng, setLng] = useState("-73.9485");
  const [floorPlan, setFloorPlan] = useState<FloorPlan>("1B");
  const [rentBase, setRentBase] = useState("");
  const [rentMonthsFree, setRentMonthsFree] = useState("0");
  const [ranking, setRanking] = useState("3");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addApartment({
      name,
      address,
      coordinates: [parseFloat(lat), parseFloat(lng)],
      floorPlan,
      rentBase: parseFloat(rentBase),
      rentMonthsFree: parseFloat(rentMonthsFree),
      perksAndAmenities: [], // Can be expanded later
      ranking: parseInt(ranking),
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Add Apartment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Name</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. Jackson Park" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Address</label>
            <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="e.g. 28-10 Jackson Ave" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Latitude</label>
              <input required type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Longitude</label>
              <input required type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Floor Plan</label>
              <select value={floorPlan} onChange={(e) => setFloorPlan(e.target.value as FloorPlan)} className="w-full premium-input rounded-lg px-3 py-2 text-sm appearance-none">
                <option value="Studio">Studio</option>
                <option value="1B">1B</option>
                <option value="2B">2B</option>
                <option value="3B">3B</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Rating (1-5)</label>
              <input required type="number" min="1" max="5" value={ranking} onChange={(e) => setRanking(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Base Rent ($)</label>
              <input required type="number" value={rentBase} onChange={(e) => setRentBase(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="4000" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Months Free</label>
              <input required type="number" step="0.1" value={rentMonthsFree} onChange={(e) => setRentMonthsFree(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm" placeholder="1.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full premium-input rounded-lg px-3 py-2 text-sm h-20 resize-none" placeholder="Pros and cons..." />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2 rounded-xl text-sm">Save Apartment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
