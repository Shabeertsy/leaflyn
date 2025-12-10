import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Sprout, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const cartCount = useCartStore((state) => state.getCartCount());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: Sprout, label: 'Services', path: '/services' },
    { icon: User, label: 'Account', path: isAuthenticated ? '/account' : '/login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 no-print safe-area-bottom lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-5 h-[4.5rem] max-w-7xl mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center gap-1 rounded-2xl my-1
                transition-all duration-300 relative
                ${isActive 
                  ? 'text-[#2d5016]' 
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <div className={`
                relative p-1.5 rounded-xl transition-all duration-300
                ${isActive ? 'bg-[#2d5016]/10 translate-y-[-2px]' : ''}
              `}>
                <Icon 
                  size={22} 
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 2 : 2}
                  className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-sm border border-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'font-bold text-[#2d5016]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
