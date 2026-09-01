import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/ToastContainer';

// Page Views
import { HomePage } from './views/HomePage';
import { ShopPage } from './views/ShopPage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { CartPage } from './views/CartPage';
import { CheckoutPage } from './views/CheckoutPage';
import { OrderConfirmationPage } from './views/OrderConfirmationPage';
import { WishlistPage } from './views/WishlistPage';
import { TrackOrderPage } from './views/TrackOrderPage';
import { InfoPage } from './views/InfoPage';
import { AdminDashboardPage } from './views/AdminDashboardPage';
import { AuthPage } from './views/AuthPage';
import { AccountPage } from './views/AccountPage';

const AppContent: React.FC = () => {
  const { pageView } = useShop();

  // Scroll to top whenever the pageView changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pageView]);

  const renderCurrentView = () => {
    switch (pageView.type) {
      case 'home':
        return <HomePage />;

      case 'shop':
        return <ShopPage initialCategory={pageView.category || 'all'} />;

      case 'category':
        return <ShopPage initialCategory={pageView.category} />;

      case 'product':
        return <ProductDetailPage productId={pageView.productId} />;

      case 'cart':
        return <CartPage />;

      case 'checkout':
        return <CheckoutPage />;

      case 'order-confirmed':
        return <OrderConfirmationPage order={pageView.order} />;

      case 'wishlist':
        return <WishlistPage />;

      case 'search':
        return <ShopPage initialSearch={pageView.query} />;

      case 'track-order':
        return <TrackOrderPage />;

      case 'info':
        return <InfoPage pageType={pageView.infoType} />;

      case 'admin':
        return <AdminDashboardPage />;

      case 'auth':
        return <AuthPage initialMode={pageView.initialMode} />;

      case 'account':
        return <AccountPage initialTab={pageView.tab} />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Global Announcement Header */}
      <AnnouncementBar />

      {/* 2. Main Sticky Navigation */}
      <Header />

      {/* 3. Dynamic Page View */}
      <main className="flex-1 pb-16 sm:pb-0">
        {renderCurrentView()}
      </main>

      {/* 4. Global Site Footer */}
      <Footer />

      {/* 5. Mobile Sticky Bottom Action Bar */}
      <MobileBottomNav />

      {/* 6. Modals & Flyouts */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
