import { create } from 'zustand';
import axios from '../lib/axios';
import type { APIOrder, PaginatedResponse } from '../types';

interface OrderStore {
  orders: APIOrder[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  nextPage: string | null;
  previousPage: string | null;
  fetchOrders: (page?: number) => Promise<void>;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  nextPage: null,
  previousPage: null,

  fetchOrders: async (page = 1) => {
    set({ isLoading: true, error: null });
    
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      
      const apiUrl = `/api/my-orders/?${params.toString()}`;
      console.log('Fetching orders from:', apiUrl);
      
      const response = await axios.get<PaginatedResponse<APIOrder>>(apiUrl);
      
      set({
        orders: response.data.results,
        totalCount: response.data.count,
        nextPage: response.data.next,
        previousPage: response.data.previous,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      
      // Handle 404 (No orders found) as empty list
      if (error.response?.status === 404) {
        set({
          orders: [],
          totalCount: 0,
          nextPage: null,
          previousPage: null,
          isLoading: false,
          error: null,
        });
        return;
      }
      
      set({ 
        error: error.response?.data?.error || 'Failed to fetch orders', 
        isLoading: false 
      });
    }
  },

  clearOrders: () => {
    set({
      orders: [],
      totalCount: 0,
      nextPage: null,
      previousPage: null,
      error: null,
    });
  },
}));
