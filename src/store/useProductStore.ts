import { create } from 'zustand';
import axios from '../lib/axios';
import type { APIProductVariant, PaginatedResponse } from '../types';

interface ProductFilters {
  page?: number;
  category_id?: string;
  size?: string[];
  q?: string; // Search query parameter
}

interface ProductStore {
  products: APIProductVariant[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  nextPage: string | null;
  previousPage: string | null;
  lastFetchParams: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  nextPage: null,
  previousPage: null,
  lastFetchParams: null,
  fetchProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.size) {
      filters.size.forEach(s => params.append('size', s));
    }
    if (filters.q) params.append('q', filters.q); // Add search query parameter
    
    const paramsString = params.toString();
    const { lastFetchParams, isLoading } = get();
    
    // Prevent duplicate requests with same parameters
    if (isLoading && lastFetchParams === paramsString) {
      return;
    }

    set({ isLoading: true, error: null, lastFetchParams: paramsString });
    
    const apiUrl = `/api/product-variants/?${paramsString}`;
    console.log('Fetching products from:', apiUrl);
    console.log('Filters:', filters);
    
    try {
      const response = await axios.get<PaginatedResponse<APIProductVariant>>(apiUrl);
      
      set({
        products: response.data.results,
        totalCount: response.data.count,
        nextPage: response.data.next,
        previousPage: response.data.previous,
        isLoading: false,
      });
    } catch (error: any) {
      // Handle 404 (No products found) as empty list
      if (error.response?.status === 404) {
        set({
          products: [],
          totalCount: 0,
          nextPage: null,
          previousPage: null,
          isLoading: false,
          error: null
        });
        return;
      }
      
      console.error('Failed to fetch products:', error);
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },
}));
