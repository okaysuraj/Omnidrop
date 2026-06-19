import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import type { Order } from "../types";

function formatPrice(price: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

const STATUS_STEPS = ["Pending", "Processing", "Out for Delivery", "Delivered"];

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  const fetchOrder = () => {
    if (!token || !id) return;
    api.order(token, Number(id))
      .then(setOrder)
      .catch((e) => {
        if (!order) setError("Could not load order details");
      });
  };

  useEffect(() => {
    fetchOrder();
    
    // Auto-polling every 5 seconds for Live Order Tracking
    const intervalId = setInterval(() => {
      fetchOrder();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token, id]);

  if (!order && !error) {
    return (
      <div className="bg-background min-h-screen pt-24 flex justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-background min-h-screen pt-24 pb-12 font-body-md text-center">
        <h1 className="font-headline-md text-error mb-4">Error</h1>
        <p className="text-on-surface-variant mb-6">{error || "Order not found"}</p>
        <Link to="/orders" className="text-primary hover:underline">← Back to Orders</Link>
      </div>
    );
  }

  // Determine current step index
  let currentStepIndex = STATUS_STEPS.indexOf(order.status);
  if (currentStepIndex === -1 && order.status === "Cancelled") currentStepIndex = -2;

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 font-body-md">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-3xl">
        
        <Link to="/orders" className="inline-flex items-center gap-2 text-primary font-label-md hover:text-secondary mb-6 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-outline-variant pb-6">
          <div>
            <h1 className="font-headline-lg text-on-surface">Order #{order.id}</h1>
            <p className="text-on-surface-variant font-label-md mt-1">{formatDate(order.created_at)}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">Total Amount</p>
            <p className="font-headline-md font-bold text-primary">{formatPrice(order.total)}</p>
          </div>
        </div>

        {/* Live Order Tracking UI */}
        <div className="bg-surface rounded-3xl p-6 md:p-10 border border-outline-variant shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">local_shipping</span>
            <h2 className="font-headline-md text-on-surface">Live Tracking</h2>
            {order.status === "Cancelled" && (
              <span className="ml-auto bg-error/20 text-error px-4 py-1 rounded-full font-label-sm uppercase tracking-wider border border-error/30">
                Cancelled
              </span>
            )}
          </div>

          {order.status !== "Cancelled" && (
            <div className="relative">
              {/* Stepper Line Background */}
              <div className="absolute top-[24px] left-[10%] right-[10%] h-1 bg-surface-variant rounded-full"></div>
              
              {/* Active Stepper Line */}
              <div 
                className="absolute top-[24px] left-[10%] h-1 bg-primary rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 80)}%` }}
              ></div>

              <div className="relative z-10 flex justify-between">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isActive = index === currentStepIndex;
                  const isPending = index > currentStepIndex;
                  
                  return (
                    <div key={step} className="flex flex-col items-center w-1/4">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 mb-3 bg-surface ${
                          isCompleted ? 'border-primary text-primary' : 
                          isActive ? 'border-primary bg-primary text-on-primary ring-4 ring-primary/20 scale-110 shadow-lg' : 
                          'border-outline-variant text-on-surface-variant'
                        }`}
                      >
                        {isCompleted ? (
                          <span className="material-symbols-outlined font-bold text-[24px]">check</span>
                        ) : isActive ? (
                          <span className="material-symbols-outlined text-[24px] animate-pulse">
                            {index === 0 ? 'schedule' : index === 1 ? 'inventory_2' : index === 2 ? 'two_wheeler' : 'home'}
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[24px]">
                            {index === 0 ? 'schedule' : index === 1 ? 'inventory_2' : index === 2 ? 'two_wheeler' : 'home'}
                          </span>
                        )}
                      </div>
                      <p className={`font-label-md text-center hidden sm:block ${isActive ? 'text-primary font-bold' : isCompleted ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {step}
                      </p>
                      <p className={`font-label-sm text-center sm:hidden text-[10px] ${isActive ? 'text-primary font-bold' : isCompleted ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {step.split(' ').map(w => w[0]).join('')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-headline-sm text-on-surface mb-4">Items in this Order</h3>
            <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
              <ul className="divide-y divide-outline-variant">
                {order.items.map((item) => (
                  <li key={item.id} className="p-4 flex items-center gap-4 hover:bg-surface-container-lowest transition-colors">
                    <div className="w-16 h-16 shrink-0 rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden p-2 flex items-center justify-center">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="material-symbols-outlined text-outline-variant text-sm">image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-on-surface truncate">{item.product.name}</p>
                      <p className="text-label-sm text-on-surface-variant mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-label-md text-on-surface">{formatPrice(item.unit_price)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-headline-sm text-on-surface mb-4">Delivery Details</h3>
            <div className="bg-surface rounded-2xl border border-outline-variant p-6 space-y-6">
              <div>
                <p className="font-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Shipping Address</p>
                <div className="flex gap-3 text-on-surface font-body-md items-start">
                  <span className="material-symbols-outlined text-primary shrink-0 mt-0.5 text-[20px]">location_on</span>
                  <p>{order.shipping_address}</p>
                </div>
              </div>
              
              <div className="border-t border-outline-variant pt-6">
                <p className="font-label-sm uppercase tracking-widest text-on-surface-variant mb-4">Summary</p>
                <div className="space-y-3 font-body-md">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Delivery Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-outline-variant/50 pt-3 flex justify-between font-bold text-on-surface font-headline-sm">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
