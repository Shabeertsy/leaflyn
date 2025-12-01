import { create } from 'zustand';
import api from '../lib/axios';
import type { Category } from '../types';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    const { categories, loading } = get();
    
    // Don't fetch if already loaded or currently loading
    if (categories.length > 0 || loading) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await api.get('/api/categories/');
      set({ categories: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch categories',
        loading: false 
      });
    }
  },
}));
