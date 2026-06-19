import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import type { Product, Category } from "../types";

export function SellerDashboard() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Inventory Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Orders Data
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Settings / Store Inventory Data
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [storeInventory, setStoreInventory] = useState<any[]>([]);
  const [storeInventoryLoading, setStoreInventoryLoading] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: ""
  });

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "seller") {
        navigate("/");
      } else if (token) {
        // Fetch Dashboard Data
        api.getSellerDashboard(token)
          .then(data => {
            setDashboardData(data);
            setDataLoading(false);
          })
          .catch(err => {
            console.error(err);
            setDataLoading(false);
          });
        
        // Fetch Categories for modal
        api.categories().then(setCategories).catch(console.error);
      }
    }
  }, [user, loading, navigate, token]);

  useEffect(() => {
    if (activeTab === "inventory" && token) {
      setInventoryLoading(true);
      api.getSellerProducts(token)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setInventoryLoading(false));
    } else if (activeTab === "orders" && token) {
      setOrdersLoading(true);
      api.getSellerOrders(token)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setOrdersLoading(false));
    } else if (activeTab === "settings" && token) {
      api.getStores()
        .then(storesData => {
          setStores(storesData);
          if (storesData.length > 0 && !selectedStoreId) {
            setSelectedStoreId(storesData[0].id);
          }
        })
        .catch(console.error);
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === "settings" && token && selectedStoreId) {
      setStoreInventoryLoading(true);
      api.getSellerStoreInventory(token, selectedStoreId)
        .then(setStoreInventory)
        .catch(console.error)
        .finally(() => setStoreInventoryLoading(false));
    }
  }, [selectedStoreId, activeTab, token]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        category_id: newProduct.category_id ? parseInt(newProduct.category_id, 10) : null,
        image_url: newProduct.image_url || null
      };
      const created = await api.createSellerProduct(token, payload);
      setProducts([created, ...products]);
      setIsAddModalOpen(false);
      setNewProduct({ name: "", description: "", price: "", stock: "", category_id: "", image_url: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.deleteSellerProduct(token, id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete product. It might be linked to existing orders.");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    if (!token) return;
    try {
      await api.updateSellerOrderStatus(token, orderId, status);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  const handleUpdateStoreStock = async (productId: number, newStock: number) => {
    if (!token || !selectedStoreId) return;
    try {
      const res = await api.updateSellerStoreInventory(token, selectedStoreId, productId, newStock);
      setStoreInventory(storeInventory.map(item => 
        item.product_id === productId ? { ...item, store_stock: res.store_stock } : item
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to update store inventory.");
    }
  };

  if (loading || !user || user.role !== "seller") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface-container-lowest font-body-md overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface border-r border-outline-variant flex flex-col">
        <div className="p-6 border-b border-outline-variant">
          <h1 className="font-headline-sm text-primary font-bold">Omnidrop Seller</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-label-md transition-colors ${activeTab === "dashboard" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-label-md transition-colors ${activeTab === "inventory" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                Inventory
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-label-md transition-colors ${activeTab === "orders" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                Orders
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-label-md transition-colors ${activeTab === "settings" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">store</span>
                Dark Store Settings
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-label-md text-on-surface truncate">{user.full_name}</p>
              <p className="text-label-sm text-on-surface-variant truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-outline-variant bg-surface flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
          <h2 className="font-headline-sm text-on-surface capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <button className="relative text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === "dashboard" && (
            <>
              {dataLoading ? (
                <div className="flex justify-center items-center py-12">
                   <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider">Total Revenue</h3>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">payments</span>
                      </div>
                      <p className="font-headline-lg text-on-surface font-bold">${dashboardData?.revenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider">Active Orders</h3>
                        <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-lg">local_shipping</span>
                      </div>
                      <p className="font-headline-lg text-on-surface font-bold">{dashboardData?.active_orders_count}</p>
                    </div>
                    <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider">Low Stock Alerts</h3>
                        <span className="material-symbols-outlined text-error bg-error/10 p-2 rounded-lg">warning</span>
                      </div>
                      <p className="font-headline-lg text-on-surface font-bold">{dashboardData?.low_stock_count}</p>
                    </div>
                  </div>

                  <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                      <h3 className="font-title-lg text-on-surface font-bold">Recent Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-primary font-label-md hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-lowest border-b border-outline-variant">
                            <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Order ID</th>
                            <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Time</th>
                            <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Status</th>
                            <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Items</th>
                            <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                          {dashboardData?.recent_orders?.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-6 text-center text-on-surface-variant">No active orders found for your products.</td>
                            </tr>
                          ) : (
                            dashboardData?.recent_orders?.map((order: any) => (
                              <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                                <td className="p-4 font-body-md text-on-surface font-medium">{order.id}</td>
                                <td className="p-4 font-body-md text-on-surface-variant">{order.time}</td>
                                <td className="p-4">
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm uppercase">
                                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="p-4 font-body-md text-on-surface">{order.items}</td>
                                <td className="p-4 font-body-md text-on-surface font-medium text-right">${order.total.toFixed(2)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "inventory" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm text-on-surface">Product Catalog</h3>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary/90 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Add Product
                </button>
              </div>

              <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-lowest border-b border-outline-variant">
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Product</th>
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Price</th>
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Stock</th>
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Category</th>
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {inventoryLoading ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                          </td>
                        </tr>
                      ) : products.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-on-surface-variant">
                            No products added yet.
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {product.image_url ? (
                                  <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-md object-cover border border-outline-variant" />
                                ) : (
                                  <div className="w-10 h-10 rounded-md bg-surface-container border border-outline-variant flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline-variant text-[20px]">image</span>
                                  </div>
                                )}
                                <span className="font-body-md text-on-surface font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="p-4 font-body-md text-on-surface">${Number(product.price).toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`inline-flex px-2 py-1 rounded-full font-label-sm ${product.stock > 10 ? 'bg-primary/10 text-primary' : product.stock > 0 ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                                {product.stock} in stock
                              </span>
                            </td>
                            <td className="p-4 font-body-md text-on-surface-variant">{product.category?.name || '-'}</td>
                            <td className="p-4 text-right space-x-2">
                              <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container">
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error/10">
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "orders" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm text-on-surface">Order Fulfillment</h3>
              </div>

              <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-lowest border-b border-outline-variant">
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Order ID</th>
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Date</th>
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Items</th>
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Total</th>
                        <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {ordersLoading ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-on-surface-variant">
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="p-4 font-body-md text-on-surface font-medium">#ORD-{order.id}</td>
                            <td className="p-4 font-body-md text-on-surface-variant">{new Date(order.created_at).toLocaleString()}</td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1 max-w-[250px]">
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="font-body-md text-on-surface truncate" title={`${item.product_name} (x${item.quantity})`}>
                                    {item.product_name} <span className="text-on-surface-variant">x{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 font-body-md text-on-surface font-medium">${order.total.toFixed(2)}</td>
                            <td className="p-4">
                              <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full font-label-sm border uppercase outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all ${
                                  order.status === 'pending' ? 'bg-error/10 text-error border-error/20' : 
                                  order.status === 'paid' ? 'bg-secondary/10 text-secondary border-secondary/20' : 
                                  order.status === 'shipped' ? 'bg-primary/10 text-primary border-primary/20' : 
                                  order.status === 'delivered' ? 'bg-surface-container text-on-surface-variant border-outline-variant' : 
                                  'bg-surface text-on-surface border-outline-variant'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm text-on-surface">Dark Store Distribution</h3>
              </div>

              <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm mb-8">
                <h4 className="font-title-lg text-on-surface mb-2">Manage Store Inventory</h4>
                <p className="text-on-surface-variant font-body-md mb-6">Select a local dark store to allocate your global stock to specific geographic regions. This makes your products available for 15-minute delivery in that area.</p>
                
                <div className="flex items-center gap-4 max-w-sm mb-6">
                  <label className="font-label-md text-on-surface-variant">Select Store:</label>
                  <select 
                    value={selectedStoreId || ""}
                    onChange={(e) => setSelectedStoreId(Number(e.target.value))}
                    className="flex-1 px-4 py-2 rounded-lg border border-outline-variant bg-surface outline-none focus:border-primary cursor-pointer font-label-md"
                  >
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>{store.name} ({store.address})</option>
                    ))}
                  </select>
                </div>

                {selectedStoreId && (
                  <div className="border border-outline-variant rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-lowest border-b border-outline-variant">
                          <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Product Name</th>
                          <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm">Global Stock</th>
                          <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-sm w-48">Allocated to Store</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {storeInventoryLoading ? (
                          <tr>
                            <td colSpan={3} className="p-12 text-center">
                              <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                            </td>
                          </tr>
                        ) : storeInventory.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="p-12 text-center text-on-surface-variant">
                              You have no products to allocate. Please add products in the Inventory tab first.
                            </td>
                          </tr>
                        ) : (
                          storeInventory.map(item => (
                            <tr key={item.product_id} className="hover:bg-surface-container-lowest transition-colors">
                              <td className="p-4 font-body-md text-on-surface font-medium">{item.product_name}</td>
                              <td className="p-4 font-body-md text-on-surface-variant">{item.global_stock}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number" 
                                    min="0"
                                    max={item.global_stock + item.store_stock} // simplistic approach: shouldn't exceed total physically available
                                    value={item.store_stock}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      setStoreInventory(storeInventory.map(i => i.product_id === item.product_id ? { ...i, store_stock: val } : i));
                                    }}
                                    onBlur={(e) => handleUpdateStoreStock(item.product_id, parseInt(e.target.value) || 0)}
                                    className="w-24 px-3 py-1.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-on-surface">Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-full hover:bg-surface-container">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Description</label>
                <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none h-24 resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-on-surface mb-1 block">Price ($)</label>
                  <input required type="number" step="0.01" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-on-surface mb-1 block">Initial Stock</label>
                  <input required type="number" min="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Category</label>
                <select value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-label-md text-on-surface mb-1 block">Image URL (Optional)</label>
                <input type="url" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 font-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-on-primary font-label-md rounded-lg hover:bg-primary/90 transition-colors shadow-md">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
