import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useNotificationStore } from '../../store/useNotificationStore';

const Header: React.FC = () => {
  const cartCount = useCartStore((state) => state.getCartCount());
  const setShowCart = useUIStore((state) => state.setShowCart);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { user, isAuthenticated } = useAuthStore();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40 no-print safe-area-top">
      <div className="px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2d5016] to-[#3d6622] rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">L</span>
          </div>
          <span className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Leaflyn</span>
        </Link>

        {/* Navigation Links - Hidden on mobile, visible on desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/search" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors">
            Shop
          </Link>
          <Link to="/categories" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors">
            Categories
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors">
            Services
          </Link>
          <Link to="/contact-us" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors">
            Contact Us
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
           <Link to="/notifications" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={22} className="text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart size={22} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#2d5016] text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
          {isAuthenticated && user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link 
                to="/account" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-[#2d5016]">{getInitials(`${user.first_name} ${user.last_name}`)}</span>
                  )}
                </div>
              </Link>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  window.location.href = '/';
                }}
                className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#2d5016] text-white rounded-full text-sm font-bold hover:bg-[#3d6622] transition-colors"
            >
              <UserIcon size={16} />
              <span>Login</span>
            </Link>
          )}

         
        </div>

      </div>
    </header>
  );
};

export default Header;
