import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, allProducts, navigateTo, addToCart, formatPrice } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const trendingTags = ['Chopper', 'Garlic Press', 'Oil Spray', 'Kitchen Scale', 'Spice Rack', 'Organizer', 'Peeler', 'Baking Mat'];

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return allProducts.filter((p) => {
      return (
        p.title.toLowerCase().includes(trimmed) ||
        p.categoryName.toLowerCase().includes(trimmed) ||
        p.shortDescription.toLowerCase().includes(trimmed) ||
        p.tags.some((tag) => tag.toLowerCase().includes(trimmed))
      );
    });
  }, [query, allProducts]);

  if (!isSearchOpen) return null;

  const handleProductSelect = (productId: string) => {
    closeSearch();
    navigateTo({ type: 'product', productId });
  };

  const handleViewAllResults = () => {
    closeSearch();
    navigateTo({ type: 'shop', category: 'all', search: query });
  };

  return (
    <div id="search-modal" className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={closeSearch}
      />

      <div className="relative min-h-screen px-4 py-8 sm:py-16 flex flex-col items-center">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kitchen gadgets, choppers, cutters, organizers..."
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-hidden font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={closeSearch}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-200 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Quick Popular Keywords */}
          {!query && (
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Trending Searches in Pakistan
              </p>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Popular picks */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Top Recommended Gadgets
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allProducts.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleProductSelect(p.id)}
                      className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-xs bg-white cursor-pointer group flex flex-col items-center text-center"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {p.title}
                      </span>
                      <span className="text-xs font-bold text-slate-950 mt-1">
                        {formatPrice(p.salePrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results Display */}
          {query && (
            <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-100">
              {results.length > 0 ? (
                <>
                  <div className="flex items-center justify-between pb-3 text-xs font-semibold text-slate-500">
                    <span>Found {results.length} kitchen gadget{results.length > 1 ? 's' : ''}</span>
                    <button
                      type="button"
                      onClick={handleViewAllResults}
                      className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-bold"
                    >
                      View all in Shop <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product.id)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover rounded-lg bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                              {product.categoryName}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                              {product.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.isSale && product.originalPrice > product.salePrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                              <span className="text-xs sm:text-sm font-bold text-slate-950">
                                {formatPrice(product.salePrice)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1, true);
                            closeSearch();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <p className="text-sm font-bold text-slate-800 mb-1">
                    No products found for "{query}".
                  </p>
                  <p className="text-xs text-slate-500">
                    Try searching for "chopper", "garlic", "peeler", "organizer", or "scale".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
