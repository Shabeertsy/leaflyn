import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import LoginPromptModal from './components/common/LoginPromptModal';
import PWAInstallBanner from './components/features/PWAInstallBanner';
import ScrollToTop from './components/layout/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import { useAuthSync } from './hooks/useAuthSync';

const AppContent: React.FC = () => {
  const location = useLocation();
  
  // Sync cart and wishlist when user is authenticated
  useAuthSync();
  
  // Hide header and bottom nav on auth pages and checkout
  const hideNavigation = ['/login', '/register', '/checkout'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      {!hideNavigation && <Header />}
      
      <main className="min-h-screen">
        <AppRoutes />
      </main>

      {!hideNavigation && <BottomNav />}
      {!hideNavigation && <Footer />}
      <CartDrawer />
      <LoginPromptModal />
      <PWAInstallBanner />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
