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
      
      set((state) => {
        // Append new notifications if page > 1, otherwise replace
        const allNotifications = page > 1 
          ? [...state.notifications, ...response.data.results]
          : response.data.results;
        
        const unreadCount = allNotifications.filter(n => !n.is_read).length;
        
        return {
          notifications: allNotifications,
          totalCount: response.data.count,
          nextPage: response.data.next,
          previousPage: response.data.previous,
          unreadCount,
          isLoading: false,
        };
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

  markAllAsRead: async () => {
    try {
      // Try to use bulk mark-all-as-read endpoint
      const apiUrl = '/api/notifications/mark-all-as-read/';
      console.log('Marking all notifications as read:', apiUrl);
      
      await axios.post(apiUrl);
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      console.error('Bulk mark-all-as-read failed, falling back to individual calls:', error);
      
      // Fallback: Update locally first for immediate UI feedback
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
      
      // Then make individual API calls for unread notifications
      const { notifications } = get();
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      // Call API for each unread notification (in background)
      unreadNotifications.forEach(n => {
        get().markAsRead(n.uuid).catch(err => 
          console.error(`Failed to mark ${n.uuid} as read:`, err)
        );
      });
    }
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
