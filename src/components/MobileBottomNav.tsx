import React from 'react';
import { Home, Grid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    pageView, 
    navigateTo, 
    openSearch, 
    openCartDrawer, 
    cartCount, 
    wishlist 
  } = useShop();

  const isHome = pageView.type === 'home';
  const isShop = pageView.type === 'shop' || pageView.type === 'category';
  const isWishlist = pageView.type === 'wishlist';

  return (
    <div id="mobile-bottom-nav" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          type="button"
          onClick={() => navigateTo({ type: 'home' })}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] ${
            isHome ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Shop */}
        <button
          type="button"
          onClick={() => navigateTo({ type: 'shop', category: 'all' })}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] ${
            isShop ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Shop</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={openSearch}
          className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] text-slate-500 hover:text-slate-900"
        >
          <Search className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => navigateTo({ type: 'wishlist' })}
          className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] ${
            isWishlist ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlist ? 'fill-rose-600 stroke-rose-600' : 'stroke-2'}`} />
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={openCartDrawer}
          className="relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] text-slate-900"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2 text-slate-900" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Cart</span>
        </button>
      </div>
    </div>
  );
};
