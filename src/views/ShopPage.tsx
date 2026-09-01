import React, { useState, useMemo, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  X, 
  ChevronDown, 
  Star, 
  RotateCcw, 
  Check,
  Grid,
  Filter
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { CategoryId, SortOption, Product } from '../types';

interface ShopPageProps {
  initialCategory?: CategoryId;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory = 'all', initialSearch = '' }) => {
  const { allProducts, formatPrice } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [saleOnly, setSaleOnly] = useState(initialCategory === 'sale');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>(
    initialCategory === 'best-sellers' ? 'best-selling' : initialCategory === 'new-arrivals' ? 'newest' : 'featured'
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      if (initialCategory === 'sale') setSaleOnly(true);
      if (initialCategory === 'best-sellers') setSortBy('best-selling');
      if (initialCategory === 'new-arrivals') setSortBy('newest');
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const currentCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all' || selectedCategory === 'best-sellers' || selectedCategory === 'new-arrivals' || selectedCategory === 'sale') {
      return null;
    }
    return CATEGORIES.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  const pageTitle = useMemo(() => {
    if (searchQuery) return `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`;
    if (selectedCategory === 'best-sellers') return 'BEST SELLING KITCHEN GADGETS';
    if (selectedCategory === 'new-arrivals') return 'NEW ARRIVAL GADGETS';
    if (selectedCategory === 'sale') return 'SALE & DISCOUNTED GADGETS';
    if (currentCategoryInfo) return currentCategoryInfo.name.toUpperCase();
    return 'SHOP ALL KITCHEN GADGETS';
  }, [selectedCategory, searchQuery, currentCategoryInfo]);

  const pageSubtitle = useMemo(() => {
    if (currentCategoryInfo) return currentCategoryInfo.shortDesc;
    if (selectedCategory === 'best-sellers') return 'The most popular, highly reviewed kitchen essentials loved by customers across Pakistan.';
    if (selectedCategory === 'sale') return 'Save big with exclusive discount prices on durable kitchen essentials with Cash on Delivery.';
    return 'Explore smart, affordable gadgets and tools designed to simplify your everyday Pakistani kitchen routine.';
  }, [selectedCategory, currentCategoryInfo]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'best-sellers' && !product.isBestSeller) return false;
        if (selectedCategory === 'new-arrivals' && !product.isNewArrival) return false;
        if (selectedCategory === 'sale' && !product.isSale) return false;
        if (!['best-sellers', 'new-arrivals', 'sale'].includes(selectedCategory) && product.category !== selectedCategory) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCat = product.categoryName.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCat && !matchesTags) return false;
      }

      // Price filter
      if (product.salePrice < minPrice || product.salePrice > maxPrice) return false;

      // In stock
      if (inStockOnly && !product.inStock) return false;

      // Sale only
      if (saleOnly && !product.isSale) return false;

      // Rating
      if (minRating > 0 && product.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.salePrice - b.salePrice;
      if (sortBy === 'price-high') return b.salePrice - a.salePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'best-selling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0;
    });
  }, [allProducts, selectedCategory, searchQuery, minPrice, maxPrice, inStockOnly, saleOnly, minRating, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(3000);
    setInStockOnly(false);
    setSaleOnly(false);
    setMinRating(0);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || minPrice > 0 || maxPrice < 3000 || inStockOnly || saleOnly || minRating > 0;

  return (
    <div id="shop-page" className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs">
            <span>Showing {filteredProducts.length} Products</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Sidebar Filters + Products Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Control Bar (Mobile filter toggle & Sort Dropdown) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-6 border-b border-slate-200">
          {/* Mobile Filter Button */}
          <div className="flex items-center gap-2">
            <button
              id="mobile-filter-open-btn"
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 shadow-2xs"
            >
              <Filter className="w-4 h-4 text-amber-600" />
              <span>FILTERS {hasActiveFilters && '(Active)'}</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 p-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Quick Category Pills for Desktop */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Gadgets
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Sort By:</span>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="py-2 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-slate-900 cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured</option>
              <option value="best-selling">Best Selling</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* 2-Column Desktop Grid (Filter Sidebar + Product Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            
            {/* Search filter in sidebar */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Search In Store
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Chopper, Peeler..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-slate-900"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold text-left transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>All Products</span>
                  <span>{allProducts.length}</span>
                </button>

                {CATEGORIES.map((cat) => {
                  const count = allProducts.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold text-left transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Price Range
                </h3>
                <span className="text-xs font-bold text-amber-700">
                  Up to {formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Rs. 300</span>
                <span>Rs. 3,000</span>
              </div>
            </div>

            {/* Availability & Sale Switches */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Availability & Deals
              </h3>
              
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-rose-600 font-bold">On Sale (Discounted)</span>
              </label>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Customer Rating
              </h3>
              <div className="space-y-1">
                {[4.5, 4.0, 0].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setMinRating(rating)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      minRating === rating
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {rating > 0 ? (
                      <>
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </div>
                        <span>{rating} Stars & above</span>
                      </>
                    ) : (
                      <span>All Ratings</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET ALL FILTERS</span>
                </button>
              </div>
            )}

          </aside>

          {/* PRODUCT CARDS GRID */}
          <main className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200/80 p-8">
                <div className="w-16 h-16 rounded-full bg-slate-200/70 flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No products found. Try another search.
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  We couldn't find any gadgets matching your selected criteria. Try loosening your price or category filters.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* MOBILE FILTER MODAL / DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 flex-1 overflow-y-auto">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium ${
                      selectedCategory === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700'
                    }`}
                  >
                    All Gadgets
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategory(c.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium ${
                        selectedCategory === c.id ? 'bg-slate-900 text-white font-bold' : 'text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-amber-700">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
              </div>

              {/* Switches */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 w-4 h-4"
                  />
                  <span>In Stock Only</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={saleOnly}
                    onChange={(e) => setSaleOnly(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 w-4 h-4"
                  />
                  <span className="text-rose-600 font-bold">On Sale</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold text-center"
              >
                APPLY ({filteredProducts.length} ITEMS)
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold text-center"
                >
                  RESET
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
