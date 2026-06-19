import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function getStatusColor(status: string) {
  switch(status.toLowerCase()) {
    case 'delivered': return 'bg-success/20 text-success border-success/30';
    case 'processing': return 'bg-secondary-container text-on-secondary-container border-secondary/30';
    case 'out for delivery': return 'bg-primary-container text-on-primary-container border-primary/30';
    case 'cancelled': return 'bg-error/20 text-error border-error/30';
    default: return 'bg-surface-variant text-on-surface-variant border-outline';
  }
}

export function OrdersPage() {
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!token) return;
    api
      .orders(token)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [token]);

  if (authLoading || loading) {
    return (
      <div className="bg-background min-h-screen pt-24 pb-12 flex justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 font-body-md">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-4xl">
        <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-6">
          <div>
            <h1 className="font-headline-lg text-on-surface">Your Orders</h1>
            <p className="text-on-surface-variant font-label-md mt-1">{user?.full_name}'s Order History</p>
          </div>
          <Link to="/" className="btn btn-primary rounded-full px-6 py-2 bg-primary text-on-primary font-label-md hover:bg-primary/90 transition-all">
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface-container-low rounded-2xl p-12 text-center border border-outline-variant">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">inventory_2</span>
            <h2 className="font-headline-md text-on-surface mb-2">No orders yet</h2>
            <p className="text-on-surface-variant mb-6">Looks like you haven't placed an order recently.</p>
            <Link to="/" className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:opacity-90 transition-all inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <Link to={`/orders/${o.id}`} key={o.id} className="block group">
                <div className="bg-surface rounded-2xl border border-outline-variant p-6 hover:shadow-lg hover:border-primary/50 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-outline-variant/50">
                    <div>
                      <h3 className="font-headline-sm text-on-surface">Order #{o.id}</h3>
                      <p className="text-label-sm text-on-surface-variant mt-1">{formatDate(o.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <p className="font-headline-sm text-on-surface font-bold">{formatPrice(o.total)}</p>
                      <span className={`px-3 py-1 rounded-full font-label-sm uppercase tracking-wider border ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {o.items.map(item => (
                      <div key={item.id} className="w-16 h-16 shrink-0 rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden p-2 flex items-center justify-center relative">
                        {item.product.image_url ? (
                          <img src={item.product.image_url} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="material-symbols-outlined text-outline-variant text-sm">image</span>
                        )}
                        {item.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {o.items.length === 0 && (
                       <span className="text-label-sm text-on-surface-variant italic">No items found</span>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 flex justify-between items-center text-primary font-label-md group-hover:text-secondary transition-colors">
                    <span>View Order Details</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
