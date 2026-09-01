import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import {
  Product,
  CartItem,
  CustomerInfo,
  Order,
  PageView,
  ToastNotification,
  User,
  UserRole,
  Coupon,
  AdvancePaymentSettings,
  SecurityAuditLog,
  SecuritySettings,
} from '../types';
import { PRODUCTS } from '../data/products';
import { hashPassword, hashPasswordSync, evaluatePasswordStrength } from '../utils/security';

interface ShopContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
  shippingFee: number;
  amountUntilFreeShipping: number;
  hasFreeShipping: boolean;
  appliedPromo: string | null;
  promoDiscount: number;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  cartTotal: number;

  // Advance Payment Policy (High-Value Orders above threshold)
  advanceSettings: AdvancePaymentSettings;
  updateAdvanceSettings: (settings: Partial<AdvancePaymentSettings>) => void;
  requiresAdvance: boolean;
  advanceAmount: number;
  remainingBalance: number;

  // UI Modals
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;

  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Navigation
  pageView: PageView;
  navigateTo: (view: PageView) => void;

  // Orders
  orders: Order[];
  placeOrder: (customerInfo: CustomerInfo, paymentMethod?: 'Cash on Delivery' | 'Bank Transfer', advanceTransactionRef?: string) => Order;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status'], adminNotes?: string) => void;
  updateOrderAdvanceStatus: (orderId: string, status: Order['advancePaymentStatus'], adminNotes?: string) => void;
  deleteOrder: (orderId: string) => void;

  // Products Management
  allProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;

  // User & Admin Authentication & Security
  users: User[];
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message: string; user?: User }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  adminResetUserPassword: (userId: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  loginAsDemoAdmin: () => void;
  loginAsDemoCustomer: () => void;

  // Security Controls & Audit
  securitySettings: SecuritySettings;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  auditLogs: SecurityAuditLog[];
  addAuditLog: (action: SecurityAuditLog['action'], details: string, severity?: SecurityAuditLog['severity'], userEmail?: string) => void;
  clearAuditLogs: () => void;
  verifyAdminPin: (pin: string) => boolean;
  failedLoginAttempts: number;
  isLockedOut: boolean;
  lockoutRemainingSeconds: number;

  // Coupons Management
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;

  // Toast
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;

  // Utilities
  formatPrice: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 4999;
const STANDARD_SHIPPING_FEE = 199;

const DEFAULT_ADVANCE_SETTINGS: AdvancePaymentSettings = {
  enabled: true,
  threshold: 10000,
  percentage: 20,
  accountTitle: 'Ideal Collections',
  bankName: 'Meezan Bank Limited',
  accountNumber: '01010102938481',
  iban: 'PK92MEZN0001010102938481',
  easypaisaNumber: '0300 1234567',
  jazzcashNumber: '0300 1234567',
  whatsappConfirmationNumber: '+92 300 1234567',
  instructions: 'For high-value orders above the threshold, a 20% advance deposit is required before dispatch to confirm your delivery. The remaining 80% balance will be collected via Cash on Delivery upon delivery.',
};

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  productionLock: false, // Set to true to disable 1-click demo logins for production lockdown
  sessionTimeoutMinutes: 60,
  maxLoginAttempts: 5,
  lockoutDurationSeconds: 60,
  requirePinForSensitiveActions: true,
  adminPin: '2026',
};

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'IDEAL10',
    discountPct: 10,
    description: '10% off storewide on all kitchen and home items',
    isActive: true,
    usageCount: 24,
  },
  {
    id: 'coup-2',
    code: 'WELCOME10',
    discountPct: 10,
    description: '10% welcome discount for new shoppers',
    isActive: true,
    usageCount: 88,
  },
  {
    id: 'coup-3',
    code: 'IDEAL500',
    flatDiscount: 500,
    minSpend: 3000,
    description: 'Flat Rs. 500 discount on orders above Rs. 3,000',
    isActive: true,
    usageCount: 15,
  },
  {
    id: 'coup-4',
    code: 'FREESHIP',
    flatDiscount: 0,
    description: 'Free VIP Express shipping across Pakistan',
    isActive: true,
    usageCount: 42,
  },
];

