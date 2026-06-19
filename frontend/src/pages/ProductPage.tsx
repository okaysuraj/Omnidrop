import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api, ApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";

function formatPrice(price: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [storeId, setStoreId] = useState<number | undefined>();

  useEffect(() => {
    const store = localStorage.getItem("nearestStore");
    if (store) {
      try {
        setStoreId(JSON.parse(store).id);
      } catch (e) {}
    }
    
    const handleStorageChange = () => {
      const updatedStore = localStorage.getItem("nearestStore");
      if (updatedStore) {
        try {
          setStoreId(JSON.parse(updatedStore).id);
        } catch (e) {}
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!slug) return;
    api
      .productBySlug(slug, storeId)
      .then(setProduct)
      .catch(() => setError("Product not found"));
  }, [slug, storeId]);

  async function handleAdd() {
    if (!token) {
      setMessage("");
      setError("Please sign in to add items to your cart.");
      return;
    }
    if (!product) return;
    setAdding(true);
    setError("");
    setMessage("");
    try {
      await api.addToCart(token, { product_id: product.id, quantity: qty });
      setMessage("Added to cart!");
      window.dispatchEvent(new Event("cart_updated"));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not add to cart");
    } finally {
      setAdding(false);
    }
  }

  if (error && !product) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-20 text-center">
        <span className="material-symbols-outlined text-[64px] text-error mb-4">error</span>
        <h1 className="text-headline-lg font-bold text-on-surface mb-4">Oops!</h1>
        <p className="text-body-lg text-error mb-8">{error}</p>
        <button onClick={() => navigate('/products')} className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg hover:bg-primary/90 transition-colors">
          Browse Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-20 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-label-lg text-on-surface-variant">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-6 py-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/products')} 
        className="flex items-center gap-2 text-primary font-label-md hover:underline mb-8 group"
      >
        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-surface rounded-3xl p-8 border border-outline-variant shadow-sm relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Product Image */}
        <div className="aspect-square bg-surface-container-lowest rounded-2xl flex items-center justify-center overflow-hidden border border-outline-variant/50 relative group">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-center text-on-surface-variant opacity-50">
              <span className="material-symbols-outlined text-[64px] mb-2 block">image_not_supported</span>
              <p className="font-label-md">No image available</p>
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="bg-error text-on-error px-6 py-2 rounded-full font-label-lg uppercase tracking-widest font-bold shadow-lg transform -rotate-12">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center relative z-10">
          {product.category && (
            <span className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm uppercase tracking-wider mb-4 w-fit">
              {product.category.name}
            </span>
          )}
          
          <h1 className="text-display-sm-mobile md:text-display-sm font-bold text-on-surface mb-2">{product.name}</h1>
          <p className="text-headline-lg font-bold text-primary mb-6">{formatPrice(product.price)}</p>
          
          <div className="w-12 h-1 bg-outline-variant mb-6 rounded-full"></div>
          
          <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
            {product.description || "No description provided for this item."}
          </p>

          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className={`material-symbols-outlined ${product.stock > 0 ? 'text-primary' : 'text-error'}`}>
                {product.stock > 0 ? 'inventory_2' : 'warning'}
              </span>
              <span className={`font-label-md ${product.stock > 0 ? 'text-on-surface' : 'text-error font-bold'}`}>
                {product.stock > 0 ? `${product.stock} items available in your nearest store` : 'Currently unavailable in your area'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-auto">
                  <label className="block text-label-sm text-on-surface-variant mb-2">Quantity</label>
                  <div className="flex items-center bg-surface border border-outline-variant rounded-full p-1 w-full sm:w-32 justify-between">
                    <button 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-50"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1 || adding}
                    >
                      <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <span className="font-label-lg text-on-surface w-8 text-center">{qty}</span>
                    <button 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-50"
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      disabled={qty >= product.stock || adding}
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex-1 bg-primary text-on-primary h-14 rounded-full font-label-lg font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                    {adding ? 'hourglass_empty' : 'shopping_bag'}
                  </span>
                  {adding ? "Adding to Cart..." : `Add to Cart - ${formatPrice((Number(product.price) * qty).toString())}`}
                </button>
              </div>
            )}
          </div>

          {message && (
            <div className="bg-primary-container text-on-primary-container p-4 rounded-xl flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="font-label-md flex-1">{message}</span>
              <Link to="/cart" className="font-bold underline hover:opacity-80">View Cart</Link>
            </div>
          )}
          
          {error && (
            <div className="bg-error/10 text-error p-4 rounded-xl flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined">error</span>
              <span className="font-label-md flex-1">
                {error}
                {!user && <Link to="/login" className="font-bold underline ml-2">Sign in here</Link>}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
