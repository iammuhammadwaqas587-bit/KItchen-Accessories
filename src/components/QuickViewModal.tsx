import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, Plus, Minus, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, navigateTo, formatPrice } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const discountPercent = product.isSale && product.originalPrice > product.salePrice
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, true);
    closeQuickView();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false);
    closeQuickView();
    navigateTo({ type: 'checkout' });
  };

  const handleViewFullDetails = () => {
    closeQuickView();
    navigateTo({ type: 'product', productId: product.id });
  };

  return (
    <div id="quick-view-modal" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={closeQuickView}
      />

      {/* Content Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-900 bg-white/80 backdrop-blur-xs rounded-full hover:bg-slate-100 transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left: Square Product Image */}
          <div className="aspect-square w-full rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative">
            <img
              src={product.image}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.isSale && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm">
                SALE {discountPercent > 0 && `-${discountPercent}%`}
              </span>
            )}
          </div>

          {/* Right: Details & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {product.categoryName}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-2xl font-black text-slate-950">
                  {formatPrice(product.salePrice)}
                </span>
                {product.isSale && product.originalPrice > product.salePrice && (
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Save {formatPrice(product.originalPrice - product.salePrice)} ({discountPercent}%)
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Check className="w-4 h-4" />
                <span>In Stock — Dispatched within 24 hours</span>
              </div>

              {/* Short Description */}
              <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Key Feature highlights */}
              <ul className="mt-3 space-y-1 text-xs text-slate-700">
                {product.features.slice(0, 2).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-slate-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  BUY NOW (COD)
                </button>
              </div>

              <button
                type="button"
                onClick={handleViewFullDetails}
                className="w-full text-center text-xs font-semibold text-slate-600 hover:text-amber-700 py-1 flex items-center justify-center gap-1 transition-colors"
              >
                <span>View Full Specifications & Reviews</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