const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'user_admin_01',
    name: 'Waqas (Admin)',
    email: 'admin@idealcollections.pk',
    phone: '+92 300 1234567',
    role: 'admin',
    passwordHash: hashPasswordSync('Admin@12345'),
    status: 'active',
    lastLogin: '2026-09-01 10:15 AM',
    lastPasswordChange: '2026-08-01',
    address: 'Ideal Collections Head Office, Gulberg III',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '54000',
    createdAt: '2026-01-15',
  },
  {
    id: 'user_cust_01',
    name: 'Sarah Khan',
    email: 'customer@idealcollections.pk',
    phone: '+92 321 9876543',
    role: 'customer',
    passwordHash: hashPasswordSync('Customer@12345'),
    status: 'active',
    lastLogin: '2026-08-28 04:30 PM',
    lastPasswordChange: '2026-08-10',
    address: 'House # 42, Street 7, DHA Phase 5',
    city: 'Karachi',
    province: 'Sindh',
    postalCode: '75500',
    createdAt: '2026-02-10',
  },
];

const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-09-01 09:00 AM',
    action: 'POLICY_UPDATE',
    userEmail: 'admin@idealcollections.pk',
    userName: 'Waqas (Admin)',
    details: 'Advance payment security policy verified for high-value orders (> Rs. 10,000).',
    severity: 'info',
    ip: '110.38.12.94 (Lahore, PK)',
  },
  {
    id: 'log_02',
    timestamp: '2026-09-01 10:15 AM',
    action: 'LOGIN_SUCCESS',
    userEmail: 'admin@idealcollections.pk',
    userName: 'Waqas (Admin)',
    details: 'Secure administrator session established.',
    severity: 'info',
    ip: '110.38.12.94 (Lahore, PK)',
  },
];

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Dynamic Products with localStorage persistence
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // 2. Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Registered users database (simulated persistence)
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_users');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_USERS;
    } catch {
      return INITIAL_DEMO_USERS;
    }
  });

  // 6. Current logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 7. Coupons database
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_coupons');
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  // 8. Advance Payment Policy Settings (Orders above threshold require deposit)
  const [advanceSettings, setAdvanceSettings] = useState<AdvancePaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_advance_settings');
      if (saved) {
        return { ...DEFAULT_ADVANCE_SETTINGS, ...JSON.parse(saved) };
      }
      return DEFAULT_ADVANCE_SETTINGS;
    } catch {
      return DEFAULT_ADVANCE_SETTINGS;
    }
  });

  // 9. Security & Access Control Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_security_settings');
      if (saved) {
        return { ...DEFAULT_SECURITY_SETTINGS, ...JSON.parse(saved) };
      }
      return DEFAULT_SECURITY_SETTINGS;
    } catch {
      return DEFAULT_SECURITY_SETTINGS;
    }
  });

  // 10. Security Audit Logs
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('idealcollections_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Rate Limiting & Lockout
  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Inactivity tracking for auto session timeout
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState<number>(Date.now());

  // Navigation page view
  const [pageView, setPageView] = useState<PageView>({ type: 'home' });

  // UI Drawers and Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Promo code in active checkout/cart
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountPct, setPromoDiscountPct] = useState<number>(0);
  const [flatDiscount, setFlatDiscount] = useState<number>(0);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to localStorages
  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_products', JSON.stringify(allProducts));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [allProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('idealcollections_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('idealcollections_current_user');
      }
    } catch (e) {
      console.error('Failed to save current user', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error('Failed to save coupons', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_advance_settings', JSON.stringify(advanceSettings));
    } catch (e) {
      console.error('Failed to save advance settings', e);
    }
  }, [advanceSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_security_settings', JSON.stringify(securitySettings));
    } catch (e) {
      console.error('Failed to save security settings', e);
    }
  }, [securitySettings]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to save audit logs', e);
    }
  }, [auditLogs]);

  // Lockout Countdown Timer
  useEffect(() => {
    if (!lockoutUntil) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemainingSeconds(remaining);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedLoginAttempts(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Inactivity / Session Timeout Check
  useEffect(() => {
    if (!currentUser) return;

    const handleUserInteraction = () => {
      setLastActivityTimestamp(Date.now());
    };

    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    const checkInterval = setInterval(() => {
      const timeoutMs = (securitySettings.sessionTimeoutMinutes || 60) * 60 * 1000;
      if (Date.now() - lastActivityTimestamp > timeoutMs) {
        // Auto log out
        addAuditLog(
          'LOGOUT',
          `Session timed out after ${securitySettings.sessionTimeoutMinutes} minutes of inactivity.`,
          'info',
          currentUser.email
        );
        setCurrentUser(null);
        addToast('Session Expired', 'You have been signed out due to inactivity for security.', 'warning');
        setPageView({ type: 'home' });
      }
    }, 30000);

    return () => {
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      clearInterval(checkInterval);
    };
  }, [currentUser, lastActivityTimestamp, securitySettings.sessionTimeoutMinutes]);

  // Audit Logger Helper
  const addAuditLog = useCallback(
    (
      action: SecurityAuditLog['action'],
      details: string,
      severity: SecurityAuditLog['severity'] = 'info',
      userEmail?: string
    ) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-PK', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const newLog: SecurityAuditLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: `${dateStr} ${timeStr}`,
        action,
        userEmail: userEmail || currentUser?.email || 'guest@system',
        userName: currentUser?.name || 'System / Visitor',
        details,
        severity,
        ip: '110.38.12.94 (Pakistan)',
      };

      setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]); // Keep last 200 logs
    },
    [currentUser]
  );

  const clearAuditLogs = () => {
    setAuditLogs([]);
    addToast('Audit Logs Cleared', 'Security history cleared.', 'info');
  };

  const updateSecuritySettings = (updates: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => {
      const updated = { ...prev, ...updates };
      addAuditLog('POLICY_UPDATE', `Security settings updated: ${Object.keys(updates).join(', ')}`, 'warning');
      addToast('Security Config Saved', 'Application security settings updated.');
      return updated;
    });
  };

  const verifyAdminPin = (pin: string): boolean => {
    return pin.trim() === (securitySettings.adminPin || '2026').trim();
  };

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('idealcollections_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('idealcollections_current_user');
      }
    } catch (e) {
      console.error('Failed to save current user', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error('Failed to save coupons', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('idealcollections_advance_settings', JSON.stringify(advanceSettings));
    } catch (e) {
      console.error('Failed to save advance settings', e);
    }
  }, [advanceSettings]);

  const updateAdvanceSettings = (settings: Partial<AdvancePaymentSettings>) => {
    setAdvanceSettings((prev) => {
      const updated = { ...prev, ...settings };
      return updated;
    });
    addToast('Policy Updated', 'Advance payment threshold and policy settings saved successfully.');
  };

  // Navigation
  const navigateTo = (view: PageView) => {
    setPageView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast helper
  const addToast = (title: string, message: string, type: ToastNotification['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, openDrawer = true) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    addToast('Added to Cart', `${product.title.slice(0, 30)}... added to your bag.`);

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Removed', 'Item removed from your cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Wishlist', 'Item removed from wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Wishlist', 'Item added to your wishlist.', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
  }, [cart]);

  const hasFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD && cartSubtotal > 0;

  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (hasFreeShipping) return 0;
    if (appliedPromo === 'FREESHIP') return 0;
    return STANDARD_SHIPPING_FEE;
  }, [cartSubtotal, hasFreeShipping, appliedPromo]);

  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const promoDiscount = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    let discount = 0;
    if (promoDiscountPct > 0) {
      discount += Math.round((cartSubtotal * promoDiscountPct) / 100);
    }
    if (flatDiscount > 0) {
      discount += flatDiscount;
    }
    return Math.min(discount, cartSubtotal);
  }, [cartSubtotal, promoDiscountPct, flatDiscount]);

  const cartTotal = Math.max(0, cartSubtotal + shippingFee - promoDiscount);

  // Advance Payment calculations (e.g. 20% required for orders above PKR 10,000)
  const requiresAdvance = useMemo(() => {
    return advanceSettings.enabled && cartTotal > advanceSettings.threshold;
  }, [advanceSettings, cartTotal]);

  const advanceAmount = useMemo(() => {
    if (!requiresAdvance) return 0;
    return Math.round((cartTotal * advanceSettings.percentage) / 100);
  }, [requiresAdvance, cartTotal, advanceSettings.percentage]);

  const remainingBalance = useMemo(() => {
    if (!requiresAdvance) return cartTotal;
    return cartTotal - advanceAmount;
  }, [requiresAdvance, cartTotal, advanceAmount]);

  // Promo code verification
  const applyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired voucher code. Try "IDEAL10" or "WELCOME10".' };
    }

    if (found.minSpend && cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `This coupon requires a minimum cart spend of Rs. ${found.minSpend.toLocaleString('en-PK')}.`,
      };
    }

    setAppliedPromo(found.code);
    if (found.discountPct) {
      setPromoDiscountPct(found.discountPct);
      setFlatDiscount(0);
    } else if (found.flatDiscount) {
      setFlatDiscount(found.flatDiscount);
      setPromoDiscountPct(0);
    } else if (found.code === 'FREESHIP') {
      setPromoDiscountPct(0);
      setFlatDiscount(0);
    }

    // Increment coupon usage in state
    setCoupons((prev) =>
      prev.map((c) => (c.id === found.id ? { ...c, usageCount: (c.usageCount || 0) + 1 } : c))
    );

    return { success: true, message: `${found.description} applied successfully!` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoDiscountPct(0);
    setFlatDiscount(0);
    addToast('Coupon Removed', 'Discount voucher removed.', 'info');
  };

  // Orders
  const placeOrder = (
    customerInfo: CustomerInfo,
    paymentMethod: 'Cash on Delivery' | 'Bank Transfer' = 'Cash on Delivery',
    advanceTransactionRef?: string
  ): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `IC-${randomNum}`;
    const orderId = `order_${Date.now()}`;

    const orderRequiresAdvance = advanceSettings.enabled && cartTotal > advanceSettings.threshold;
    const calcAdvance = orderRequiresAdvance ? Math.round((cartTotal * advanceSettings.percentage) / 100) : 0;
    const calcRemaining = orderRequiresAdvance ? cartTotal - calcAdvance : cartTotal;

    const newOrder: Order = {
      orderId,
      orderNumber,
      date: new Date().toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      userId: currentUser ? currentUser.id : undefined,
      customerInfo,
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee,
      discount: promoDiscount,
      promoCodeApplied: appliedPromo || undefined,
      total: cartTotal,
      paymentMethod,
      status: 'Confirmed',
      estimatedDelivery: '2-4 Business Days',
      requiresAdvance: orderRequiresAdvance,
      advanceThresholdApplied: advanceSettings.threshold,
      advancePercentage: advanceSettings.percentage,
      advanceAmount: calcAdvance,
      remainingBalance: calcRemaining,
      advancePaymentStatus: orderRequiresAdvance ? 'Pending' : undefined,
      advanceTransactionRef: advanceTransactionRef || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);
    setPromoDiscountPct(0);
    setFlatDiscount(0);

    return newOrder;
  };

  const getOrderById = (idOrNumber: string) => {
    return orders.find(
      (o) =>
        o.orderId === idOrNumber ||
        o.orderNumber.toUpperCase() === idOrNumber.toUpperCase() ||
        o.orderNumber.replace('IC-', '').toUpperCase() === idOrNumber.toUpperCase()
    );
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], adminNotes?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status, ...(adminNotes ? { adminNotes } : {}) } : o))
    );
    addToast('Order Updated', `Order status changed to "${status}".`);
  };

  const updateOrderAdvanceStatus = (orderId: string, status: Order['advancePaymentStatus'], adminNotes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              advancePaymentStatus: status,
              ...(adminNotes ? { adminNotes } : {}),
            }
          : o
      )
    );
    addToast('Advance Status Updated', `Order advance status set to "${status}".`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    addToast('Order Deleted', 'Order record removed successfully.', 'info');
  };

  // Product Management (Admin + Storefront synchronization)
  const getProductById = (id: string) => {
    return allProducts.find((p) => p.id === id || p.handle === id);
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newId = `ic-${Date.now().toString().slice(-6)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };

    setAllProducts((prev) => [newProduct, ...prev]);
    addToast('Product Created', `"${newProduct.title.slice(0, 25)}..." added to store catalogue.`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Product Updated', 'Product changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product Deleted', 'Product has been removed from catalogue.', 'info');
  };

  const resetProductsToDefault = () => {
    setAllProducts(PRODUCTS);
    localStorage.setItem('idealcollections_products', JSON.stringify(PRODUCTS));
    addToast('Products Reset', 'Product catalog reset to default items.', 'info');
  };

  // Authentication & Users Security
  const login = async (
    email: string,
    pass: string,
    role?: UserRole
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    // 1. Check Rate-limit / Lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSec = Math.ceil((lockoutUntil - Date.now()) / 1000);
      return {
        success: false,
        message: `Security Lockout Active: Too many failed login attempts. Please wait ${remainingSec} seconds.`,
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      // Check if suspended
      if (existing.status === 'suspended') {
        addAuditLog('LOGIN_FAILED', `Suspended account login attempt: ${cleanEmail}`, 'warning', cleanEmail);
        return {
          success: false,
          message: 'This account is currently suspended. Please contact store administration.',
        };
      }

      // Check role constraint if logging in specifically through Admin gate
      if (role && existing.role !== role && role === 'admin') {
        addAuditLog('LOGIN_FAILED', `Non-admin user attempted admin login: ${cleanEmail}`, 'warning', cleanEmail);
        return { success: false, message: 'Access Denied: This account is not authorized with Administrator privileges.' };
      }

      // Verify Password Hash
      const enteredHash = await hashPassword(pass);
      const isPasswordValid =
        existing.passwordHash ? existing.passwordHash === enteredHash || existing.passwordHash === hashPasswordSync(pass) : true;

      if (!isPasswordValid) {
        const newAttempts = failedLoginAttempts + 1;
        setFailedLoginAttempts(newAttempts);

        addAuditLog('LOGIN_FAILED', `Incorrect password attempt for ${cleanEmail} (Attempt ${newAttempts})`, 'warning', cleanEmail);

        if (newAttempts >= (securitySettings.maxLoginAttempts || 5)) {
          const lockoutDuration = (securitySettings.lockoutDurationSeconds || 60) * 1000;
          const lockTime = Date.now() + lockoutDuration;
          setLockoutUntil(lockTime);
          addAuditLog('SECURITY_LOCKOUT', `Brute force protection triggered for IP. Locked for ${securitySettings.lockoutDurationSeconds}s`, 'critical', cleanEmail);
          addToast('Security Alert', `Account login locked for ${securitySettings.lockoutDurationSeconds}s due to failed attempts.`, 'error');
          return {
            success: false,
            message: `Account locked for ${securitySettings.lockoutDurationSeconds} seconds due to repeated failed attempts.`,
          };
        }

        return {
          success: false,
          message: `Incorrect password. ${securitySettings.maxLoginAttempts - newAttempts} attempt(s) remaining before security lockout.`,
        };
      }

      // Success Login
      setFailedLoginAttempts(0);
      setLockoutUntil(null);

      const now = new Date();
      const loginTimeStr = `${now.toLocaleDateString('en-PK')} ${now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}`;
      
      const updatedUser: User = {
        ...existing,
        passwordHash: existing.passwordHash || enteredHash,
        lastLogin: loginTimeStr,
      };

      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      setCurrentUser(updatedUser);
      setLastActivityTimestamp(Date.now());

      addAuditLog('LOGIN_SUCCESS', `Secure session established for ${updatedUser.name} [${updatedUser.role.toUpperCase()}]`, 'info', cleanEmail);
      addToast('Welcome Back', `Logged in as ${updatedUser.name} (${updatedUser.role.toUpperCase()}).`);
      
      return { success: true, message: 'Login successful', user: updatedUser };
    }

    // If user does not exist
    if (securitySettings.productionLock) {
      addAuditLog('LOGIN_FAILED', `Login failed: Non-existent account ${cleanEmail}`, 'warning', cleanEmail);
      return {
        success: false,
        message: 'No account found with this email. Please click Sign Up to register.',
      };
    }

    // In dev / initial mode, allow creating account on the fly with hashed password
    const hashedPass = await hashPassword(pass || 'User@12345');
    const isAdminEmail = cleanEmail === 'admin@idealcollections.pk' || cleanEmail.includes('admin');
    
    const newUser: User = {
      id: `${isAdminEmail ? 'admin' : 'cust'}_${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: isAdminEmail ? 'admin' : 'customer',
      passwordHash: hashedPass,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toLocaleDateString('en-PK'),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setLastActivityTimestamp(Date.now());
    addAuditLog('LOGIN_SUCCESS', `New account provisioned and signed in: ${cleanEmail}`, 'info', cleanEmail);
    addToast('Account Created', `Welcome to Ideal Collections, ${newUser.name}!`);
    return { success: true, message: 'Account created and logged in', user: newUser };
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    phone?: string
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    if (!pass || pass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const passwordHash = await hashPassword(pass);
    const now = new Date();
    const loginTimeStr = `${now.toLocaleDateString('en-PK')} ${now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}`;

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim() || 'Valued Customer',
      email: cleanEmail,
      phone: phone || '',
      role: 'customer',
      passwordHash,
      status: 'active',
      lastLogin: loginTimeStr,
      lastPasswordChange: now.toISOString().split('T')[0],
      createdAt: now.toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setLastActivityTimestamp(Date.now());
    addAuditLog('LOGIN_SUCCESS', `New customer registered: ${newUser.name} (${cleanEmail})`, 'info', cleanEmail);
    addToast('Registration Successful', `Welcome to Ideal Collections, ${newUser.name}!`);
    return { success: true, message: 'Account registered successfully', user: newUser };
  };

  const changePassword = async (
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to change your password.' };
    }

    // Verify old password
    const oldHash = await hashPassword(oldPass);
    if (currentUser.passwordHash && currentUser.passwordHash !== oldHash && currentUser.passwordHash !== hashPasswordSync(oldPass)) {
      addAuditLog('LOGIN_FAILED', `Failed password change verification for ${currentUser.email}`, 'warning', currentUser.email);
      return { success: false, message: 'Current password does not match.' };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    const newHash = await hashPassword(newPass);
    const updatedUser: User = {
      ...currentUser,
      passwordHash: newHash,
      lastPasswordChange: new Date().toISOString().split('T')[0],
    };

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addAuditLog('PASSWORD_CHANGE', `Password successfully updated for user ${currentUser.email}`, 'info', currentUser.email);
    addToast('Password Changed', 'Your password has been successfully updated.', 'success');

    return { success: true, message: 'Password updated successfully.' };
  };

  const adminResetUserPassword = async (
    userId: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, message: 'User not found' };

    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const newHash = await hashPassword(newPass);
    const updatedUser: User = {
      ...target,
      passwordHash: newHash,
      lastPasswordChange: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
    }

    addAuditLog('PASSWORD_CHANGE', `Admin reset password for account: ${target.email}`, 'warning');
    addToast('Password Reset', `Password for ${target.name} has been reset.`, 'success');
    return { success: true, message: 'Password reset successfully.' };
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    // Prevent demoting the primary admin if it is the only admin
    const adminCount = users.filter((u) => u.role === 'admin' && u.status !== 'suspended').length;
    if (target.role === 'admin' && newRole === 'customer' && adminCount <= 1) {
      addToast('Cannot Demote', 'At least one active Administrator must exist.', 'error');
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }

    addAuditLog('ROLE_CHANGE', `Changed role of ${target.email} to ${newRole.toUpperCase()}`, 'warning');
    addToast('Role Updated', `${target.name} role changed to ${newRole}.`);
  };

  const toggleUserStatus = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    if (target.id === currentUser?.id) {
      addToast('Action Forbidden', 'You cannot suspend your own active session account.', 'error');
      return;
    }

    const nextStatus: 'active' | 'suspended' = target.status === 'suspended' ? 'active' : 'suspended';
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    );

    addAuditLog('ROLE_CHANGE', `User account status changed for ${target.email}: ${nextStatus}`, 'warning');
    addToast('Account Status Changed', `${target.name} is now ${nextStatus}.`);
  };

  const deleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    if (target.id === currentUser?.id) {
      addToast('Action Forbidden', 'You cannot delete your own active account.', 'error');
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addAuditLog('USER_DELETED', `Deleted user account: ${target.name} (${target.email})`, 'critical');
    addToast('User Removed', `Account ${target.email} deleted.`, 'info');
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('LOGOUT', `User ${currentUser.email} logged out manually.`, 'info', currentUser.email);
    }
    setCurrentUser(null);
    addToast('Logged Out', 'You have been logged out safely.', 'info');
    navigateTo({ type: 'home' });
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    addAuditLog('PROFILE_UPDATE', `Profile details updated for ${currentUser.email}`, 'info', currentUser.email);
    addToast('Profile Updated', 'Your account details have been saved.');
  };

  const loginAsDemoAdmin = () => {
    if (securitySettings.productionLock) {
      addToast('Production Lockdown Active', '1-Click demo logins are disabled in production mode. Please sign in with verified credentials.', 'warning');
      return;
    }
    const adminUser = users.find((u) => u.role === 'admin') || INITIAL_DEMO_USERS[0];
    setCurrentUser(adminUser);
    setLastActivityTimestamp(Date.now());
    addAuditLog('LOGIN_SUCCESS', `Demo Administrator session activated (${adminUser.email})`, 'info', adminUser.email);
    addToast('Admin Logged In', `Switched to Administrator account (${adminUser.name}).`);
    navigateTo({ type: 'admin' });
  };

  const loginAsDemoCustomer = () => {
    if (securitySettings.productionLock) {
      addToast('Production Lockdown Active', '1-Click demo logins are disabled in production mode. Please sign in with verified credentials.', 'warning');
      return;
    }
    const custUser = users.find((u) => u.role === 'customer') || INITIAL_DEMO_USERS[1];
    setCurrentUser(custUser);
    setLastActivityTimestamp(Date.now());
    addAuditLog('LOGIN_SUCCESS', `Demo Customer session activated (${custUser.email})`, 'info', custUser.email);
    addToast('Customer Logged In', `Logged in as ${custUser.name}.`);
    navigateTo({ type: 'account' });
  };

  // Coupons management
  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup_${Date.now()}`,
      code: couponData.code.toUpperCase().trim(),
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    addToast('Coupon Created', `Discount voucher "${newCoupon.code}" created.`);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    addToast('Coupon Deleted', 'Voucher deleted.', 'info');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    addToast('Coupon Updated', 'Voucher status updated.');
  };

  // Price formatter
  const formatPrice = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        shippingFee,
        amountUntilFreeShipping,
        hasFreeShipping,
        appliedPromo,
        promoDiscount,
        applyPromo,
        removePromo,
        cartTotal,

        // Advance payment policy for high value orders
        advanceSettings,
        updateAdvanceSettings,
        requiresAdvance,
        advanceAmount,
        remainingBalance,

        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),

        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),

        quickViewProduct,
        openQuickView: (p: Product) => setQuickViewProduct(p),
        closeQuickView: () => setQuickViewProduct(null),

        wishlist,
        toggleWishlist,
        isInWishlist,

        pageView,
        navigateTo,

        orders,
        placeOrder,
        getOrderById,
        updateOrderStatus,
        updateOrderAdvanceStatus,
        deleteOrder,

        allProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,

        users,
        currentUser,
        isAdmin: currentUser?.role === 'admin' && currentUser?.status !== 'suspended',
        login,
        signup,
        logout,
        updateUserProfile,
        changePassword,
        adminResetUserPassword,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        loginAsDemoAdmin,
        loginAsDemoCustomer,

        // Security controls
        securitySettings,
        updateSecuritySettings,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        verifyAdminPin,
        failedLoginAttempts,
        isLockedOut: !!lockoutUntil && Date.now() < lockoutUntil,
        lockoutRemainingSeconds,

        coupons,
        addCoupon,
        deleteCoupon,
        toggleCouponStatus,

        toasts,
        addToast,
        removeToast,

        formatPrice,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
