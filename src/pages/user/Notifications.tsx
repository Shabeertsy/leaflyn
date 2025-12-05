import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Package, Heart, Gift, Truck, CheckCircle } from 'lucide-react';
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
      markAsRead(notification.uuid);
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        {isLoading && currentPage === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5016]"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.uuid}
                    onClick={() => handleMarkAsRead(notification)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                      notification.is_read
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
                          <h3 className={`font-bold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-[#2d5016] rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className={`text-sm mb-2 ${notification.is_read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{formatTime(notification.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite Scroll Trigger */}
            {nextPage && (
              <div ref={observerTarget} className="mt-8 flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2d5016]"></div>
              </div>
            )}

            {/* End of Results */}
            {!nextPage && notifications.length > 0 && (
              <div className="mt-8 text-center py-8">
                <p className="text-gray-500 font-medium">You've reached the end of notifications</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
