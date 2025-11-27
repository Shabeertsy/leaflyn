import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';

const Header: React.FC = () => {
  const cartCount = useCartStore((state) => state.getCartCount());
  const setShowCart = useUIStore((state) => state.setShowCart);
  const { user, isAuthenticated } = useAuthStore();

  const getInitials = (name: string) => {
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
          <span className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Leafin</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <Link 
              to="/account" 
              className="hidden lg:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-[#2d5016]">{getInitials(user.name)}</span>
                )}
              </div>
            </Link>
          ) : (
            <Link 
              to="/login"
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#2d5016] text-white rounded-full text-sm font-bold hover:bg-[#3d6622] transition-colors"
            >
              <UserIcon size={16} />
              <span>Login</span>
            </Link>
          )}

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={22} className="text-gray-700" />
          </button>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
