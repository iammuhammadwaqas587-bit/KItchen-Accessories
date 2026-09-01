export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  passwordHash?: string;
  status?: 'active' | 'suspended';
  lastLogin?: string;
  lastPasswordChange?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  createdAt: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGOUT'
    | 'PASSWORD_CHANGE'
    | 'PROFILE_UPDATE'
    | 'ROLE_CHANGE'
    | 'ORDER_MODIFIED'
    | 'POLICY_UPDATE'
    | 'CATALOG_UPDATE'
    | 'SECURITY_LOCKOUT'
    | 'USER_DELETED';
  userEmail: string;
  userName?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
  ip?: string;
}

export interface SecuritySettings {
  productionLock: boolean; // When enabled, 1-click demo logins are hidden/disabled
  sessionTimeoutMinutes: number; // Inactivity auto-logout
  maxLoginAttempts: number; // Max failed logins before rate-limit
  lockoutDurationSeconds: number; // Lockout cooldown duration in seconds
  requirePinForSensitiveActions: boolean; // Require PIN for deleting products, orders, or changing bank details
  adminPin: string; // 4-digit PIN for high-risk operations (default '2026')
}

export interface Coupon {
  id: string;
  code: string;
  discountPct?: number;
  flatDiscount?: number;
  minSpend?: number;
  description: string;
  isActive: boolean;
  usageCount?: number;
}

export type CategoryId = 
  | 'all'
  | 'kitchen-gadgets'
  | 'choppers-cutters'
  | 'cooking-tools'
  | 'storage-organizers'
  | 'bakeware'
  | 'kitchen-essentials'
  | 'best-sellers'
  | 'new-arrivals'
  | 'sale';

export interface Category {
  id: CategoryId;
  name: string;
  shortDesc: string;
  image: string;
  itemCount: number;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  category: CategoryId;
  categoryName: string;
  originalPrice: number;
  salePrice: number;
  isSale: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  additionalImages?: string[];
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  reviews: Review[];
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  orderNotes?: string;
}

export interface AdvancePaymentSettings {
  enabled: boolean;
  threshold: number;
  percentage: number;
  accountTitle: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  easypaisaNumber: string;
  jazzcashNumber: string;
  whatsappConfirmationNumber: string;
  instructions: string;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  date: string;
  userId?: string;
  customerInfo: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  promoCodeApplied?: string;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer';
  status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  estimatedDelivery: string;
  adminNotes?: string;
  // Advance Payment Policy for High-Value Orders
  requiresAdvance?: boolean;
  advanceThresholdApplied?: number;
  advancePercentage?: number;
  advanceAmount?: number;
  remainingBalance?: number;
  advancePaymentStatus?: 'Pending' | 'Received' | 'Waived';
  advanceTransactionRef?: string;
}

export type SortOption = 
  | 'featured' 
  | 'best-selling' 
  | 'newest' 
  | 'price-low' 
  | 'price-high' 
  | 'rating';

export interface FilterState {
  category: CategoryId;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  saleOnly: boolean;
  minRating: number;
  sortBy: SortOption;
}

export type PageView = 
  | { type: 'home' }
  | { type: 'shop'; category?: CategoryId; search?: string }
  | { type: 'category'; category: CategoryId }
  | { type: 'product'; productId: string }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'order-confirmed'; order: Order }
  | { type: 'wishlist' }
  | { type: 'search'; query: string }
  | { type: 'track-order' }
  | { type: 'info'; infoType: 'faq' | 'shipping' | 'returns' | 'contact' | 'about' | 'privacy' | 'terms' }
  | { type: 'auth'; initialMode?: 'login' | 'signup' | 'admin' }
  | { type: 'account'; tab?: 'orders' | 'profile' | 'addresses' | 'security' | 'wishlist' }
  | { type: 'admin'; tab?: 'overview' | 'products' | 'orders' | 'coupons' | 'settings' | 'security' | 'users' };

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
