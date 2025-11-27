import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Package, Heart, Gift, Truck, CheckCircle, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'wishlist' | 'offer' | 'delivery' | 'general';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order #LF-12345 has been confirmed and is being prepared.',
      time: '2 hours ago',
      read: false,
      icon: Package,
    },
    {
      id: '2',
      type: 'delivery',
      title: 'Out for Delivery',
      message: 'Your order #LF-12340 is out for delivery and will arrive today.',
      time: '5 hours ago',
      read: false,
      icon: Truck,
    },
    {
      id: '3',
      type: 'wishlist',
      title: 'Price Drop Alert',
      message: 'Monstera Deliciosa is now 20% off! Get it before stock runs out.',
      time: '1 day ago',
      read: true,
      icon: Heart,
    },
    {
      id: '4',
      type: 'offer',
      title: 'Special Offer',
      message: 'Get 30% off on all indoor plants. Use code: INDOOR30',
      time: '2 days ago',
      read: true,
      icon: Gift,
    },
    {
      id: '5',
      type: 'general',
      title: 'Welcome to Leafin',
      message: 'Thank you for joining our plant-loving community! Explore our collection.',
      time: '3 days ago',
      read: true,
      icon: CheckCircle,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50 text-blue-600';
      case 'delivery':
        return 'bg-green-50 text-green-600';
      case 'wishlist':
        return 'bg-red-50 text-red-600';
      case 'offer':
        return 'bg-[#d4af37]/10 text-[#d4af37]';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="pb-24 lg:pb-0 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-gray-700" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm font-semibold text-[#2d5016] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-[#2d5016] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === 'unread'
                  ? 'bg-[#2d5016] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-3xl mx-auto px-6 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                    notification.read
                      ? 'border-gray-100'
                      : 'border-[#2d5016]/20 shadow-sm'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-bold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#2d5016] rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{notification.time}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
