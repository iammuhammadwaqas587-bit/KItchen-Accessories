import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  ChefHat, 
  Sparkles, 
  Package, 
  Phone,
  ChevronRight,
  User as UserIcon,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryId } from '../types';

export const Header: React.FC = () => {
  const { 
    cartCount, 
    wishlist, 
    openCartDrawer, 
    openSearch, 
    navigateTo, 
    pageView,
    currentUser,
    isAdmin,
    logout
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { label: string; view: { type: 'home' | 'shop' | 'category' | 'wishlist' | 'info' | 'admin'; category?: CategoryId; infoType?: any }; badge?: string; badgeColor?: string }[] = [
    { label: 'Home', view: { type: 'home' } },
    { label: 'All Products', view: { type: 'shop', category: 'all' } },
    { label: 'Kitchen Gadgets', view: { type: 'category', category: 'kitchen-gadgets' } },
    { label: 'Choppers & Cutters', view: { type: 'category', category: 'choppers-cutters' } },
    { label: 'Cooking Tools', view: { type: 'category', category: 'cooking-tools' } },
    { label: 'Storage & Organizers', view: { type: 'category', category: 'storage-organizers' } },
    { label: 'Best Sellers', view: { type: 'shop', category: 'best-sellers' }, badge: 'HOT', badgeColor: 'bg-amber-500' },
    { label: 'New Arrivals', view: { type: 'shop', category: 'new-arrivals' }, badge: 'NEW', badgeColor: 'bg-blue-600' },
    { label: 'Deals', view: { type: 'shop', category: 'sale' }, badge: 'SALE', badgeColor: 'bg-rose-600' },
  ];

  const handleNavClick = (view: any) => {
    navigateTo(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isCurrentView = (navView: any) => {
    if (navView.type === 'home' && pageView.type === 'home') return true;
    if (navView.type === 'category' && pageView.type === 'category' && pageView.category === navView.category) return true;
    if (navView.type === 'shop' && pageView.type === 'shop' && pageView.category === navView.category) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-700 hover:text-slate-900 focus:outline-hidden"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* BRAND LOGO - IDEAL COLLECTIONS */}
          <div className="flex items-center">
            <button
              id="brand-logo-btn"
              type="button"
              onClick={() => navigateTo({ type: 'home' })}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-xs">
                <Sparkles className="w-5 h-5 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-sans block leading-none">
                  Ideal <span className="text-amber-500">Collections</span>
                </span>
                <span className="hidden sm:block text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mt-1">
                  Smart Kitchen & Home Gadgets
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar Trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-6">
            <button
              id="desktop-search-trigger-btn"
              type="button"
              onClick={openSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-amber-400 text-slate-400 text-xs sm:text-sm transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Search choppers, cutters, scales, organizers...</span>
              </div>
              <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </button>
          </div>

          {/* Right Action Icons (Admin Portal, User Auth, Track, Wishlist, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Mobile Search Button */}
            <button
              id="mobile-search-btn"
              type="button"
              onClick={openSearch}
              className="p-2 text-slate-700 hover:text-amber-600 md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Portal Quick Link */}
            <button
              id="header-admin-portal-btn"
              type="button"
              onClick={() => navigateTo({ type: 'admin' })}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isAdmin
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Admin Panel' : 'Admin Login'}</span>
            </button>

            {/* User Account / Auth Button */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline font-bold truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn text-xs">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => handleNavClick({ type: 'account' })}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        My Account & Orders
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick({ type: 'admin' })}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-amber-900 font-bold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          Manage Store (Admin)
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-red-600 border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="header-user-login-btn"
                  type="button"
                  onClick={() => navigateTo({ type: 'auth', initialMode: 'login' })}
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-semibold"
                  title="Sign In / Register"
                >
                  <UserIcon className="w-5 h-5 sm:w-4 sm:h-4 text-slate-600" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              type="button"
              onClick={() => navigateTo({ type: 'wishlist' })}
              className="relative p-2 text-slate-700 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={openCartDrawer}
              className="relative flex items-center gap-2 py-2 px-3 sm:px-4 rounded-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white transition-colors duration-200 shadow-sm"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-slate-900">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold tracking-wide">
                CART
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 py-2.5 overflow-x-auto text-[13.5px]">
          <div className="flex items-center gap-6">
            {navLinks.map((link, idx) => {
              const active = isCurrentView(link.view);
              return (
                <button
                  key={idx}
                  id={`desktop-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => handleNavClick(link.view)}
                  className={`relative flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors py-1 ${
                    active
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[9px] font-extrabold text-white px-1.5 py-0.2 rounded ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <button
              onClick={() => handleNavClick({ type: 'admin' })}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[12px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              Manage Products (Admin)
            </button>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-emerald-600 text-[12px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Cash on Delivery (All Pakistan)
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-base text-slate-900 block leading-tight">Ideal Collections</span>
                  <span className="text-[10px] text-slate-500">Pakistan Kitchen Gadgets</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links List */}
            <div className="p-4 flex-1 divide-y divide-slate-100">
              {/* User / Admin Access Section */}
              <div className="pb-3 space-y-2">
                {currentUser ? (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-900">Signed in as {currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="flex gap-2 mt-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleNavClick({ type: 'account' })}
                        className="text-xs font-bold text-slate-900 hover:underline"
                      >
                        My Account
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick({ type: 'admin' })}
                          className="text-xs font-bold text-amber-600 hover:underline"
                        >
                          • Admin Panel
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-xs font-medium text-red-600 ml-auto hover:underline"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavClick({ type: 'auth', initialMode: 'login' })}
                      className="py-2 px-3 bg-slate-900 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <UserIcon className="w-3.5 h-3.5" /> Customer Login
                    </button>
                    <button
                      onClick={() => handleNavClick({ type: 'admin' })}
                      className="py-2 px-3 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  Shop Categories
                </p>
                {navLinks.map((link, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleNavClick(link.view)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {link.label}
                      {link.badge && (
                        <span className={`text-[9px] font-bold text-white px-1.5 py-0.2 rounded ${link.badgeColor}`}>
                          {link.badge}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>

              {/* Extra Info */}
              <div className="pt-3 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                  Customer Care
                </p>
                <button
                  type="button"
                  onClick={() => handleNavClick({ type: 'track-order' })}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-950 font-medium"
                >
                  📦 Track Your Order
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick({ type: 'info', infoType: 'faq' })}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-950 font-medium"
                >
                  ❓ FAQs & Help
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick({ type: 'info', infoType: 'contact' })}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-950 font-medium"
                >
                  📞 Contact Us
                </button>
              </div>
            </div>

            {/* Footer / COD prompt */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp: +92 300 1234567</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Cash on delivery across all cities of Pakistan.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

