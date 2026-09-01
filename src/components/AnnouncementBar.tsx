import React from 'react';
import { Truck, ShieldCheck, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AnnouncementBar: React.FC = () => {
  const { cartSubtotal, hasFreeShipping, amountUntilFreeShipping, formatPrice } = useShop();

  return (
    <div id="announcement-bar" className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left perk on desktop */}
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            Cash on Delivery Available Across Pakistan
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            7-Day Easy Return Policy
          </span>
        </div>

        {/* Center Main Message */}
        <div className="w-full md:w-auto text-center font-semibold tracking-wide flex items-center justify-center gap-2">
          {cartSubtotal > 0 && !hasFreeShipping ? (
            <span className="text-amber-300 animate-pulse flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Add {formatPrice(amountUntilFreeShipping)} more for <strong>FREE SHIPPING!</strong>
            </span>
          ) : hasFreeShipping ? (
            <span className="text-emerald-300 font-bold flex items-center gap-1.5">
              🎉 Congratulations! You unlocked <strong>FREE SHIPPING!</strong>
            </span>
          ) : (
            <span>
              🚚 FREE SHIPPING ON ALL ORDERS ABOVE <strong className="text-amber-400">Rs. 4,999</strong>
            </span>
          )}
        </div>

        {/* Right Help / Contact */}
        <div className="hidden lg:flex items-center gap-3 text-slate-300">
          <span>Need help? WhatsApp: <strong className="text-white">+92 300 1234567</strong></span>
        </div>
      </div>
    </div>
  );
};
