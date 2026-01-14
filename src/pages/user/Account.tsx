import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  MapPin,
  Package,
  Heart,
  HelpCircle,
  LogOut,
  ChevronRight,
  Gift,
  Download,
  Camera,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { usePWA } from '../../hooks/usePWA';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated } = useAuthStore();
  const { isInstallable, installApp } = usePWA();
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoggingOut.current) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const menuSections = [
    {
      title: 'Account Settings',
      items: [
        { icon: UserIcon, label: 'Personal Information', path: '/profile/edit', subtitle: 'Edit your details' },
        { icon: MapPin, label: 'Saved Addresses', path: '/addresses', badge: '2', subtitle: 'Manage delivery locations' },
        // { icon: CreditCard, label: 'Payment Methods', path: '/payment-methods', subtitle: 'Cards and UPI' },
      ],
    },
    {
      title: 'My Activity',
      items: [
        { icon: Package, label: 'My Orders', path: '/orders', badge: '3', subtitle: 'Track and return orders' },
        { icon: Heart, label: 'Wishlist', path: '/wishlist', subtitle: 'Your favorite items' },
        { icon: Gift, label: 'Rewards & Offers', path: '/rewards', subtitle: 'Coupons and points' },
      ],
    },
    {
      title: 'App Settings',
      items: [
        { icon: Bell, label: 'Notifications', path: '/notifications', subtitle: 'Manage alerts' },
        // { icon: Settings, label: 'Preferences', path: '/settings', subtitle: 'Language and theme' },
        { icon: HelpCircle, label: 'Help & Support', path: '/help', subtitle: 'FAQs and contact' },
      ],
    },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      isLoggingOut.current = true;
      setUser(null);
      navigate('/');
    }
  };

  return (
    <div className="pb-24 lg:pb-0 bg-neutral-50 min-h-screen">
      {/* Profile Header */}
      <div className="relative bg-[#2d5016] text-white pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.4) 0%, transparent 50%)'
          }}
        />

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-[#d4af37] to-[#8b7355] shadow-2xl">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-full h-full rounded-full border-4 border-[#2d5016] object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-white text-[#2d5016] rounded-full shadow-lg hover:bg-gray-100 transition-colors">
              <Camera size={16} />
            </button>
          </div>

          <h1 className="text-3xl font-bold font-['Playfair_Display'] mb-1">{user.first_name} {user.last_name}</h1>
          <p className="text-white/70 mb-6">{user.email}</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { label: 'Orders', value: '12' },
              { label: 'Wishlist', value: '8' },
              { label: 'Points', value: '450' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <p className="text-2xl font-bold text-[#d4af37] mb-0.5">{stat.value}</p>
                <p className="text-xs text-white/60 uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-12 relative z-10 space-y-6">
        {/* Install App Banner */}
        {isInstallable && (
          <button
            onClick={installApp}
            className="w-full bg-gradient-to-r from-[#d4af37] to-[#bfa040] text-white p-1 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 group"
          >
            <div className="bg-[#2d5016] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                  <Download size={24} className="text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">Install App</p>
                  <p className="text-sm text-white/60">Get the best mobile experience</p>
                </div>
              </div>
              <span className="bg-[#d4af37] text-[#2d5016] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                Install
              </span>
            </div>
          </button>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <h2 className="px-6 pt-6 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {section.title}
            </h2>
            <div className="divide-y divide-gray-50">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.path}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center group-hover:bg-[#2d5016]/10 transition-colors">
                    <item.icon size={20} className="text-gray-500 group-hover:text-[#2d5016] transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{item.label}</span>
                      {item.badge && (
                        <span className="bg-[#d4af37] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-[#2d5016] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut size={20} />
          Logout
        </button>

        {/* App Info */}
        <div className="py-6 text-center text-sm text-gray-400">
          <p className="font-medium mb-2">fernrie</p>
          <div className="flex justify-center gap-4">
            <Link to="/terms" className="hover:text-[#2d5016] transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#2d5016] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
