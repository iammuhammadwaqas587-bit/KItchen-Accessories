import React from 'react';
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Headphones, 
  Flame, 
  Star, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { CategoryId } from '../types';

export const HomePage: React.FC = () => {
  const { allProducts, navigateTo } = useShop();

  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const choppers = allProducts.filter((p) => p.category === 'choppers-cutters').slice(0, 4);
  const gadgets = allProducts.filter((p) => p.category === 'kitchen-gadgets').slice(0, 4);
  const storage = allProducts.filter((p) => p.category === 'storage-organizers').slice(0, 4);
  const essentials = allProducts.filter((p) => p.category === 'kitchen-essentials').slice(0, 4);

  const handleCategoryClick = (catId: CategoryId) => {
    navigateTo({ type: 'category', category: catId });
  };

  return (
    <div id="home-page" className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-slate-200/80 py-10 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left/Center Text Content */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200/70 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Pakistan's #1 Kitchen Innovation Store</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase leading-[1.15]">
                Smart Gadgets For A <br className="hidden sm:inline" />
                <span className="text-amber-600">Smarter Kitchen</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover practical and affordable kitchen gadgets that make everyday cooking easier. Built for daily Pakistani cooking, chopping, and organizing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  id="hero-shop-now-btn"
                  type="button"
                  onClick={() => navigateTo({ type: 'shop', category: 'all' })}
                  className="py-3 px-6 sm:px-8 rounded-xl bg-slate-900 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-md flex items-center gap-2"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-best-sellers-btn"
                  type="button"
                  onClick={() => navigateTo({ type: 'shop', category: 'best-sellers' })}
                  className="py-3 px-6 sm:px-8 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-2xs flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>BEST SELLERS</span>
                </button>
              </div>

              {/* Mini Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Cash on Delivery
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Free Shipping over Rs. 4,999
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  4.8/5 (2,400+ Reviews)
                </span>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-4/3 sm:aspect-16/11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&h=800&q=80"
                    alt="Modern Kitchen Gadgets"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform hover:scale-103 transition-transform duration-700"
                  />
                </div>

                {/* Floating highlight badge */}
                <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-lg flex items-center gap-3 max-w-xs">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                    40%
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Up to 40% Off</h5>
                    <p className="text-[11px] text-slate-500">On Vegetable Choppers & Storage</p>
                  </div>
                </div>

                {/* Floating stock badge */}
                <div className="hidden sm:flex absolute -top-3 -right-3 bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Ready to Dispatch in Pakistan
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            SHOP BY CATEGORY
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Browse our curated collection of handy kitchen tools designed for Pakistani homes.
          </p>
        </div>

        {/* 6 Square Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              id={`category-card-${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
              className="group flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {/* Square Category Image */}
              <div className="w-full aspect-square rounded-lg bg-slate-100 overflow-hidden mb-2.5 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
                />
              </div>

              {/* Category Name Centered Underneath */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {category.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {category.itemCount} Items
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="py-12 sm:py-16 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading & Subtitle */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              Customer Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              BEST SELLERS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Popular kitchen essentials loved by our customers across Pakistan.
            </p>
          </div>

          {/* Product Grid (4 desktop, 3 tablet, 2 mobile) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => navigateTo({ type: 'shop', category: 'best-sellers' })}
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 hover:border-slate-900 transition-all duration-200 shadow-2xs"
            >
              <span>VIEW ALL BEST SELLERS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SALE PROMOTIONAL BANNER */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white overflow-hidden p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-xl text-center sm:text-left space-y-3">
            <span className="inline-block px-2.5 py-1 rounded bg-rose-600 text-white font-black text-[11px] uppercase tracking-wider">
              LIMITED TIME MEGA OFFER
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
              UPGRADE YOUR KITCHEN
            </h2>
            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              Smart tools. Better cooking. Easier everyday life. Grab up to 40% off on all cooking essentials & multi-cutters today.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigateTo({ type: 'shop', category: 'sale' })}
                className="py-3 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors shadow-md inline-flex items-center gap-2"
              >
                <span>SHOP SALE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS SECTION */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Just Landed
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            NEW ARRIVALS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Freshly imported gadgets to elevate your kitchen workspace.
          </p>
        </div>

        {/* 4 desktop, 3 tablet, 2 mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <button
            type="button"
            onClick={() => navigateTo({ type: 'shop', category: 'new-arrivals' })}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 hover:border-slate-900 transition-all duration-200 shadow-2xs"
          >
            <span>VIEW ALL NEW ARRIVALS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. CHOPPERS & CUTTERS SPOTLIGHT */}
      <section className="py-12 sm:py-16 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              CHOPPERS & CUTTERS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Save hours of tears and prep time with heavy-duty stainless steel manual and electric choppers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {choppers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => navigateTo({ type: 'category', category: 'choppers-cutters' })}
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 hover:border-slate-900 transition-all duration-200 shadow-2xs"
            >
              <span>VIEW ALL CHOPPERS & CUTTERS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. STORAGE & ORGANIZERS SECTION */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            STORAGE & ORGANIZERS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Say goodbye to cluttered countertops and disorganized spice shelves.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {storage.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <button
            type="button"
            onClick={() => navigateTo({ type: 'category', category: 'storage-organizers' })}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 hover:border-slate-900 transition-all duration-200 shadow-2xs"
          >
            <span>VIEW ALL ORGANIZERS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. COOKING ESSENTIALS SECTION */}
      <section className="py-12 sm:py-16 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              COOKING ESSENTIALS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Everyday silicone spatulas, measuring sets, strainers, and shears.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {essentials.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => navigateTo({ type: 'category', category: 'kitchen-essentials' })}
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 hover:border-slate-900 transition-all duration-200 shadow-2xs"
            >
              <span>VIEW ALL COOKING ESSENTIALS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. WHY SHOP WITH US (4 Feature Blocks) */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            WHY SHOP WITH US
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We provide a seamless online shopping experience across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center text-center group hover:border-amber-400 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase">
              FAST DELIVERY
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Delivery across Pakistan in 2-4 business days directly to your doorstep.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center text-center group hover:border-emerald-400 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase">
              CASH ON DELIVERY
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Pay conveniently when your order arrives at your house with zero advance risk.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center text-center group hover:border-amber-400 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase">
              QUALITY PRODUCTS
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Useful, durable products strictly tested and selected for heavy everyday kitchen use.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center text-center group hover:border-sky-400 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Headphones className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase">
              CUSTOMER SUPPORT
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Friendly WhatsApp and call assistance whenever you need help or order tracking.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
