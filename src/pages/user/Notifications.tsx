import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Package, Heart, Gift, Truck, CheckCircle, Clock, Check } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import type { APINotification } from '../../types';

const Notifications: React.FC = () => {
  const { 
    notifications, 
    isLoading, 
    unreadCount, 
    nextPage,
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    clearNotifications
  } = useNotificationStore();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset page and fetch fresh notifications on mount
    setCurrentPage(1);
    fetchNotifications(1);
    
    // Cleanup on unmount
    return () => {
      clearNotifications();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (nextPage && !isLoading) {
      const nextPageNum = currentPage + 1;
      setCurrentPage(nextPageNum);
      fetchNotifications(nextPageNum);
    }
  }, [nextPage, isLoading, currentPage, fetchNotifications]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  const handleMarkAsRead = (notification: APINotification) => {
    if (!notification.is_read) {
      const identifier = notification.uuid || notification.id?.toString();
      if (identifier) {
        markAsRead(identifier);
      }
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const getIcon = (type: APINotification['type']) => {
    switch (type) {
      case 'order':
        return Package;
      case 'delivery':
        return Truck;
      case 'wishlist':
        return Heart;
      case 'offer':
        return Gift;
      default:
        return CheckCircle;
    }
  };

  const getTypeColor = (type: APINotification['type']) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600';
      case 'delivery':
        return 'bg-green-100 text-green-600';
      case 'wishlist':
        return 'bg-red-100 text-red-600';
      case 'offer':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="pb-24 lg:pb-0 bg-[#f8f9fa] min-h-screen font-sans">
      {/* Header - Glassmorphism */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 z-30 px-4 md:px-6 py-4 transition-all duration-300 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/account" className="p-2.5 -ml-2.5 hover:bg-gray-100 rounded-full transition-all duration-300 group active:scale-95">
                <ArrowLeft size={20} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-['Playfair_Display'] tracking-tight">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-xs font-medium text-[#2d5016] mt-0.5 flex items-center gap-1.5 animate-fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d5016] animate-pulse shadow-[0_0_8px_rgba(45,80,22,0.4)]" />
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold uppercase tracking-wider text-[#2d5016] hover:bg-[#2d5016]/5 px-4 py-2 rounded-full transition-all duration-300 border border-[#2d5016]/20 hover:border-[#2d5016]/40 active:scale-95"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Modern Filter Tabs */}
          <div className="flex p-1.5 bg-gray-100/80 rounded-2xl w-full md:w-fit gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              Unread
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        {isLoading && currentPage === 1 ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-[#2d5016] border-t-transparent"></div>
            <p className="text-sm text-gray-400 font-medium animate-pulse">Checking for updates...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-32 px-6 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Bell size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">All Caught Up</h3>
            <p className="text-gray-500 max-w-xs mx-auto leading-relaxed text-sm">
              You have no new notifications. We'll notify you when something important arrives.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.uuid}
                    onClick={() => handleMarkAsRead(notification)}
                    className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 cursor-pointer border ${
                      notification.is_read
                        ? 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                        : 'bg-white border-[#2d5016]/20 shadow-[0_4px_20px_-12px_rgba(45,80,22,0.15)] hover:shadow-[0_8px_25px_-12px_rgba(45,80,22,0.2)]'
                    }`}
                    style={{
                      animation: `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.05}s`,
                      opacity: 0,
                      transform: 'translateY(10px)'
                    }}
                  >
                    <div className="flex gap-4">
                      {/* Icon Container */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 ${getTypeColor(notification.type)}`}>
                        <Icon size={20} strokeWidth={2.5} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className={`font-bold text-[15px] leading-snug ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                              <Clock size={10} />
                              {formatTime(notification.created_at)}
                            </span>
                            {!notification.is_read && (
                              <span className="w-2 h-2 rounded-full bg-[#2d5016] shadow-[0_0_0_2px_white]" />
                            )}
                          </div>
                        </div>
                        
                        <p className={`text-[13px] leading-relaxed line-clamp-2 ${notification.is_read ? 'text-gray-500' : 'text-gray-600 font-medium'}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite Scroll Trigger */}
            {nextPage && (
              <div ref={observerTarget} className="mt-8 flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#2d5016] border-t-transparent"></div>
              </div>
            )}

            {/* End of Results */}
            {!nextPage && notifications.length > 0 && (
              <div className="mt-12 mb-8 flex items-center justify-center gap-4 opacity-40">
                <div className="h-px bg-gray-300 w-12" />
                <div className="flex items-center gap-1.5">
                    <Check size={12} className="text-gray-500" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">All caught up</p>
                </div>
                <div className="h-px bg-gray-300 w-12" />
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
