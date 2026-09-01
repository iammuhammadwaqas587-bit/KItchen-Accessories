import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  ArrowLeft, 
  Lock, 
  Phone, 
  CheckCircle2, 
  Tag, 
  X,
  CreditCard,
  Banknote,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Smartphone,
  Info
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PAKISTANI_CITIES, PAKISTANI_PROVINCES } from '../data/products';
import { CustomerInfo } from '../types';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    shippingFee, 
    cartTotal, 
    promoDiscount,
    appliedPromo,
    applyPromo,
    removePromo,
    formatPrice, 
    placeOrder, 
    navigateTo, 
    addToast,
    advanceSettings,
    requiresAdvance,
    advanceAmount,
    remainingBalance
  } = useShop();

  // Customer form fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [customCity, setCustomCity] = useState('');
  const [province, setProvince] = useState('Sindh');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Bank Transfer'>('Cash on Delivery');
  const [advanceTransactionRef, setAdvanceTransactionRef] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Promo code in checkout
  const [checkoutPromo, setCheckoutPromo] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied', `Copied "${text}" to clipboard.`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <button
          type="button"
          onClick={() => navigateTo({ type: 'shop', category: 'all' })}
          className="mt-4 py-2.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPromo.trim()) return;
    const res = applyPromo(checkoutPromo);
    if (res.success) {
      setPromoMsg({ text: res.message, isError: false });
      setCheckoutPromo('');
    } else {
      setPromoMsg({ text: res.message, isError: true });
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Pakistani phone validation (must be at least 10-11 digits)
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 10) {
      addToast('Invalid Phone', 'Please enter a valid active Pakistani mobile number (e.g. 03001234567).', 'warning');
      return;
    }

    if (!fullName.trim() || !address.trim()) {
      addToast('Missing Details', 'Please provide your full delivery address and name.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const customerInfo: CustomerInfo = {
      fullName: fullName.trim(),
      phoneNumber: cleanPhone,
      email: email.trim() || undefined,
      address: address.trim(),
      city: city === 'Other City' ? customCity.trim() || 'Pakistan' : city,
      province,
      postalCode: postalCode.trim() || '00000',
      orderNotes: orderNotes.trim() || undefined,
    };

    setTimeout(() => {
      const order = placeOrder(customerInfo, paymentMethod, advanceTransactionRef.trim());
      setIsSubmitting(false);
      navigateTo({ type: 'order-confirmed', order });
    }, 800);
  };

  return (
    <div id="checkout-page" className="min-h-screen bg-slate-50/70 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Mini Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
          <button
            type="button"
            onClick={() => navigateTo({ type: 'cart' })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted & Secure Checkout</span>
          </div>
        </div>

        {/* 2-Column Shopify-like Layout (Left: Form, Right: Order Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Customer & Shipping Details Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* 1. Contact Info */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Customer Contact Details
                  </h2>
                  <span className="text-xs text-emerald-600 font-semibold">Guest Checkout</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammad Waqas"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-slate-900"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Mobile Number (WhatsApp) *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-slate-900"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Courier will call/SMS on this number before delivery.
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="waqas@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Delivery Address in Pakistan
                </h2>

                <div className="space-y-4">
                  {/* Street address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Complete Street Address (House/Flat #, Street, Block, Area) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House # 14-B, Street 3, Sector G-9/2, Near City School"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-slate-900"
                    />
                  </div>

                  {/* City & Province & Postal code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-slate-900 cursor-pointer"
                      >
                        {PAKISTANI_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {city === 'Other City' && (
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Specify Your City Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          placeholder="e.g. Sargodha / Mardan"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Province *
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-slate-900 cursor-pointer"
                      >
                        {PAKISTANI_PROVINCES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Postal Code <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="75500"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-slate-900"
                      />
                    </div>
                  </div>

                  {/* Order notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delivery Instructions / Rider Notes <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Please ring doorbell twice or call before arriving"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method & Advance Payment Policy */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
                    Payment Method
                  </h2>
                  {requiresAdvance && (
                    <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                      <AlertCircle className="w-3 h-3 text-amber-700" />
                      {advanceSettings.percentage}% Advance Required
                    </span>
                  )}
                </div>

                {/* HIGH VALUE ORDER ADVANCE PAYMENT POLICY CARD */}
                {requiresAdvance && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-black text-sm">
                        !
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          High-Value Order Policy ({advanceSettings.percentage}% Advance Required)
                        </h3>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                          For orders exceeding <strong>{formatPrice(advanceSettings.threshold)}</strong>, 
                          a <strong>{advanceSettings.percentage}% advance deposit ({formatPrice(advanceAmount)})</strong> is required before order dispatch to confirm delivery. 
                          The remaining <strong>{formatPrice(remainingBalance)}</strong> will be collected via <strong>Cash on Delivery (COD)</strong> at your doorstep.
                        </p>
                      </div>
                    </div>

                    {/* Bank & Wallet Transfer Details */}
                    <div className="bg-white/90 rounded-xl p-4 border border-amber-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-amber-600" />
                          Ideal Collections Official Bank Account
                        </span>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          Pay Advance: {formatPrice(advanceAmount)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Bank Name</span>
                          <span className="font-semibold text-slate-900">{advanceSettings.bankName}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Account Title</span>
                          <span className="font-semibold text-slate-900">{advanceSettings.accountTitle}</span>
                        </div>

                        {/* Account Number with Copy */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Account Number</span>
                            <span className="font-mono font-bold text-slate-900">{advanceSettings.accountNumber}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(advanceSettings.accountNumber, 'acc')}
                            className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1 transition-colors"
                          >
                            {copiedKey === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'acc' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        {/* IBAN with Copy */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">IBAN Number</span>
                            <span className="font-mono font-bold text-slate-900 truncate block text-[11px]">{advanceSettings.iban}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(advanceSettings.iban, 'iban')}
                            className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1 transition-colors shrink-0"
                          >
                            {copiedKey === 'iban' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'iban' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Mobile Wallets */}
                      <div className="pt-2 border-t border-amber-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-lg">
                          <div>
                            <span className="font-bold text-emerald-950 flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> EasyPaisa
                            </span>
                            <span className="font-mono text-slate-800 text-[11px]">{advanceSettings.easypaisaNumber} ({advanceSettings.accountTitle})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(advanceSettings.easypaisaNumber, 'ep')}
                            className="px-2 py-1 bg-white border border-emerald-200 hover:bg-emerald-50 rounded text-[10px] font-bold text-emerald-900 flex items-center gap-1"
                          >
                            {copiedKey === 'ep' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'ep' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between bg-red-50/70 border border-red-200 p-2.5 rounded-lg">
                          <div>
                            <span className="font-bold text-red-950 flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5 text-red-600" /> JazzCash
                            </span>
                            <span className="font-mono text-slate-800 text-[11px]">{advanceSettings.jazzcashNumber} ({advanceSettings.accountTitle})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(advanceSettings.jazzcashNumber, 'jc')}
                            className="px-2 py-1 bg-white border border-red-200 hover:bg-red-50 rounded text-[10px] font-bold text-red-900 flex items-center gap-1"
                          >
                            {copiedKey === 'jc' ? <Check className="w-3 h-3 text-red-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'jc' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Advance Payment Reference / Transaction ID (Optional) */}
                      <div className="pt-2">
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Bank Reference / EasyPaisa / JazzCash Transaction ID <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={advanceTransactionRef}
                          onChange={(e) => setAdvanceTransactionRef(e.target.value)}
                          placeholder="e.g. TID # 9876543210 (or send proof via WhatsApp after order)"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-slate-900"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          You can also share your advance transfer screenshot on WhatsApp ({advanceSettings.whatsappConfirmationNumber}) after placing this order.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {/* COD Option */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-slate-900 bg-slate-50/70'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="mt-1 accent-slate-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {requiresAdvance ? '20% Advance + 80% COD' : 'Recommended'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {requiresAdvance ? (
                          <span>
                            Pay <strong>{formatPrice(advanceAmount)} ({advanceSettings.percentage}%)</strong> advance deposit via bank/wallet now, and remaining <strong>{formatPrice(remainingBalance)}</strong> in cash upon courier delivery.
                          </span>
                        ) : (
                          'Pay conveniently with cash when the courier rider delivers your package to your doorstep.'
                        )}
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer Option */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-slate-900 bg-slate-50/70'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={() => setPaymentMethod('Bank Transfer')}
                      className="mt-1 accent-slate-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-slate-600" />
                          Full Direct Bank Transfer / EasyPaisa / JazzCash
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Transfer the full amount upfront to our official bank account or mobile wallet.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Large Final PLACE ORDER Button */}
              <div className="pt-4">
                <button
                  id="checkout-place-order-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 rounded-xl bg-slate-900 hover:bg-amber-600 active:bg-amber-700 text-white font-black text-sm sm:text-base tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>CONFIRMING ORDER...</span>
                  ) : requiresAdvance ? (
                    <span>CONFIRM ORDER (Rs. {advanceAmount.toLocaleString('en-PK')} Advance Required)</span>
                  ) : (
                    <span>PLACE ORDER — {formatPrice(cartTotal)}</span>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  By clicking Confirm Order, you agree to Ideal Collections' Terms and 7-day return policy.
                </p>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sticky top-24 space-y-5">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold text-slate-500">{cart.length} unique item{cart.length > 1 ? 's' : ''}</span>
              </h3>

              {/* Items preview list */}
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-bl">
                          {quantity}x
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {product.title}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {formatPrice(product.salePrice)} each
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-950 shrink-0">
                      {formatPrice(product.salePrice * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo input */}
              <div className="pt-2 border-t border-slate-100">
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
                  <form onSubmit={handleApplyPromo} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={checkoutPromo}
                        onChange={(e) => setCheckoutPromo(e.target.value)}
                        placeholder="Discount code"
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 uppercase focus:outline-hidden focus:border-slate-900"
                      />
                      <button
                        type="submit"
                        className="py-2 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMsg && (
                      <p className={`text-[10px] ${promoMsg.isError ? 'text-rose-600' : 'text-emerald-600'} font-medium`}>
                        {promoMsg.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping (Pakistan Delivery)</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600 uppercase">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
              </div>

              {/* Grand Total Breakdown */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900 block">Total Order Value</span>
                    <span className="text-[11px] text-slate-500 font-medium">Inclusive of all charges</span>
                  </div>
                  <span className="text-2xl font-black text-slate-950">{formatPrice(cartTotal)}</span>
                </div>

                {/* Advance Payment Split Display if order exceeds threshold */}
                {requiresAdvance && (
                  <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 space-y-2 mt-3 text-xs">
                    <div className="flex items-center justify-between text-amber-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        Advance Deposit ({advanceSettings.percentage}%):
                      </span>
                      <span className="text-sm font-black text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                        {formatPrice(advanceAmount)}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800">Pay before dispatch via Bank / EasyPaisa / JazzCash.</p>

                    <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-slate-800 font-bold">
                      <span>Remaining Balance (COD):</span>
                      <span className="text-sm font-black text-emerald-700">
                        {formatPrice(remainingBalance)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">To pay in cash to courier rider upon delivery.</p>
                  </div>
                )}
              </div>

              {/* Free delivery badge */}
              <div className="bg-amber-50/70 border border-amber-100 p-3 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Estimated Delivery: <strong>2-4 Working Days</strong></span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
