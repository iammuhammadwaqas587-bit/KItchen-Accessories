import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const TrackOrderPage: React.FC = () => {
  const { orders, formatPrice } = useShop();
  const [orderQuery, setOrderQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const matchedOrder = orders.find(
    (o) => o.orderNumber.toLowerCase() === orderQuery.trim().toLowerCase() ||
           o.customerInfo.phoneNumber.includes(orderQuery.trim())
  ) || (orderQuery.trim() === 'KK-98421' ? {
    id: 'sample_order',
    orderNumber: 'KK-98421',
    date: '28 Aug 2024',
    items: [],
    subtotal: 3198,
    shippingFee: 0,
    discount: 0,
    total: 3198,
    status: 'shipped' as const,
    customerInfo: {
      fullName: 'Hamza Tariq',
      phoneNumber: '03211234567',
      address: 'House # 45, Street 12, DHA Phase 5',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54000',
    },
    paymentMethod: 'Cash on Delivery' as const,
    estimatedDelivery: '30 Aug - 01 Sep 2024'
  } : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setSearched(true);
  };

  return (
    <div id="track-order-page" className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            TRACK YOUR ORDER
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enter your 5-digit Order Number (e.g. KK-10293) or Mobile Number to check real-time courier status across Pakistan.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => {
                  setOrderQuery(e.target.value);
                  setSearched(false);
                }}
                placeholder="Order Number (e.g. KK-98421) or Phone"
                className="w-full pl-9 pr-3 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wide transition-colors"
            >
              TRACK
            </button>
          </form>
          <p className="text-[11px] text-slate-400 mt-2">
            Tip: Try testing with sample order number <strong className="text-slate-700">KK-98421</strong>
          </p>
        </div>

        {/* Tracking Result */}
        {searched && (
          matchedOrder ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Trax Logistics Express</span>
                  <h3 className="text-base font-extrabold text-slate-900">Order #{matchedOrder.orderNumber}</h3>
                  <span className="text-xs text-slate-500">{matchedOrder.customerInfo.city}, Pakistan</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                  In Transit
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  <h4 className="text-xs font-bold text-slate-900">Order Placed & Confirmed</h4>
                  <p className="text-[11px] text-slate-500">Order received and verified via SMS</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  <h4 className="text-xs font-bold text-slate-900">Packed & Quality Inspected</h4>
                  <p className="text-[11px] text-slate-500">Karachi Central Warehouse</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-xs animate-pulse" />
                  <h4 className="text-xs font-bold text-amber-800">In Transit with Courier (Trax)</h4>
                  <p className="text-[11px] text-slate-500">Dispatched towards destination hub</p>
                </div>

                <div className="relative opacity-50">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-300 border-2 border-white shadow-xs" />
                  <h4 className="text-xs font-bold text-slate-700">Out for Delivery</h4>
                  <p className="text-[11px] text-slate-500">Rider will call before arriving at your door</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Total Amount Due (COD):</span>
                <span className="font-extrabold text-sm text-slate-950">{formatPrice(matchedOrder.total)}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">Order Not Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't locate an order with "{orderQuery}". Please check your order confirmation SMS or contact our WhatsApp support team.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
};
