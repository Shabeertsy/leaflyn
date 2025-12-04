import { create } from 'zustand';
import axios from '../lib/axios';
import type { ProductCollectionResponse, APIProductVariant } from '../types';

interface ProductCollectionStore {
  featuredProducts: APIProductVariant[];
  bestsellerProducts: APIProductVariant[];
  isLoading: boolean;
  error: string | null;
  fetchProductCollections: () => Promise<void>;
}

export const useProductCollectionStore = create<ProductCollectionStore>((set, get) => ({
  featuredProducts: [],
  bestsellerProducts: [],
  isLoading: false,
  error: null,
  fetchProductCollections: async () => {
    const { featuredProducts, bestsellerProducts, isLoading } = get();
    
    // Don't fetch if already loaded or currently loading
    if ((featuredProducts.length > 0 || bestsellerProducts.length > 0) || isLoading) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<ProductCollectionResponse>('/api/product-collection/');
      set({
        featuredProducts: response.data.featured_products,
        bestsellerProducts: response.data.bestseller_products,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch product collections:', error);
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },
}));
