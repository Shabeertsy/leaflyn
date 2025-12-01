import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: async (email, password) => {
        const response = await api.post('/api/login/', { email, password });
        const { user, access, refresh } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        set({ user, isAuthenticated: true });
      },
      register: async (name, email, password) => {
        // Just return the response, don't set user yet as we need OTP
        return await api.post('/api/register/', { full_name: name, email, password });
      },
      verifyOtp: async (email, otp) => {
        const response = await api.post('/api/verify-otp/', { contact:email, otp_code:otp });
        const { user, access, refresh } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        set({ user, isAuthenticated: true });
      },
      resendOtp: async (email) => {
        await api.post('/api/resend-otp/', { contact: email });
      },
      sendOtp: async (email) => {
        await api.post('/api/send-otp/', { contact: email });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'leafin_user',
    }
  )
);
