import React from 'react';
import { ShoppingBag, Eye, Heart, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickView = true }) => {
  const { addToCart, openQuickView, toggleWishlist, isInWishlist, navigateTo, formatPrice, cart } = useShop();

  const isFavorite = isInWishlist(product.id);
  const cartItem = cart.find((i) => i.product.id === product.id);
  const discountPercent = product.isSale && product.originalPrice > product.salePrice
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    navigateTo({ type: 'product', productId: product.id });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, true);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col h-full bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 1. SQUARE PRODUCT IMAGE CONTAINER */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isSale && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-600 text-white shadow-sm">
              SALE {discountPercent > 0 && `-${discountPercent}%`}
            </span>
          )}
          {product.isBestSeller && !product.isSale && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
              BEST SELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Top Right Actions (Wishlist & Quick View) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            id={`wishlist-btn-${product.id}`}
            type="button"
            onClick={handleWishlist}
            aria-label="Add to Wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white border border-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {showQuickView && (
            <button
              id={`quickview-btn-${product.id}`}
              type="button"
              onClick={handleQuickView}
              aria-label="Quick View"
              className="w-8 h-8 rounded-full bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-all duration-200 shadow-sm"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Low stock tag */}
        {product.stockCount <= 10 && product.stockCount > 0 && (
          <div className="absolute bottom-2 left-2 z-10 bg-amber-900/80 backdrop-blur-xs text-amber-100 text-[10px] px-2 py-0.5 rounded font-medium">
            Only {product.stockCount} left!
          </div>
        )}
      </div>

      {/* 2. CARD CONTENT (Strictly Center-Aligned Hierarchy) */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between text-center">
        <div>
          {/* Star Rating snippet */}
          <div className="flex items-center justify-center gap-1 mb-1.5 text-amber-400">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              ({product.reviewsCount})
            </span>
          </div>

          {/* PRODUCT TITLE (CENTER ALIGNED) */}
          <h3 className="text-[13.5px] sm:text-[14.5px] font-semibold text-slate-900 line-clamp-2 min-h-[2.6rem] hover:text-amber-700 transition-colors leading-snug">
            {product.title}
          </h3>

          {/* PRICES (CENTER ALIGNED DIRECTLY UNDER TITLE) */}
          <div className="mt-2 mb-3 flex items-center justify-center gap-2 flex-wrap">
            {product.isSale && product.originalPrice > product.salePrice ? (
              <>
                <span className="text-xs sm:text-sm text-slate-400 line-through font-normal">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm sm:text-base font-bold text-rose-600">
                  {formatPrice(product.salePrice)}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {formatPrice(product.salePrice)}
              </span>
            )}
          </div>
        </div>

        {/* 3. ADD TO CART BUTTON */}
        <button
          id={`add-to-cart-btn-${product.id}`}
          type="button"
          onClick={handleAddToCart}
          className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-amber-600 active:bg-amber-700 text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors duration-200 shadow-xs"
        >
          {cartItem ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added ({cartItem.quantity})</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
