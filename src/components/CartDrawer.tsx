import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    freeShippingThreshold,
    hasFreeShipping,
    amountUntilFreeShipping,
    formatPrice,
    navigateTo,
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigateTo({ type: 'checkout' });
  };

  const handleViewCartClick = () => {
    closeCartDrawer();
    navigateTo({ type: 'cart' });
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCartDrawer}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-900" />
            <h2 className="text-base font-bold text-slate-900">
              Shopping Cart ({cart.reduce((t, i) => t + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-drawer-btn"
            type="button"
            onClick={closeCartDrawer}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Dynamic Progress Bar */}
        <div className="bg-amber-50/70 border-b border-amber-100 p-3 text-xs">
          <div className="flex items-center justify-between font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-800">
              <Truck className="w-4 h-4 text-amber-600" />
              {hasFreeShipping ? (
                <span className="text-emerald-700 font-bold">You unlocked FREE Shipping across Pakistan! 🎉</span>
              ) : (
                <span>
                  Add <strong className="text-amber-700 font-bold">{formatPrice(amountUntilFreeShipping)}</strong> for <strong className="text-emerald-700">FREE SHIPPING</strong>
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold text-slate-600">{progressPercent}%</span>
          </div>
          {/* Progress Track */}
          <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                hasFreeShipping ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-slate-800 mb-1">Your cart is empty</p>
              <p className="text-xs text-slate-500 mb-6 max-w-xs">
                Explore our best-selling kitchen gadgets and upgrade your daily cooking routine today.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  navigateTo({ type: 'shop', category: 'all' });
                }}
                className="py-2.5 px-6 rounded-lg bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} className="py-3.5 flex gap-3.5 group">
                {/* Square Product Image */}
                <div 
                  className="w-18 h-18 aspect-square rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 cursor-pointer"
                  onClick={() => {
                    closeCartDrawer();
                    navigateTo({ type: 'product', productId: product.id });
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Stepper */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h4
                      className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer leading-tight"
                      onClick={() => {
                        closeCartDrawer();
                        navigateTo({ type: 'product', productId: product.id });
                      }}
                    >
                      {product.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800 min-w-[24px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatPrice(product.salePrice * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Subtotal & Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Subtotal row */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Estimated Subtotal:</span>
              <span className="text-base font-extrabold text-slate-950">
                {formatPrice(cartSubtotal)}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Shipping & taxes calculated at checkout. Cash on Delivery supported.
            </p>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="drawer-view-cart-btn"
                type="button"
                onClick={handleViewCartClick}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all text-center"
              >
                VIEW CART
              </button>

              <button
                id="drawer-checkout-btn"
                type="button"
                onClick={handleCheckoutClick}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <span>CHECKOUT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
