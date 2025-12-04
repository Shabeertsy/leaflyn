import { create } from 'zustand';
import axios from '../lib/axios';
import type { APINotification, PaginatedResponse } from '../types';

interface NotificationStore {
  notifications: APINotification[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  nextPage: string | null;
  previousPage: string | null;
  unreadCount: number;
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  nextPage: null,
  previousPage: null,
  unreadCount: 0,

  fetchNotifications: async (page = 1) => {
    set({ isLoading: true, error: null });
    
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      
      const apiUrl = `/api/notifications/?${params.toString()}`;
      console.log('Fetching notifications from:', apiUrl);
      
      const response = await axios.get<PaginatedResponse<APINotification>>(apiUrl);
      
      const unreadCount = response.data.results.filter(n => !n.is_read).length;
      
      set({
        notifications: response.data.results,
        totalCount: response.data.count,
        nextPage: response.data.next,
        previousPage: response.data.previous,
        unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      
      // Handle 404 (No notifications found) as empty list
      if (error.response?.status === 404) {
        set({
          notifications: [],
          totalCount: 0,
          nextPage: null,
          previousPage: null,
          unreadCount: 0,
          isLoading: false,
          error: null,
        });
        return;
      }
      
      set({ 
        error: error.response?.data?.error || 'Failed to fetch notifications', 
        isLoading: false 
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const apiUrl = `/api/notifications/mark-as-read/${notificationId}/`;
      console.log('Marking notification as read:', apiUrl);
      
      await axios.post(apiUrl);
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n =>
          n.uuid === notificationId ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
      set({ error: error.response?.data?.error || 'Failed to mark notification as read' });
    }
  },

  markAllAsRead: () => {
    // Update all notifications to read locally
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, is_read: true })),
      unreadCount: 0,
    }));
    
    // Optionally, you can make API calls for each notification
    const { notifications } = get();
    notifications.forEach(n => {
      if (!n.is_read) {
        get().markAsRead(n.uuid);
      }
    });
  },

  clearNotifications: () => {
    set({
      notifications: [],
      totalCount: 0,
      nextPage: null,
      previousPage: null,
      unreadCount: 0,
      error: null,
    });
  },
}));
