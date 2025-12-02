import { create } from 'zustand';
import api from '../lib/axios';
import type { Service, ServiceCategory } from '../types';

interface ServiceStore {
  services: Service[];
  categories: ServiceCategory[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  fetchServicesByCategory: (categoryId: number) => Promise<void>;
  getServiceById: (id: number) => Service | undefined;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch both categories and services
      const [categoriesResponse, servicesResponse] = await Promise.all([
        api.get('/api/service-category/'),
        api.get('/api/service-list/')
      ]);
      
      const categoriesData: ServiceCategory[] = categoriesResponse.data;
      const servicesData: Service[] = servicesResponse.data;
      
      set({ 
        services: servicesData, 
        categories: categoriesData,
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching services:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch services', 
        isLoading: false 
      });
    }
  },

  fetchServicesByCategory: async (categoryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/service-list/?category=${categoryId}`);
      set({ services: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch services', 
        isLoading: false 
      });
    }
  },

  getServiceById: (id: number) => {
    return get().services.find(service => service.id === id);
  },
}));
