import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  LogOut,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  Edit2,
  Check,
  Lock,
  KeyRound,
  ShieldAlert,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { evaluatePasswordStrength } from '../utils/security';

interface AccountPageProps {
  initialTab?: 'orders' | 'profile' | 'addresses' | 'security' | 'wishlist';
}

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = 'orders' }) => {
  const {
    currentUser,
    isAdmin,
    orders,
    logout,
    updateUserProfile,
    changePassword,
    formatPrice,
    navigateTo,
    securitySettings,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'security'>(
    initialTab === 'wishlist' ? 'orders' : initialTab === 'security' ? 'security' : initialTab
  );

  // Profile Edit State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [province, setProvince] = useState(currentUser?.province || 'Punjab');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const passwordStrength = evaluatePasswordStrength(newPassword);

  // Filter orders placed by this customer (or match by phone/email)
  const customerOrders = orders.filter(
    (o) =>
      (currentUser && o.userId === currentUser.id) ||
      (currentUser?.email && o.customerInfo.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentUser?.phone && o.customerInfo.phoneNumber === currentUser.phone)
  );

  // If not logged in, prompt sign in
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Customer Account
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              Sign in to view your order history, manage delivery addresses, and track real-time shipments across Pakistan.
            </p>
          </div>
          <button
            onClick={() => navigateTo({ type: 'auth', initialMode: 'login' })}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors shadow-xs"
          >
            Sign in to Your Account
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      address,
      city,
      province,
      postalCode,
    });
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('Please complete all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setPassSuccess('Your password has been changed securely.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(res.message);
      }
    } catch {
      setPassError('An unexpected error occurred while updating your password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 font-black text-xl flex items-center justify-center shadow-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] uppercase rounded-full">
                    Admin
                  </span>
                )}
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full">
                  Verified Active
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{currentUser.email}</span>
                {currentUser.phone && <span>• {currentUser.phone}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigateTo({ type: 'admin' })}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard
              </button>
            )}
            <button
              onClick={logout}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            My Orders ({customerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'addresses'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Delivery Address
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Account Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Security & Password
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {customerOrders.length > 0 ? (
              customerOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {order.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Payment: <strong>{order.paymentMethod}</strong>
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Processing'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <Truck className="w-3 h-3" />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.product.title}</p>
                            <p className="text-slate-500">Qty: {item.quantity} × {formatPrice(item.product.salePrice)}</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-slate-900 font-mono">
                          {formatPrice(item.product.salePrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer total */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="text-slate-500">
                      Shipping to: {order.customerInfo.city}, {order.customerInfo.province}
                    </span>
                    <span className="text-sm">
                      Total: <strong className="text-emerald-700">{formatPrice(order.total)}</strong>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-800">No orders placed yet.</p>
                <p className="text-xs text-slate-500 mt-1">Explore our smart kitchen gadgets and start shopping!</p>
                <button
                  onClick={() => navigateTo({ type: 'shop' })}
                  className="mt-4 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Default Delivery Address
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street, Block, Area..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore / Karachi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad Capital Territory">Islamabad</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 54000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Save Delivery Address
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ACCOUNT DETAILS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-amber-500" />
              Customer Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  WhatsApp / Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Update Profile
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Change Password Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                Change Password
              </h3>

              {passSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passSuccess}</span>
                </div>
              )}

              {passError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{passError}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>
                  {newPassword.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">Strength:</span>
                        <span className={`font-bold px-1.5 py-0.2 rounded ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-200">
                        <div className={`h-full ${passwordStrength.score >= 1 ? 'bg-amber-400' : 'bg-transparent'}`} />
                        <div className={`h-full ${passwordStrength.score >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                        <div className={`h-full ${passwordStrength.score >= 3 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                        <div className={`h-full ${passwordStrength.score >= 4 ? 'bg-emerald-600' : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-type new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {isChangingPass ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Session & Security Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Session & Privacy Protection
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Session Timeout</span>
                  <p className="text-slate-500 text-[11px]">
                    Automatic session expiry after {securitySettings.sessionTimeoutMinutes} minutes of inactivity to protect your account.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Brute-force Shield</span>
                  <p className="text-slate-500 text-[11px]">
                    Account lockout activates after {securitySettings.maxFailedAttempts} consecutive failed password attempts.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Encrypted Storage</span>
                  <p className="text-slate-500 text-[11px]">
                    Passwords are never stored in plaintext and are hashed via cryptographic SHA-256 algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

