import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function formatPrice(price: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RiderDashboard() {
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"available" | "active">("available");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "rider") {
        navigate("/");
      }
    }
  }, [authLoading, user, navigate]);

  const loadOrders = () => {
    if (!token) return;
    setLoading(true);
    api.getRiderOrders(token)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // Auto-poll for new orders
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleAccept = async (orderId: number) => {
    if (!token) return;
    setActionLoading(orderId);
    try {
      await api.acceptRiderOrder(token, orderId);
      loadOrders();
      setActiveTab("active");
    } catch (e) {
      console.error(e);
      alert("Failed to accept order");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeliver = async (orderId: number) => {
    if (!token) return;
    setActionLoading(orderId);
    try {
      await api.deliverRiderOrder(token, orderId);
      loadOrders();
    } catch (e) {
      console.error(e);
      alert("Failed to mark delivered");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="bg-background min-h-screen pt-24 pb-12 flex justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
      </div>
    );
  }

  const availableOrders = orders.filter((o) => o.status === "paid");
  const activeOrders = orders.filter((o) => o.status === "shipped");

  const displayOrders = activeTab === "available" ? availableOrders : activeOrders;

  return (
    <div className="bg-surface-container-lowest min-h-screen pt-16 font-body-md">
      {/* Mobile-optimized Header */}
      <div className="bg-primary text-on-primary p-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-headline-md font-bold">Rider App</h1>
          <div className="w-10 h-10 bg-on-primary/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">two_wheeler</span>
          </div>
        </div>
        <p className="font-label-md opacity-90 mb-1">Welcome back,</p>
        <p className="font-headline-sm font-bold">{user?.full_name}</p>
        
        {/* Dashboard Stats */}
        <div className="flex gap-4 mt-6">
          <div className="bg-on-primary/10 rounded-2xl p-4 flex-1">
            <p className="font-label-sm uppercase tracking-wider opacity-80 mb-1">Active</p>
            <p className="font-headline-md font-bold">{activeOrders.length}</p>
          </div>
          <div className="bg-on-primary/10 rounded-2xl p-4 flex-1">
            <p className="font-label-sm uppercase tracking-wider opacity-80 mb-1">Available</p>
            <p className="font-headline-md font-bold">{availableOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-4 gap-2 mt-2">
        <button 
          onClick={() => setActiveTab("available")}
          className={`flex-1 py-3 rounded-full font-label-md transition-all ${activeTab === "available" ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}
        >
          New Requests
        </button>
        <button 
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-3 rounded-full font-label-md transition-all ${activeTab === "active" ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}
        >
          My Deliveries
        </button>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4 pb-24">
        {displayOrders.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">check_circle</span>
            <p className="font-headline-sm text-on-surface mb-2">No {activeTab} orders</p>
            <p className="text-on-surface-variant font-body-md">You're all caught up!</p>
          </div>
        ) : (
          displayOrders.map((order) => (
            <div key={order.id} className="bg-surface rounded-3xl p-5 shadow-sm border border-outline-variant">
              <div className="flex justify-between items-start mb-4 border-b border-outline-variant/50 pb-4">
                <div>
                  <p className="font-headline-sm font-bold text-on-surface">Order #{order.id}</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">{order.item_count} items</p>
                </div>
                <div className="text-right">
                  <p className="font-label-sm uppercase tracking-widest text-on-surface-variant mb-1">Time</p>
                  <p className="font-headline-sm font-bold text-primary">{formatDate(order.created_at)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="font-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Dropoff Address</p>
                <div className="flex items-start gap-3 bg-surface-container-low p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary shrink-0">location_on</span>
                  <p className="font-body-md text-on-surface font-medium">{order.shipping_address}</p>
                </div>
              </div>

              {activeTab === "available" ? (
                <button
                  onClick={() => handleAccept(order.id)}
                  disabled={actionLoading === order.id}
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-label-lg font-bold hover:bg-primary/90 transition-all flex justify-center items-center gap-2"
                >
                  {actionLoading === order.id ? (
                     <span className="material-symbols-outlined animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined">directions_bike</span>
                  )}
                  Accept Delivery
                </button>
              ) : (
                <button
                  onClick={() => handleDeliver(order.id)}
                  disabled={actionLoading === order.id}
                  className="w-full bg-success text-on-primary py-4 rounded-2xl font-label-lg font-bold hover:bg-success/90 transition-all flex justify-center items-center gap-2"
                >
                  {actionLoading === order.id ? (
                     <span className="material-symbols-outlined animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined">home</span>
                  )}
                  Mark as Delivered
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
