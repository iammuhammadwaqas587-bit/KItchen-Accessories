import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  Calendar, 
  ArrowRight, 
  Package, 
  Printer, 
  Sparkles,
  ShoppingBag,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Smartphone,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Order } from '../types';
import { useShop } from '../context/ShopContext';

interface OrderConfirmationPageProps {
  order: Order;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order }) => {
  const { navigateTo, formatPrice, advanceSettings, addToast } = useShop();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied', `Copied "${text}" to clipboard.`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Assalam o Alaikum Ideal Collections Team, I have placed Order #${order.orderNumber} for total ${formatPrice(order.total)}. Here is my ${order.advancePercentage || 20}% advance deposit confirmation of ${formatPrice(order.advanceAmount || 0)} for dispatch confirmation.`
  );
  const whatsappUrl = `https://wa.me/${advanceSettings.whatsappConfirmationNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div id="order-confirmation-page" className="min-h-screen bg-slate-50/70 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Main Confirmation Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
          
          {/* Top Success Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              Order #{order.orderNumber}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              ORDER RECEIVED!
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
              {order.requiresAdvance
                ? `Thank you for your order! Since this is a high-value order above Rs. ${order.advanceThresholdApplied?.toLocaleString('en-PK') || '10,000'}, please complete your ${order.advancePercentage || 20}% advance deposit to initiate courier dispatch.`
                : 'Thank you for your order. We will contact you shortly on WhatsApp / Phone to confirm your delivery dispatch.'}
            </p>
          </div>

          {/* ADVANCE PAYMENT REQUIRED SPECIAL ALERT CARD */}
          {order.requiresAdvance && (
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-50 border-2 border-amber-400/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                    !
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Advance Deposit Required for Order Confirmation
                    </h3>
                    <p className="text-xs text-slate-600">
                      Order Value: <strong>{formatPrice(order.total)}</strong> • Policy: Orders &gt; {formatPrice(order.advanceThresholdApplied || 10000)}
                    </p>
                  </div>
                </div>

                <span className="bg-amber-200 text-amber-950 font-black text-xs px-3 py-1 rounded-full shrink-0 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {order.advancePaymentStatus === 'Received' ? 'Advance Received' : 'Advance Pending'}
                </span>
              </div>

              {/* Advance vs Remaining Financial Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    1. Advance Deposit Due ({order.advancePercentage || 20}%)
                  </span>
                  <span className="text-xl font-black text-amber-950 block mt-0.5">
                    {formatPrice(order.advanceAmount || 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Pay now to trigger warehouse packing & dispatch.
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    2. Cash on Delivery Balance (Remaining)
                  </span>
                  <span className="text-xl font-black text-emerald-800 block mt-0.5">
                    {formatPrice(order.remainingBalance || 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Pay in cash directly to rider upon doorstep delivery.
                  </span>
                </div>
              </div>

              {/* Bank & Wallet Details */}
              <div className="bg-white/90 rounded-xl p-4 border border-amber-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    Ideal Collections Payment Accounts
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    Deposit Amount: <strong className="text-amber-800">{formatPrice(order.advanceAmount || 0)}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Bank Account ({advanceSettings.bankName})</span>
                      <span className="font-mono font-bold text-slate-900">{advanceSettings.accountNumber}</span>
                      <span className="text-[10px] text-slate-500 block">{advanceSettings.accountTitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(advanceSettings.accountNumber, 'acc')}
                      className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1"
                    >
                      {copiedKey === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'acc' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">IBAN Number</span>
                      <span className="font-mono font-bold text-slate-900 text-[11px] truncate block">{advanceSettings.iban}</span>
                      <span className="text-[10px] text-slate-500 block">{advanceSettings.accountTitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(advanceSettings.iban, 'iban')}
                      className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1 shrink-0"
                    >
                      {copiedKey === 'iban' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'iban' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-950 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> EasyPaisa
                      </span>
                      <span className="font-mono text-slate-800 text-[11px]">{advanceSettings.easypaisaNumber}</span>
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

                  <div className="bg-red-50/70 p-2.5 rounded-lg border border-red-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-red-950 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-red-600" /> JazzCash
                      </span>
                      <span className="font-mono text-slate-800 text-[11px]">{advanceSettings.jazzcashNumber}</span>
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

                {order.advanceTransactionRef && (
                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Customer Provided Reference / TID:</span>
                    <span className="font-mono font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {order.advanceTransactionRef}
                    </span>
                  </div>
                )}
              </div>

              {/* WhatsApp Payment Proof Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Phone className="w-4 h-4" />
                <span>Send Advance Payment Screenshot on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Order Date</span>
                <span className="font-bold text-slate-900">{order.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Estimated Delivery</span>
                <span className="font-bold text-slate-900">{order.estimatedDelivery}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Payment Mode</span>
                <span className="font-bold text-slate-900">
                  {order.requiresAdvance ? `20% Advance + COD` : order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Delivery Address
            </h3>
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1 text-xs text-slate-700">
              <p className="font-bold text-sm text-slate-900">{order.customerInfo.fullName}</p>
              <p className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{order.customerInfo.phoneNumber}</span>
              </p>
              <p className="flex items-start gap-1.5 text-slate-600 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.province} {order.customerInfo.postalCode}
                </span>
              </p>
              {order.customerInfo.orderNotes && (
                <p className="text-[11px] text-slate-500 italic pt-1">
                  Note: "{order.customerInfo.orderNotes}"
                </p>
              )}
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Ordered Items ({order.items.reduce((t, i) => t + i.quantity, 0)})
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {product.title}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Qty: {quantity} × {formatPrice(product.salePrice)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-950">
                    {formatPrice(product.salePrice * quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              {order.shippingFee === 0 ? (
                <span className="font-bold text-emerald-600 uppercase">FREE</span>
              ) : (
                <span className="font-bold text-slate-900">{formatPrice(order.shippingFee)}</span>
              )}
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-950">
              <span>Total Order Value:</span>
              <span className="text-lg">{formatPrice(order.total)}</span>
            </div>

            {order.requiresAdvance && (
              <div className="pt-2 border-t border-dashed border-amber-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-amber-900 font-bold">
                  <span>Advance Deposit Required ({order.advancePercentage || 20}%):</span>
                  <span>{formatPrice(order.advanceAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Balance Payable on Delivery (COD):</span>
                  <span>{formatPrice(order.remainingBalance || 0)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo({ type: 'shop', category: 'all' })}
              className="w-full sm:w-auto py-3 px-8 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
