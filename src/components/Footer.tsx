import React, { useState } from 'react';
import { Sparkles, Mail, Phone, MapPin, Truck, ShieldCheck, Clock, CheckCircle2, ArrowRight, Instagram, Facebook, Youtube, Shield } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryId } from '../types';

export const Footer: React.FC = () => {
  const { navigateTo, addToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }
    setSubscribed(true);
    addToast('Subscribed!', 'Thank you for subscribing to Ideal Collections VIP deals.', 'success');
    setEmail('');
  };

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 pt-12 pb-16 lg:pb-12 border-t border-slate-800">
      {/* Top Value Badges in Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">2-4 business days all over Pakistan</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pay safely upon doorstep arrival</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">WhatsApp assistance 7 days a week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Ideal <span className="text-amber-400">Collections</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Smart, modern kitchen gadgets and space-saving organizers for home and everyday cooking across Pakistan.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Gulberg III & DHA Phase 5, Lahore & Karachi, Pakistan</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Helpline / WhatsApp: +92 300 1234567 (9am - 9pm PKT)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@idealcollections.pk</span>
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#youtube" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'home' })}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'shop', category: 'all' })}
                  className="hover:text-white transition-colors"
                >
                  Shop All Gadgets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'shop', category: 'best-sellers' })}
                  className="hover:text-white transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'shop', category: 'new-arrivals' })}
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'shop', category: 'sale' })}
                  className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                >
                  Sale (Up to 50% Off)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'track-order' })}
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Account & Admin
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'account' })}
                  className="hover:text-white transition-colors"
                >
                  My Customer Account
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'auth', initialMode: 'login' })}
                  className="hover:text-white transition-colors"
                >
                  Sign In / Register
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'admin' })}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'info', infoType: 'faq' })}
                  className="hover:text-white transition-colors"
                >
                  Help & FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo({ type: 'info', infoType: 'contact' })}
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get new arrivals and special discount voucher codes sent to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-hidden focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Subscribed successfully! Use code <strong>WELCOME10</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar / Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Ideal Collections Pakistan. All rights reserved.</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-semibold mr-1">Accepted Payment:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
            Cash on Delivery (COD)
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
            Direct Bank Transfer
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
            EasyPaisa / JazzCash
          </span>
        </div>
      </div>
    </footer>
  );
};
