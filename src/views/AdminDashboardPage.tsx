import React, { useState, useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  Tag,
  BarChart3,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Check,
  X,
  Phone,
  MapPin,
  ArrowRight,
  TrendingUp,
  Percent,
  RefreshCw,
  Settings,
  Building2,
  Smartphone,
  Save,
  CreditCard,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Order, CategoryId, AdvancePaymentSettings } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductFormModal } from '../components/ProductFormModal';
import { AdminSecurityTab } from '../components/AdminSecurityTab';

export const AdminDashboardPage: React.FC = () => {
  const {
    allProducts,
    deleteProduct,
    updateProduct,
    resetProductsToDefault,
    orders,
    updateOrderStatus,
    deleteOrder,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    currentUser,
    isAdmin,
    loginAsDemoAdmin,
    formatPrice,
    navigateTo,
    addToast,
    advanceSettings,
    updateAdvanceSettings,
    updateOrderAdvanceStatus,
    securitySettings,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'coupons' | 'settings' | 'security'>('products');
  
  // Product Management State
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order Management State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Coupon Creation State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPct, setNewCouponPct] = useState<number>(10);
  const [newCouponFlat, setNewCouponFlat] = useState<number>(0);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState<number>(0);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<AdvancePaymentSettings>({ ...advanceSettings });

  // Sync settingsForm if advanceSettings changes from context
  React.useEffect(() => {
    setSettingsForm({ ...advanceSettings });
  }, [advanceSettings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdvanceSettings(settingsForm);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(productSearch.toLowerCase())) ||
        p.handle.toLowerCase().includes(productSearch.toLowerCase());
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [allProducts, productSearch, selectedCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerInfo.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerInfo.phoneNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerInfo.city.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Analytics Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  }, [orders]);

  const inStockCount = useMemo(() => allProducts.filter((p) => p.inStock).length, [allProducts]);
  const outOfStockCount = allProducts.length - inStockCount;

  // Handle Add / Edit
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPct: newCouponPct > 0 ? Number(newCouponPct) : undefined,
      flatDiscount: newCouponFlat > 0 ? Number(newCouponFlat) : undefined,
      minSpend: newCouponMinSpend > 0 ? Number(newCouponMinSpend) : undefined,
      description: newCouponDesc.trim() || `${newCouponCode} voucher promo`,
      isActive: true,
      usageCount: 0,
    });

    setNewCouponCode('');
    setNewCouponPct(10);
    setNewCouponFlat(0);
    setNewCouponMinSpend(0);
    setNewCouponDesc('');
  };

  // If not logged in as Admin, show protective authorization screen
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Ideal Collections Admin Portal
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Protected console requiring Administrator privileges. Product catalogue management, order dispatches, and store security policies are restricted.
            </p>
          </div>

          {securitySettings.productionLock ? (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1 text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                Production Lockdown Active
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                One-click demo bypass is disabled. Please authenticate using verified administrator credentials.
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Demo Admin Credentials:</p>
              <p>Email: <span className="font-mono text-slate-900 font-bold">admin@idealcollections.pk</span></p>
              <p>Password: <span className="font-mono text-slate-900 font-bold">Admin@12345</span></p>
              <p>Role: <span className="font-mono text-slate-900 font-bold">Store Administrator</span></p>
            </div>
          )}

          <div className="space-y-3">
            {!securitySettings.productionLock && (
              <button
                onClick={loginAsDemoAdmin}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Sign in as Demo Administrator
              </button>
            )}
            <button
              onClick={() => navigateTo({ type: 'auth', initialMode: 'admin' })}
              className={`w-full py-3 px-4 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs ${
                securitySettings.productionLock ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{securitySettings.productionLock ? 'Sign In with Admin Credentials' : 'Open Admin Login Form'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 pb-16">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-sm">
                Admin Portal
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Ideal Collections Manager
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.email})
            </p>
          </div>

          {/* Quick Nav Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo({ type: 'home' })}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Storefront
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
            <button
              onClick={resetProductsToDefault}
              title="Reset catalog back to standard sample items"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Seed
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Sales (COD)</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{formatPrice(totalRevenue)}</p>
            <p className="text-[11px] text-slate-500 mt-1">From {orders.length} placed customer orders</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Catalogue Items</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{allProducts.length}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">{inStockCount} In Stock • {outOfStockCount} Out</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Orders to Dispatch</span>
              <Truck className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              {orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing').length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting Courier handoff</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Promo Vouchers</span>
              <Percent className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              {coupons.filter((c) => c.isActive).length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Discounts & Free Shipping codes</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white p-2 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            Manage Products ({allProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'coupons'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            Coupons & Vouchers ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            Advance Payment & Bank Policy
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'security'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Security & User Access
          </button>
        </div>

        {/* 1. PRODUCTS MANAGEMENT VIEW */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by title, tag, handle..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="all">All Categories ({allProducts.length})</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="whitespace-nowrap px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Products Table & Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Sale Price</th>
                      <th className="py-3.5 px-4">Original Price</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Badges</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Thumbnail & Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs sm:max-w-sm">
                              <h4 className="font-bold text-slate-900 text-xs truncate">
                                {p.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-mono truncate">
                                ID: {p.id} • /{p.handle}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-md text-[11px]">
                            {p.categoryName || p.category}
                          </span>
                        </td>

                        {/* Sale Price */}
                        <td className="py-3 px-4 whitespace-nowrap font-extrabold text-slate-900">
                          {formatPrice(p.salePrice)}
                        </td>

                        {/* Original Price */}
                        <td className="py-3 px-4 whitespace-nowrap text-slate-400 line-through">
                          {p.originalPrice > p.salePrice ? formatPrice(p.originalPrice) : '-'}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {p.inStock ? `In Stock (${p.stockCount})` : 'Out of Stock'}
                            </button>
                          </div>
                        </td>

                        {/* Badges */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {p.isBestSeller && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-sm text-[10px]">
                                Best Seller
                              </span>
                            )}
                            {p.isNewArrival && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-sm text-[10px]">
                                New
                              </span>
                            )}
                            {p.isSale && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 font-bold rounded-sm text-[10px]">
                                Sale
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete product "${p.title}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold">No products found matching your search.</p>
                          <button
                            onClick={() => {
                              setProductSearch('');
                              setSelectedCategory('all');
                            }}
                            className="text-xs text-slate-900 font-bold underline mt-2"
                          >
                            Clear search filters
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT VIEW */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Status Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Order #, Customer Name, City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Orders ({orders.length})</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {order.date}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        Customer: {order.customerInfo.fullName} ({order.customerInfo.phoneNumber})
                      </p>
                    </div>

                    {/* Status Changer & Advance Payment Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      {order.requiresAdvance && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-500">Advance:</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateOrderAdvanceStatus(
                                order.orderId,
                                order.advancePaymentStatus === 'Received' ? 'Pending' : 'Received'
                              )
                            }
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                              order.advancePaymentStatus === 'Received'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                            }`}
                            title="Click to toggle advance payment status"
                          >
                            {order.advancePaymentStatus === 'Received' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>Advance Received ({formatPrice(order.advanceAmount || 0)})</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-700" />
                                <span>Advance Pending ({formatPrice(order.advanceAmount || 0)})</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 font-semibold">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.orderId, e.target.value as Order['status'])
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-slate-900 ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : order.status === 'Dispatched'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : order.status === 'Processing'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : order.status === 'Cancelled'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched (Courier)</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete order record ${order.orderNumber}?`)) {
                            deleteOrder(order.orderId);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Info & Order Items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Delivery Details */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        Delivery Address
                      </div>
                      <p className="text-slate-700">{order.customerInfo.address}</p>
                      <p className="text-slate-500">
                        {order.customerInfo.city}, {order.customerInfo.province}{' '}
                        {order.customerInfo.postalCode}
                      </p>
                      {order.customerInfo.orderNotes && (
                        <p className="text-amber-800 text-[11px] font-medium bg-amber-50 p-1.5 rounded-sm">
                          Notes: {order.customerInfo.orderNotes}
                        </p>
                      )}

                      {order.advanceTransactionRef && (
                        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px] text-amber-900 mt-1">
                          <span className="font-bold block">Payment TID / Proof Reference:</span>
                          <span className="font-mono font-bold text-slate-900">{order.advanceTransactionRef}</span>
                        </div>
                      )}

                      <div className="pt-1">
                        <a
                          href={`https://wa.me/${order.customerInfo.phoneNumber.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                        >
                          <Phone className="w-3 h-3" /> WhatsApp Customer
                        </a>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="md:col-span-2 space-y-2">
                      <span className="font-bold text-slate-800 block">Ordered Items:</span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-8 h-8 rounded-sm object-cover shrink-0"
                              />
                              <span className="font-semibold text-slate-800 truncate">
                                {item.product.title}
                              </span>
                            </div>
                            <div className="text-right whitespace-nowrap pl-2">
                              <span className="font-mono text-slate-600">
                                {item.quantity} × {formatPrice(item.product.salePrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financial Breakdown with Advance Payment Detail */}
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="text-slate-500 font-normal">
                            Subtotal: {formatPrice(order.subtotal)} | Shipping: {formatPrice(order.shippingFee)}
                            {order.discount > 0 ? ` | Disc: -${formatPrice(order.discount)}` : ''}
                          </span>
                          <span className="text-sm">
                            Total: <strong className="text-slate-950">{formatPrice(order.total)}</strong>
                          </span>
                        </div>

                        {order.requiresAdvance ? (
                          <div className="bg-amber-50/80 p-2 rounded-lg border border-amber-200/80 flex flex-wrap items-center justify-between text-[11px] font-bold gap-2">
                            <span className="text-amber-900 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                              {order.advancePercentage || 20}% Advance Required: {formatPrice(order.advanceAmount || 0)}
                            </span>
                            <span className="text-emerald-800">
                              Remaining COD at Doorstep: {formatPrice(order.remainingBalance || 0)}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400">100% Cash on Delivery (Standard order)</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No orders match your filter criteria.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    When customers place orders via Cash on Delivery, they will appear here instantly.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. COUPONS & DISCOUNTS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Coupon Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                Create New Promo Code
              </h3>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EID20 or FLASH15"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 uppercase focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={newCouponPct}
                      onChange={(e) => {
                        setNewCouponPct(Number(e.target.value));
                        if (Number(e.target.value) > 0) setNewCouponFlat(0);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Flat PKR Off
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newCouponFlat}
                      onChange={(e) => {
                        setNewCouponFlat(Number(e.target.value));
                        if (Number(e.target.value) > 0) setNewCouponPct(0);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Min Spend Requirement (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newCouponMinSpend}
                    onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                    placeholder="0 for no minimum"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Description / Note
                  </label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. 10% off for Eid special"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors shadow-xs"
                >
                  Create Promo Voucher
                </button>
              </form>
            </div>

            {/* Coupons Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Vouchers in Ideal Collections
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm px-2.5 py-1 bg-slate-100 text-slate-900 border border-slate-200 rounded-md">
                          {c.code}
                        </span>
                        <button
                          onClick={() => toggleCouponStatus(c.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {c.discountPct ? `${c.discountPct}% Discount` : c.flatDiscount ? `Rs. ${c.flatDiscount} Off` : 'Free Shipping'}{' '}
                        {c.minSpend ? `(Min Spend: Rs. ${c.minSpend})` : ''} • Used {c.usageCount || 0} times
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                        title="Delete voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. ADVANCE PAYMENT POLICY & STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                      <Settings className="w-5 h-5" />
                    </span>
                    <h2 className="text-lg font-black text-slate-900">
                      Advance Payment & High-Value Order Policy
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                    Configure the threshold above which customers must deposit an advance percentage (e.g. 20% for orders &gt; 10,000 PKR) before warehouse dispatch. You can modify the threshold value, percentage, bank details, and mobile wallets anytime.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Policy Status:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm((prev) => ({ ...prev, enabled: !prev.enabled }))
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      settingsForm.enabled
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {settingsForm.enabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {settingsForm.enabled ? 'Policy Enabled' : 'Policy Disabled'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="pt-6 space-y-6">
                {/* 1. Policy Threshold & Percentage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                      Order Value Threshold (PKR) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        Rs.
                      </span>
                      <input
                        type="number"
                        required
                        min={500}
                        step={500}
                        value={settingsForm.threshold}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({
                            ...prev,
                            threshold: Number(e.target.value) || 0,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Orders with total value greater than this amount will require the configured advance deposit.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                      Advance Required (%) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={5}
                        max={100}
                        value={settingsForm.percentage}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({
                            ...prev,
                            percentage: Number(e.target.value) || 20,
                          }))
                        }
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        %
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      The percentage of the total order to be paid before dispatch (e.g. 20%). Remaining balance is paid on COD delivery.
                    </p>
                  </div>
                </div>

                {/* Calculation Example Card */}
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Live Policy Rule:</strong> Any cart total &gt;{' '}
                      <strong>{formatPrice(settingsForm.threshold)}</strong> will require a{' '}
                      <strong>{settingsForm.percentage}% advance deposit</strong> before dispatch.
                    </span>
                  </div>
                  <div className="font-mono text-[11px] bg-white px-3 py-1.5 rounded-lg border border-amber-300 font-bold shrink-0">
                    Example for Rs. 15,000 order: Advance Rs.{' '}
                    {Math.round((15000 * settingsForm.percentage) / 100).toLocaleString('en-PK')} • Remaining COD Rs.{' '}
                    {Math.round(15000 - (15000 * settingsForm.percentage) / 100).toLocaleString('en-PK')}
                  </div>
                </div>

                {/* 2. Bank & Account Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    Official Bank Account Information (Shown at Checkout)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.bankName}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, bankName: e.target.value }))
                        }
                        placeholder="e.g. Meezan Bank Limited"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Account Title
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.accountTitle}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, accountTitle: e.target.value }))
                        }
                        placeholder="e.g. Ideal Collections PVT LTD"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.accountNumber}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, accountNumber: e.target.value }))
                        }
                        placeholder="e.g. 01010102030405"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        IBAN Number
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.iban}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, iban: e.target.value }))
                        }
                        placeholder="e.g. PK00MEZN0001010102030405"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Mobile Wallets & WhatsApp */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    Mobile Wallets & Customer WhatsApp Confirmation Number
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-emerald-900 mb-1">
                        EasyPaisa Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.easypaisaNumber}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, easypaisaNumber: e.target.value }))
                        }
                        placeholder="03001234567"
                        className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-300 rounded-lg font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-red-900 mb-1">
                        JazzCash Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.jazzcashNumber}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, jazzcashNumber: e.target.value }))
                        }
                        placeholder="03001234567"
                        className="w-full px-3 py-2 bg-red-50/50 border border-red-300 rounded-lg font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        WhatsApp Number for Proof Verification
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsappConfirmationNumber}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({ ...prev, whatsappConfirmationNumber: e.target.value }))
                        }
                        placeholder="+923001234567"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Settings Button */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                  <button
                    type="submit"
                    className="py-3 px-8 rounded-xl bg-slate-900 hover:bg-amber-600 active:bg-amber-700 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Policy Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. SECURITY & USER ACCESS GOVERNANCE VIEW */}
        {activeTab === 'security' && <AdminSecurityTab />}
      </div>

      {/* Product Add / Edit Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
      />
    </div>
  );
};
