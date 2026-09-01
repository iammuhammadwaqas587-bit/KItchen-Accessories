import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Clock, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  ChevronRight,
  Phone,
  ThumbsUp,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Product, Review } from '../types';

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { 
    getProductById, 
    allProducts, 
    addToCart, 
    navigateTo, 
    formatPrice, 
    toggleWishlist, 
    isInWishlist, 
    addToast 
  } = useShop();

  const product = getProductById(productId) || allProducts[0];
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specs' | 'shipping' | 'reviews'>('description');

  // Customer Review Form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews);

  const isFavorite = isInWishlist(product.id);
  const discountPercent = product.isSale && product.originalPrice > product.salePrice
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;

  const imagesList = [product.image, ...(product.additionalImages || [])];

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestSeller))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false);
    navigateTo({ type: 'checkout' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on KitchenKart Pakistan!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('Link Copied', 'Product link copied to clipboard.', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      addToast('Incomplete Review', 'Please provide your name and review details.', 'warning');
      return;
    }

    const review: Review = {
      id: `rev_${Date.now()}`,
      author: newReviewAuthor.trim(),
      city: newReviewCity.trim() || 'Pakistan',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      verified: true,
    };

    setLocalReviews([review, ...localReviews]);
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewComment('');
    addToast('Review Submitted', 'Thank you for sharing your feedback!', 'success');
  };

  return (
    <div id={`product-detail-${product.id}`} className="min-h-screen bg-white pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <button
              type="button"
              onClick={() => navigateTo({ type: 'home' })}
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              type="button"
              onClick={() => navigateTo({ type: 'shop', category: 'all' })}
              className="hover:text-slate-900 transition-colors"
            >
              Shop
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              type="button"
              onClick={() => navigateTo({ type: 'category', category: product.category })}
              className="hover:text-slate-900 transition-colors"
            >
              {product.categoryName}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-xs">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Layout (Left: Square Image Gallery, Right: Details & Purchase) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: LARGE SQUARE IMAGE & THUMBNAILS */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-xs">
              <img
                src={selectedImage}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                {product.isSale && (
                  <span className="inline-flex items-center px-3 py-1 rounded bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-sm">
                    SALE {discountPercent > 0 && `-${discountPercent}%`}
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="inline-flex items-center px-3 py-1 rounded bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm">
                    BEST SELLER
                  </span>
                )}
              </div>

              {/* Wishlist and Share */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="w-10 h-10 rounded-full bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white flex items-center justify-center shadow-md transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail selector */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === imgUrl ? 'border-slate-900 scale-95 shadow-sm' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Mini Guaranteed Dispatch Banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-around text-xs text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-bold text-slate-900">100% Original</span>
                <span className="text-[10px] text-slate-500">Inspected Quality</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-amber-600 mb-1" />
                <span className="font-bold text-slate-900">Cash on Delivery</span>
                <span className="text-[10px] text-slate-500">Pay at Doorstep</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-sky-600 mb-1" />
                <span className="font-bold text-slate-900">7 Days Return</span>
                <span className="text-[10px] text-slate-500">Easy Replacement</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT TITLE, PRICING, & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                {product.categoryName}
              </span>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2.5 leading-tight">
                {product.title}
              </h1>

              {/* Rating and review counter */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">
                  {product.rating} / 5.0
                </span>
                <span className="text-xs text-slate-400">•</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  {localReviews.length} Verified Customer Reviews
                </button>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-950">
                  {formatPrice(product.salePrice)}
                </span>
                {product.isSale && product.originalPrice > product.salePrice && (
                  <span className="text-lg text-slate-400 line-through font-medium">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-100 border border-rose-200">
                    SAVE {formatPrice(product.originalPrice - product.salePrice)} ({discountPercent}% OFF)
                  </span>
                )}
              </div>

              {/* Stock status indicator */}
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>In Stock — Ready to dispatch from Karachi within 24 hours</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Key highlights bullets */}
            <div className="space-y-1.5 bg-amber-50/40 p-3.5 rounded-xl border border-amber-100 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 mb-1">Key Highlights:</h4>
              {product.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 py-1 text-sm font-extrabold text-slate-900 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Action Buttons: ADD TO CART & BUY NOW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  id="pdp-add-to-cart-btn"
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  id="pdp-buy-now-btn"
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>BUY NOW (COD)</span>
                </button>
              </div>
            </div>

            {/* Below CTA: Free Delivery Alert */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="font-semibold">
                  FREE DELIVERY ON ORDERS ABOVE <strong>Rs. 4,999</strong>
                </span>
              </div>
              <span className="text-[11px] text-amber-300 font-bold hidden sm:inline">
                Cash on Delivery
              </span>
            </div>

            {/* WhatsApp Direct Order helper */}
            <div className="pt-1 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span>Prefer ordering on WhatsApp?</span>
              <a
                href={`https://wa.me/923001234567?text=Hi%20KitchenKart,%20I%20want%20to%20order%20${encodeURIComponent(product.title)}%20(Rs.%20${product.salePrice})`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Order via WhatsApp
              </a>
            </div>

          </div>
        </div>

        {/* PRODUCT INFORMATION TABS (Description, Features, Specifications, Shipping & Returns, Customer Reviews) */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          
          {/* Tabs Navigation */}
          <div className="flex items-center justify-center gap-2 sm:gap-6 border-b border-slate-200 overflow-x-auto pb-px text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'description'
                  ? 'border-slate-900 text-slate-950 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Description
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'features'
                  ? 'border-slate-900 text-slate-950 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Features & Benefits
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'specs'
                  ? 'border-slate-900 text-slate-950 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Specifications
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'shipping'
                  ? 'border-slate-900 text-slate-950 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Shipping & Returns
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'reviews'
                  ? 'border-slate-900 text-slate-950 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Customer Reviews ({localReviews.length})
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="py-8 max-w-4xl mx-auto">
            
            {/* 1. DESCRIPTION TAB */}
            {activeTab === 'description' && (
              <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  About {product.title}
                </h3>
                <p>{product.description}</p>
                <p>
                  At KitchenKart, all products are carefully inspected before packing to ensure zero defects, razor-sharp blades, and long-lasting durability for daily Pakistani cooking needs.
                </p>
              </div>
            )}

            {/* 2. FEATURES TAB */}
            {activeTab === 'features' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Key Product Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm text-slate-800 font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SPECIFICATIONS TAB */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Technical Specifications
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <div key={idx} className="grid grid-cols-3 p-3.5 text-xs sm:text-sm">
                      <span className="font-bold text-slate-600">{key}</span>
                      <span className="col-span-2 text-slate-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SHIPPING & RETURNS TAB */}
            {activeTab === 'shipping' && (
              <div className="space-y-6 text-sm text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Truck className="w-5 h-5 text-amber-600" />
                      <h4>Delivery Across Pakistan</h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li>• <strong>Karachi & Lahore:</strong> 1-2 business days</li>
                      <li>• <strong>Islamabad, Rawalpindi, Faisalabad:</strong> 2-3 business days</li>
                      <li>• <strong>Rest of Pakistan:</strong> 3-4 business days</li>
                      <li>• <strong>Courier Partners:</strong> Trax, Call Courier, TCS, Leopards</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <RotateCcw className="w-5 h-5 text-emerald-600" />
                      <h4>7-Day Return & Replacement</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If the item is broken, defective, or missing accessories, simply message our WhatsApp support (+92 300 1234567) with a photo. We will dispatch a free replacement immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CUSTOMER REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Reviews summary bar */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left">
                    <div className="text-4xl font-black text-slate-900">{product.rating}</div>
                    <div className="flex items-center text-amber-400 my-1 justify-center sm:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Based on {localReviews.length} verified customer reviews</p>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="text-xs font-bold text-emerald-700">98% of customers recommend this gadget</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Verified buyers across Karachi, Lahore & Islamabad</p>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {localReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{rev.city}, Pakistan • {rev.date}</span>
                        </div>

                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>

                {/* Write a Review Form */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    Write a Customer Review
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Fatima Ali"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={newReviewCity}
                          onChange={(e) => setNewReviewCity(e.target.value)}
                          placeholder="e.g. Lahore / Karachi"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Rating (Stars)
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Feedback / Experience *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Share details about the quality, ease of use, chopping performance, delivery speed..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wide transition-colors"
                    >
                      SUBMIT REVIEW
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                YOU MAY ALSO LIKE
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Other popular kitchen gadgets frequently bought together.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
