import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../api";
import type { Product, Category } from "../types";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category_slug = searchParams.get("category_slug") || "";
  const sort_by = searchParams.get("sort_by") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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
    
    // Listen for custom event from LocationModal if possible, or just window storage
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    api.categories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.products(1, 12, search, category_slug, sort_by, storeId)
      .then(res => setProducts(res.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category_slug, sort_by, storeId]);

  const updateSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSearch = formData.get("search") as string;
    if (newSearch) {
      searchParams.set("search", newSearch);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (slug: string) => {
    if (slug) {
      searchParams.set("category_slug", slug);
    } else {
      searchParams.delete("category_slug");
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      searchParams.set("sort_by", val);
    } else {
      searchParams.delete("sort_by");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 font-body-md">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 shrink-0 space-y-8">
            <div>
              <h2 className="font-headline-sm text-on-surface mb-4">Search</h2>
              <form onSubmit={updateSearch} className="flex gap-2">
                <input 
                  type="text" 
                  name="search" 
                  defaultValue={search} 
                  placeholder="Search products..." 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <button type="submit" className="bg-primary text-on-primary px-3 py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
              </form>
            </div>

            <div>
              <h2 className="font-headline-sm text-on-surface mb-4">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleCategoryChange("")}
                    className={`text-left w-full px-3 py-2 rounded-lg font-label-md transition-colors ${!category_slug ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`text-left w-full px-3 py-2 rounded-lg font-label-md transition-colors ${category_slug === cat.slug ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="font-headline-lg text-on-surface">Catalog</h1>
                <p className="text-on-surface-variant font-label-md mt-1">Showing {products.length} products</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="font-label-md text-on-surface-variant whitespace-nowrap">Sort by:</label>
                <select 
                  value={sort_by} 
                  onChange={handleSortChange}
                  className="px-4 py-2 rounded-lg border border-outline-variant bg-surface outline-none focus:border-primary cursor-pointer font-label-md"
                >
                  <option value="">Alphabetical (A-Z)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-surface-container-low rounded-2xl p-12 text-center border border-outline-variant">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">search_off</span>
                <h2 className="font-headline-md text-on-surface mb-2">No products found</h2>
                <p className="text-on-surface-variant">Try adjusting your search or filter criteria.</p>
                <button 
                  onClick={() => setSearchParams({})} 
                  className="mt-6 border border-primary text-primary px-6 py-2 rounded-full font-label-md hover:bg-primary/5 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.slug}`}
                    className="bg-surface rounded-2xl border border-outline-variant overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col h-full"
                  >
                    <div className="aspect-square bg-surface-container-lowest overflow-hidden relative p-4 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="material-symbols-outlined text-6xl text-outline-variant">image</span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-label-sm text-primary uppercase tracking-widest mb-1">{product.category?.name}</p>
                      <h3 className="font-label-lg text-on-surface line-clamp-2 mb-2 flex-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-headline-sm text-on-surface font-bold">${Number(product.price).toFixed(2)}</span>
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
