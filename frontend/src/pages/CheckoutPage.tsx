import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, ApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import type { Cart } from "../types";

function formatPrice(price: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

export function CheckoutPage() {
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<string | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!token) return;
    api.cart(token).then(setCart).catch(() => setError("Could not load cart"));
    
    // Fetch AI Delivery Estimate
    const storeJson = localStorage.getItem("nearestStore");
    if (storeJson) {
      try {
        const store = JSON.parse(storeJson);
        setEstimateLoading(true);
        // Fallback to slight offset of store location if geolocation fails
        const fallbackLat = parseFloat(store.latitude) + 0.015;
        const fallbackLng = parseFloat(store.longitude) + 0.015;
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              api.getAiDeliveryEstimate(store.id, position.coords.latitude, position.coords.longitude)
                .then(res => setAiEstimate(res.estimate_text))
                .catch(err => console.error("AI Estimate Error:", err))
                .finally(() => setEstimateLoading(false));
            },
            () => {
              api.getAiDeliveryEstimate(store.id, fallbackLat, fallbackLng)
                .then(res => setAiEstimate(res.estimate_text))
                .catch(err => console.error("AI Estimate Error:", err))
                .finally(() => setEstimateLoading(false));
            }
          );
        } else {
          api.getAiDeliveryEstimate(store.id, fallbackLat, fallbackLng)
            .then(res => setAiEstimate(res.estimate_text))
            .catch(err => console.error("AI Estimate Error:", err))
            .finally(() => setEstimateLoading(false));
        }
      } catch (e) {
        console.error("Failed to parse store for estimate", e);
      }
    }
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError("");
    try {
      const order = await api.checkout(token, address);
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !cart) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-20 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-label-lg text-on-surface-variant">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-20 text-center">
        <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">shopping_bag</span>
        </div>
        <h1 className="text-display-sm font-bold text-on-surface mb-4">Your cart is empty</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">Add some items before checking out.</p>
        <Link to="/products" className="inline-flex bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg hover:bg-primary/90 transition-all">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-display-sm-mobile md:text-display-sm font-bold text-on-surface">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7 bg-surface rounded-3xl border border-outline-variant p-8 shadow-sm">
          <h2 className="text-headline-sm font-bold text-on-surface mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm">1</span>
            Shipping Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2">Delivery Address</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-surface-container-lowest resize-none font-body-md"
                rows={4}
                required
                minLength={10}
                placeholder="Street, city, state, ZIP, country"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="h-px bg-outline-variant w-full my-8"></div>

            <h2 className="text-headline-sm font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm">2</span>
              Payment Method
            </h2>

            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant">
              <div className="flex items-center gap-4 mb-2">
                <span className="material-symbols-outlined text-primary text-[32px]">credit_card</span>
                <span className="font-label-lg text-on-surface">Simulated Payment</span>
              </div>
              <p className="text-body-md text-on-surface-variant">No real payment required. Your order will be instantly marked as paid for demonstration purposes.</p>
            </div>

            {error && (
              <div className="bg-error/10 text-error p-4 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <span className="font-label-md">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary py-4 rounded-full font-label-lg font-bold hover:bg-primary/90 transition-all hover:shadow-md disabled:opacity-70 flex items-center justify-center gap-2 mt-8"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Processing Order...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">lock</span>
                  Pay {formatPrice(cart.subtotal)}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary & AI Estimate */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface rounded-3xl border border-outline-variant p-6 shadow-sm">
            <h2 className="text-headline-sm font-bold text-on-surface mb-6">Order Summary</h2>
            
            <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.items.map(item => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-center p-1 shrink-0">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                      <span className="material-symbols-outlined text-outline-variant">image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-label-md text-on-surface line-clamp-2">{item.product.name}</h3>
                    <p className="text-label-sm text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-label-md text-on-surface font-bold text-right shrink-0">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="h-px bg-outline-variant w-full mb-4"></div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Delivery</span>
                <span className="text-primary font-medium">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-end bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
              <span className="text-headline-sm font-bold text-on-surface">Total</span>
              <span className="text-display-sm-mobile font-bold text-primary">{formatPrice(cart.subtotal)}</span>
            </div>
          </div>

          <div className="bg-primary-container text-on-primary-container p-6 rounded-3xl border border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex gap-4 relative z-10">
               <span className="material-symbols-outlined shrink-0 text-[32px] text-primary">smart_toy</span>
               <div>
                 <p className="font-label-md uppercase tracking-widest text-xs mb-2 opacity-80 font-bold">AI Delivery Estimate</p>
                 {estimateLoading ? (
                   <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                     <span className="font-body-md">Google GenAI is calculating...</span>
                   </div>
                 ) : (
                   <p className="font-body-md leading-relaxed">{aiEstimate || "Delivery estimates currently unavailable."}</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
