import { useState } from "react";

export interface DarkStore {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreFound?: (store: DarkStore) => void;
}

export function LocationModal({ isOpen, onClose, onStoreFound }: LocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pincode, setPincode] = useState("");

  const handleLocate = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`http://localhost:8000/api/stores/nearest?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
          if (!res.ok) throw new Error("No stores found nearby");
          const store: DarkStore = await res.json();
          localStorage.setItem("nearestStore", JSON.stringify(store));
          window.dispatchEvent(new Event("storage"));
          if (onStoreFound) onStoreFound(store);
          onClose();
        } catch (err: any) {
          setError(err.message || "Failed to find a store");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length < 5) {
      setError("Please enter a valid pincode.");
      return;
    }
    // Mocking pincode lookup success
    const mockStore: DarkStore = {
      id: 99,
      name: "Omnidrop Hub - " + pincode,
      address: "Pincode Area " + pincode,
      latitude: 0,
      longitude: 0,
    };
    localStorage.setItem("nearestStore", JSON.stringify(mockStore));
    window.dispatchEvent(new Event("storage"));
    if (onStoreFound) onStoreFound(mockStore);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-2xl text-center border border-outline-variant relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="material-symbols-outlined text-5xl text-primary mb-4">
          location_on
        </span>
        <h2 className="text-headline-lg-mobile font-bold text-on-surface mb-3">Find Your Local Store</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          To get your items delivered in minutes, we need to know your location.
        </p>
        
        {error && <p className="text-error mb-4 text-sm font-medium">{error}</p>}

        <button
          onClick={handleLocate}
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 px-6 rounded-full font-label-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 mb-6"
        >
          {loading ? (
             <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          )}
          {loading ? "Locating..." : "Share Current Location"}
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-outline-variant w-full"></div>
          <span className="absolute bg-surface px-4 font-label-sm text-on-surface-variant uppercase tracking-widest">Or</span>
        </div>

        <form onSubmit={handlePincodeSubmit} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter Pincode" 
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-all bg-white"
          />
          <button type="submit" className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-label-md hover:bg-surface-container-highest transition-colors">
            Check
          </button>
        </form>
      </div>
    </div>
  );
}
