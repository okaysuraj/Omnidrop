import { useCallback, useEffect, useState } from "react";
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

export function CartPage() {
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.cart(token);
      setCart(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/cart" } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateQty(itemId: number, quantity: number) {
    if (!token) return;
    try {
      await api.updateCartItem(token, itemId, quantity);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  async function remove(itemId: number) {
    if (!token) return;
    await api.removeCartItem(token, itemId);
    await load();
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-20 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-label-lg text-on-surface-variant">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-20">
        <div className="bg-surface-container-low rounded-3xl p-16 text-center border border-outline-variant max-w-2xl mx-auto shadow-sm">
          <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[48px] text-primary">shopping_cart</span>
          </div>
          <h1 className="text-display-sm font-bold text-on-surface mb-4">Your cart is empty</h1>
          <p className="text-body-lg text-on-surface-variant mb-8">Looks like you haven't added anything to your cart yet. Discover our fresh groceries and wellness products!</p>
          <Link to="/products" className="inline-flex bg-primary text-on-primary px-8 py-4 rounded-full font-label-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-md">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-6 py-12">
      <h1 className="text-display-sm-mobile md:text-display-sm font-bold text-on-surface mb-8">Shopping Cart</h1>
      
      {error && (
        <div className="bg-error/10 text-error p-4 rounded-xl flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined">error</span>
          <span className="font-label-md flex-1">{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 bg-surface rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-4 bg-surface-container-low p-4 border-b border-outline-variant text-label-sm text-on-surface-variant uppercase tracking-wider">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
          
          <ul className="divide-y divide-outline-variant">
            {cart.items.map((item) => (
              <li key={item.id} className="p-4 sm:p-6 hover:bg-surface-container-lowest transition-colors">
                <div className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center">
                  
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <div className="w-24 h-24 shrink-0 bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden flex items-center justify-center p-2">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <span className="material-symbols-outlined text-outline-variant text-4xl">image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link to={`/products/${item.product.slug}`} className="text-headline-sm font-bold text-on-surface hover:text-primary transition-colors line-clamp-2 mb-1">
                        {item.product.name}
                      </Link>
                      <p className="text-body-md text-on-surface-variant">{formatPrice(item.product.price)} each</p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-3 flex justify-between md:justify-center items-center w-full md:w-auto">
                    <span className="md:hidden text-label-md text-on-surface-variant">Quantity</span>
                    <div className="flex items-center bg-surface border border-outline-variant rounded-full p-1 shadow-sm">
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
                        onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="font-label-lg text-on-surface w-8 text-center">{item.quantity}</span>
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-3 flex justify-between md:justify-end items-center w-full md:w-auto">
                    <span className="md:hidden text-label-md text-on-surface-variant">Total</span>
                    <div className="flex items-center gap-4">
                      <p className="text-headline-sm font-bold text-on-surface">
                        {formatPrice(Number(item.product.price) * item.quantity)}
                      </p>
                      <button
                        onClick={() => remove(item.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                  
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3 bg-surface rounded-3xl border border-outline-variant p-6 shadow-sm sticky top-24">
          <h2 className="text-headline-md font-bold text-on-surface mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-body-lg text-on-surface-variant">
              <span>Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
              <span className="font-medium text-on-surface">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-body-lg text-on-surface-variant">
              <span>Delivery Fee</span>
              <span className="font-medium text-primary">Calculated at checkout</span>
            </div>
          </div>

          <div className="h-px bg-outline-variant w-full mb-6"></div>

          <div className="flex justify-between items-end mb-8">
            <span className="text-headline-sm font-bold text-on-surface">Estimated Total</span>
            <span className="text-display-sm-mobile font-bold text-primary">{formatPrice(cart.subtotal)}</span>
          </div>

          <Link
            to="/checkout"
            className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-4 rounded-full font-label-lg font-bold hover:bg-primary/90 transition-all hover:shadow-md"
          >
            Proceed to Checkout
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>

          <div className="mt-6 flex items-center justify-center gap-2 text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Secure encrypted checkout
          </div>
        </div>
      </div>
    </div>
  );
}
