import React, { useState } from 'react';
import {
  ShieldCheck,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { evaluatePasswordStrength } from '../utils/security';

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'admin';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const {
    login,
    signup,
    loginAsDemoAdmin,
    loginAsDemoCustomer,
    navigateTo,
    securitySettings,
    isLockedOut,
    lockoutRemainingSeconds,
  } = useShop();

  const [mode, setMode] = useState<'login' | 'signup' | 'admin'>(initialMode);

  // Login / Signup State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = evaluatePasswordStrength(password);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password, mode === 'admin' ? 'admin' : undefined);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigateTo({ type: 'admin' });
        } else {
          navigateTo({ type: 'account' });
        }
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and email address');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup(name, email, password, phone);
      if (res.success) {
        navigateTo({ type: 'account' });
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreFillAdmin = () => {
    setEmail('admin@idealcollections.pk');
    setPassword('Admin@12345');
    setErrorMsg('');
  };

  const handlePreFillCustomer = () => {
    setEmail('customer@idealcollections.pk');
    setPassword('Customer@12345');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-100/60">
      <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 mb-3 shadow-inner">
            {mode === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            {mode === 'admin'
              ? 'Administrator Portal'
              : mode === 'signup'
              ? 'Create Customer Account'
              : 'Sign In to Ideal Collections'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'admin'
              ? 'Secure console for inventory, dispatch & store settings'
              : 'Track deliveries, manage addresses & enjoy fast checkout'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 grid grid-cols-3 bg-slate-800/90 p-1 rounded-xl text-xs font-bold border border-slate-700/80">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-1.5 rounded-lg transition-colors ${
                mode === 'login' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`py-1.5 rounded-lg transition-colors ${
                mode === 'signup' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setMode('admin');
                setErrorMsg('');
              }}
              className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                mode === 'admin' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Lockout Warning Banner */}
          {isLockedOut && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 font-medium">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Security Lockout Active</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Too many incorrect password attempts. Please wait{' '}
                  <span className="font-mono font-bold text-rose-900">{lockoutRemainingSeconds}s</span> before retrying.
                </p>
              </div>
            </div>
          )}

          {errorMsg && !isLockedOut && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. LOGIN / ADMIN FORM */}
          {(mode === 'login' || mode === 'admin') && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  {mode === 'admin' && (
                    <button
                      type="button"
                      onClick={handlePreFillAdmin}
                      className="text-[10px] font-semibold text-amber-600 hover:underline"
                    >
                      Fill Admin Demo
                    </button>
                  )}
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={handlePreFillCustomer}
                      className="text-[10px] font-semibold text-blue-600 hover:underline"
                    >
                      Fill Customer Demo
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    disabled={isLockedOut || isLoading}
                    placeholder={mode === 'admin' ? 'admin@idealcollections.pk' : 'customer@idealcollections.pk'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {mode === 'admin' ? 'Default: Admin@12345' : 'Default: Customer@12345'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLockedOut || isLoading}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLockedOut || isLoading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'admin' ? 'Verify & Access Admin Console' : 'Sign In Securely'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    placeholder="e.g. Fatima Ali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    placeholder="fatima@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  WhatsApp / Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    disabled={isLoading}
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm mt-3"
              >
                {isLoading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo 1-Click Login Shortcut Helpers */}
          <div className="pt-4 border-t border-slate-200">
            {securitySettings.productionLock ? (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-xs text-slate-500 space-y-1">
                <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Production Lockdown Mode Active
                </span>
                <p className="text-[11px]">1-Click demo shortcuts are disabled in production mode. Please sign in with verified credentials.</p>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                  — Instant One-Click Demo Access —
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={loginAsDemoCustomer}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                    Demo Customer
                  </button>
                  <button
                    type="button"
                    onClick={loginAsDemoAdmin}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Demo Admin
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

