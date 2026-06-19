import { Link, Outlet, useNavigate } from "react-router-dom";
import { LocationModal } from "./LocationModal";
import { AIChatModal } from "./AIChatModal";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export function Layout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateStoreFromStorage = () => {
      const store = localStorage.getItem("nearestStore");
      if (store) {
        try {
          setStoreName(JSON.parse(store).name);
        } catch (e) {}
      }
    };
    
    updateStoreFromStorage();
    window.addEventListener('storage', updateStoreFromStorage);
    return () => window.removeEventListener('storage', updateStoreFromStorage);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/products`);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col overflow-x-hidden">
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setLocationModalOpen(false)} 
        onStoreFound={(store) => setStoreName(store.name)}
      />
      <nav className={`fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-4 md:px-10 h-16 max-w-full mx-auto transition-shadow ${isScrolled ? 'premium-shadow' : ''}`}>
        <div className="flex items-center gap-8">
          <Link className="font-headline-md text-headline-md font-bold text-primary" to="/">Omnidrop</Link>
          
          <button 
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1 hover:bg-surface-container py-1 px-3 rounded-full transition-colors border border-outline-variant/50"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
            <span className="font-label-md text-on-surface-variant truncate max-w-[150px]">
              {storeName ? storeName : "Select Location"}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
          </button>

          <div className="hidden lg:flex gap-6">
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/products">All Products</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/products?category_slug=organic">Organic</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/products?category_slug=keto">Keto</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/products?category_slug=vegan">Vegan</Link>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="w-full relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <span className="material-symbols-outlined absolute left-3 top-2 text-on-surface-variant">search</span>
          </form>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <span className="muted px-4 py-2">…</span>
          ) : user ? (
            <>
              {user.role === 'seller' && (
                <Link to="/seller" className="font-label-md text-label-md text-primary px-4 py-2 hover:opacity-80 transition-all">Seller Dashboard</Link>
              )}
              {user.role === 'rider' && (
                <Link to="/rider" className="font-label-md text-label-md text-primary px-4 py-2 hover:opacity-80 transition-all">Rider App</Link>
              )}
              {user.role === 'user' && (
                <>
                  <Link to="/cart" className="flex items-center gap-1 font-label-md text-label-md text-primary px-4 py-2 hover:opacity-80 transition-all">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    Cart
                  </Link>
                  <Link to="/orders" className="font-label-md text-label-md text-primary px-4 py-2 hover:opacity-80 transition-all">Orders</Link>
                </>
              )}
              <button onClick={logout} className="font-label-md text-label-md text-primary px-4 py-2 hover:opacity-80 transition-all">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-label-md text-label-md text-primary px-4 py-2 hover:opacity-80 transition-all">Log In</Link>
              <Link to="/register" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      
      <main className="pt-16 flex-1">
        <Outlet />
      </main>

      <footer className="w-full py-stack-lg px-margin-desktop bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-gutter mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link className="font-headline-md text-headline-md font-bold text-primary mb-6 block" to="/">Omnidrop</Link>
            <p className="text-on-surface-variant text-label-md max-w-xs">Your personal health boutique, delivered with the speed of light. Pure, reliable, and always fresh.</p>
          </div>
          <div>
            <h5 className="font-label-md text-on-surface mb-6 uppercase tracking-widest text-xs">Shop</h5>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-md" href="#">Organic</a></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-md" href="#">Keto</a></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-md" href="#">Vegan</a></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-md" href="#">Gluten-Free</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-md text-on-surface mb-6 uppercase tracking-widest text-xs">Company</h5>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-md" href="#">Help Center</a></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-md" href="#">Privacy Policy</a></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-md" href="#">Terms of Service</a></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-md" href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-md text-on-surface mb-6 uppercase tracking-widest text-xs">Follow Us</h5>
            <div className="flex gap-4">
              <a className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-outline-variant" href="#">
                <span className="material-symbols-outlined text-sm">public</span>
              </a>
              <a className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-outline-variant" href="#">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </a>
              <a className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-outline-variant" href="#">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-container-max mx-auto pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-label-sm text-on-surface-variant">© 2024 Omnidrop. Your wellness, delivered fast.</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            <span className="text-label-sm text-on-surface-variant">Secure, HIPAA-Compliant Logistics</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Omni AI */}
      <button 
        onClick={() => setChatModalOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 flex items-center justify-center ${isChatModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
      </button>

      {/* Omni AI Chat Modal */}
      <AIChatModal isOpen={isChatModalOpen} onClose={() => setChatModalOpen(false)} />

    </div>
  );
}
