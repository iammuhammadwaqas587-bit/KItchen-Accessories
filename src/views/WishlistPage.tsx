import React from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, allProducts, navigateTo } = useShop();

  const favoriteProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div id="wishlist-page" className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            Your Favorites
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            MY WISHLIST ({favoriteProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Saved kitchen gadgets you love. Add them to your cart before they run out of stock!
          </p>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200/80 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tap the heart icon on any gadget while browsing to save it here for later.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigateTo({ type: 'shop', category: 'all' })}
                className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
              >
                EXPLORE PRODUCTS
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
