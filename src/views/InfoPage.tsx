import React from 'react';
import { 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface InfoPageProps {
  pageType: 'about' | 'contact' | 'faq' | 'shipping' | 'returns';
}

export const InfoPage: React.FC<InfoPageProps> = ({ pageType }) => {
  const { navigateTo } = useShop();

  return (
    <div id="info-page" className="min-h-screen bg-white py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8 border-b border-slate-200 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => navigateTo({ type: 'info', infoType: 'about' })}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              pageType === 'about' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => navigateTo({ type: 'info', infoType: 'faq' })}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              pageType === 'faq' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            FAQs
          </button>
          <button
            type="button"
            onClick={() => navigateTo({ type: 'info', infoType: 'shipping' })}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              pageType === 'shipping' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Shipping Policy
          </button>
          <button
            type="button"
            onClick={() => navigateTo({ type: 'info', infoType: 'returns' })}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              pageType === 'returns' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Returns & Refunds
          </button>
          <button
            type="button"
            onClick={() => navigateTo({ type: 'info', infoType: 'contact' })}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              pageType === 'contact' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Contact Us
          </button>
        </div>

        {/* 1. ABOUT US */}
        {pageType === 'about' && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                ABOUT IDEAL COLLECTIONS
              </h1>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Empowering Pakistani homes & kitchens with smart, durable, and practical cooking gadgets and lifestyle organizers.
              </p>
            </div>

            <div className="prose text-slate-700 text-sm leading-relaxed space-y-4">
              <p>
                <strong>Ideal Collections</strong> was founded with a single mission: to eliminate tedious kitchen labor and simplify everyday living for Pakistani families. Cooking traditional dishes—from rich curries, biryani, and nihari to everyday chopped salads and roti—requires significant time and prep work.
              </p>
              <p>
                We source top-tier kitchen innovations and bring heavy-duty manual and electric choppers, spice organizers, oil sprayers, and non-stick gadgets directly to Pakistani households at affordable rates with <strong>Cash on Delivery</strong>.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 not-prose">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-2xl font-black text-slate-900 block">50,000+</span>
                  <span className="text-xs text-slate-500">Satisfied Pakistani Households</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-2xl font-black text-slate-900 block">2-4 Days</span>
                  <span className="text-xs text-slate-500">Doorstep Delivery Nationwide</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-2xl font-black text-slate-900 block">4.8 / 5.0</span>
                  <span className="text-xs text-slate-500">Customer Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. FREQUENTLY ASKED QUESTIONS (FAQS) */}
        {pageType === 'faq' && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                FREQUENTLY ASKED QUESTIONS
              </h1>
              <p className="text-sm text-slate-600">
                Everything you need to know about ordering and delivery across Pakistan.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Do you offer Cash on Delivery (COD)?',
                  a: 'Yes! Cash on Delivery is available for 100% of cities and towns across Pakistan. You only pay when the rider brings the parcel to your doorstep.'
                },
                {
                  q: 'How long does delivery take?',
                  a: 'Delivery to major cities (Karachi, Lahore, Islamabad, Rawalpindi) typically takes 1-3 business days. Other cities and rural areas take 2-4 business days via Trax, TCS, or Call Courier.'
                },
                {
                  q: 'What is the shipping fee?',
                  a: 'We offer FREE Delivery on all orders of Rs. 4,999 or more. For orders below Rs. 4,999, a flat delivery fee of Rs. 199 applies nationwide.'
                },
                {
                  q: 'Can I check the parcel before paying?',
                  a: 'Yes, you can open and verify the parcel before handing the cash to the courier representative.'
                },
                {
                  q: 'What if a product arrives damaged or broken?',
                  a: 'We have a hassle-free 7-day replacement policy. Simply send a short video or picture of the defective item to our WhatsApp (+92 300 1234567) and we will send a brand new piece at zero extra cost.'
                },
                {
                  q: 'How can I place an order directly on WhatsApp?',
                  a: 'You can tap the "WhatsApp Order" button on any product page or message +92 300 1234567 with your delivery address and item name.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{item.q}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SHIPPING POLICY */}
        {pageType === 'shipping' && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                SHIPPING & DELIVERY POLICY
              </h1>
              <p className="text-sm text-slate-600">
                Transparent and fast courier delivery across all 4 provinces of Pakistan.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  Order Dispatch Timeline
                </h3>
                <p>
                  All confirmed orders are processed and handed over to our logistics partners (Trax / Call Courier / TCS) within 24 business hours from our central Karachi warehouse.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-base font-bold text-slate-900">Delivery Rates</h3>
                <p>• Orders Rs. 4,999 and above: <strong>FREE SHIPPING NATIONWIDE</strong></p>
                <p>• Orders under Rs. 4,999: Flat fee of <strong>Rs. 199</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* 4. RETURNS & REFUNDS */}
        {pageType === 'returns' && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                7-DAY RETURN & REFUND POLICY
              </h1>
              <p className="text-sm text-slate-600">
                100% Risk-Free Guarantee on all kitchen gadgets.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                We want you to love every tool in your kitchen. If you receive an item with manufacturing faults, damaged parts, or incorrect specifications, you are eligible for an immediate replacement or full refund within 7 days of delivery.
              </p>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <h3 className="font-bold flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  How to Request a Replacement:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Take a short photo/video of the issue.</li>
                  <li>WhatsApp our team at <strong>+92 300 1234567</strong> with your Order Number.</li>
                  <li>Our courier rider will deliver your new item and pick up the defective piece.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONTACT US */}
        {pageType === 'contact' && (
          <div className="space-y-8">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                CONTACT CUSTOMER SUPPORT
              </h1>
              <p className="text-sm text-slate-600">
                Have questions or need help with your kitchen order? Reach out anytime!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center hover:border-emerald-500 transition-colors group block"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">WhatsApp & Call</h3>
                <p className="text-xs text-slate-600 mt-1">+92 300 1234567</p>
                <span className="text-[11px] text-emerald-700 font-bold block mt-2">Instant Chat</span>
              </a>

              <a
                href="mailto:support@kitchenkart.pk"
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center hover:border-amber-500 transition-colors group block"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Email Support</h3>
                <p className="text-xs text-slate-600 mt-1">support@kitchenkart.pk</p>
                <span className="text-[11px] text-slate-400 block mt-2">Replies in 2-4 hours</span>
              </a>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Support Hours</h3>
                <p className="text-xs text-slate-600 mt-1">Mon - Sat: 9 AM - 9 PM</p>
                <span className="text-[11px] text-slate-400 block mt-2">Pakistan Standard Time</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
