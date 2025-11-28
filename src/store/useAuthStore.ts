import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        set({ user, isAuthenticated: true });
      },
      register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'leafin_user',
    }
  )
);
