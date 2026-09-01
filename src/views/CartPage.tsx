import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck, 
  ArrowLeft,
  X,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    shippingFee, 
    cartTotal,
    hasFreeShipping, 
    amountUntilFreeShipping, 
    freeShippingThreshold,
    appliedPromo,
    promoDiscount,
    applyPromo,
    removePromo,
    formatPrice, 
    navigateTo,
    addToast
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromo(couponInput);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 uppercase">Your Cart Is Empty</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Looks like you haven't added any kitchen gadgets yet. Discover our best sellers to get started!
        </p>
        <button
          type="button"
          onClick={() => navigateTo({ type: 'shop', category: 'all' })}
          className="mt-6 py-3 px-8 rounded-xl bg-slate-900 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors shadow-md"
        >
          START SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div id="cart-page" className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            YOUR SHOPPING CART
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your selected gadgets before proceeding to Cash on Delivery checkout.
          </p>
        </div>

        {/* Free Shipping Dynamic Notification Box */}
        <div className="max-w-4xl mx-auto mb-8 bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" />
              {hasFreeShipping ? (
                <span className="text-emerald-700">🎉 Congratulations! You have unlocked FREE DELIVERY across Pakistan!</span>
              ) : (
                <span>
                  You are only <strong className="text-amber-700">{formatPrice(amountUntilFreeShipping)}</strong> away from <strong>FREE SHIPPING</strong>.
                </span>
              )}
            </span>
            <span className="text-xs font-extrabold text-slate-500">{progressPercent}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                hasFreeShipping ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2-Column Layout (Items Table + Order Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Cart Items ({cart.reduce((t, i) => t + i.quantity, 0)})
              </h2>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Clear Cart
              </button>
            </div>

            {/* List of items */}
            <div className="divide-y divide-slate-100">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Image & Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className="w-20 h-20 aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 cursor-pointer"
                      onClick={() => navigateTo({ type: 'product', productId: product.id })}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        {product.categoryName}
                      </span>
                      <h3
                        onClick={() => navigateTo({ type: 'product', productId: product.id })}
                        className="text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-800">
                          {formatPrice(product.salePrice)}
                        </span>
                        {product.isSale && product.originalPrice > product.salePrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold text-slate-900 min-w-[28px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-sm font-extrabold text-slate-950">
                        {formatPrice(product.salePrice * quantity)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Back link */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateTo({ type: 'shop', category: 'all' })}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>CONTINUE SHOPPING</span>
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600 uppercase">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                {/* Promo discount */}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedPromo})</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div className="pt-3 border-t border-slate-100">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{appliedPromo}</strong> applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-emerald-700 hover:text-emerald-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Voucher code (e.g. WELCOME10)"
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 uppercase focus:outline-hidden focus:border-slate-900"
                      />
                      <button
                        type="submit"
                        className="py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                      >
                        APPLY
                      </button>
                    </div>
                    {couponMsg && (
                      <p className={`text-[11px] ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'} font-medium`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Total Row */}
              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-base font-extrabold text-slate-900">Total (PKR)</span>
                <span className="text-2xl font-black text-slate-950">{formatPrice(cartTotal)}</span>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                type="button"
                onClick={() => navigateTo({ type: 'checkout' })}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <p className="text-[11px] text-slate-500">
                  Cash on Delivery available all across Pakistan. No card required.
                </p>
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>100% Purchase Guarantee</strong>: Open & inspect parcel before making payment to the courier rider.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
