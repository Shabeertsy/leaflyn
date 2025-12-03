import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem, APIWishlistItem, Product } from '../types';
import { wishlistService } from '../services/wishlistService';
import { mapVariantToProduct } from '../lib/mappers';
import { useAuthStore } from './useAuthStore';

interface WishlistState {
  wishlist: WishlistItem[];
  wishlistProducts: Product[]; // Full product details for display
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
}

// Helper function to convert API wishlist to local format
const mapAPIWishlistToLocal = (apiWishlist: APIWishlistItem[]): { items: WishlistItem[], products: Product[] } => {
  const items: WishlistItem[] = [];
  const products: Product[] = [];

  apiWishlist.forEach((item) => {
    items.push({
      productId: item.variant.uuid,
      addedAt: new Date(item.created_at),
    });
    products.push(mapVariantToProduct(item.variant));
  });

  return { items, products };
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      wishlistProducts: [],
      isLoading: false,
      error: null,

      fetchWishlist: async () => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) return; // Use local state if not authenticated

        try {
          set({ isLoading: true, error: null });
          const apiWishlist = await wishlistService.getWishlist();
          const { items, products } = mapAPIWishlistToLocal(apiWishlist);
          set({ 
            wishlist: items,
            wishlistProducts: products,
            isLoading: false 
          });
        } catch (error: any) {
          // Silently fail on 401 (user not authenticated)
          if (error.response?.status === 401) {
            set({ wishlist: [], wishlistProducts: [], isLoading: false, error: null });
            return;
          }

          console.error('Failed to fetch wishlist:', error);
          set({ 
            error: error.response?.data?.error || 'Failed to fetch wishlist',
            isLoading: false 
          });
        }
      },

      addToWishlist: async (product: Product) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
          try {
            set({ isLoading: true, error: null });
            await wishlistService.addToWishlist(product.id);
            // Refresh wishlist after adding
            await get().fetchWishlist();
          } catch (error: any) {
            console.error('Failed to add to wishlist:', error);
            set({ 
              error: error.response?.data?.error || 'Failed to add to wishlist',
              isLoading: false 
            });
            throw error;
          }
        } else {
          // Local logic
          const currentWishlist = get().wishlist;
          const currentProducts = get().wishlistProducts;
          
          // Check if already in wishlist
          if (!currentWishlist.some(item => item.productId === product.id)) {
            set({
              wishlist: [...currentWishlist, { productId: product.id, addedAt: new Date() }],
              wishlistProducts: [...currentProducts, product]
            });
          }
        }
      },

      removeFromWishlist: async (productId: string) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
          try {
            set({ isLoading: true, error: null });
            await wishlistService.removeFromWishlist(productId);
            // Refresh wishlist after removing
            await get().fetchWishlist();
          } catch (error: any) {
            console.error('Failed to remove from wishlist:', error);
            set({ 
              error: error.response?.data?.error || 'Failed to remove from wishlist',
              isLoading: false 
            });
            throw error;
          }
        } else {
          // Local logic
          const currentWishlist = get().wishlist;
          const currentProducts = get().wishlistProducts;
          
          set({
            wishlist: currentWishlist.filter(item => item.productId !== productId),
            wishlistProducts: currentProducts.filter(product => product.id !== productId)
          });
        }
      },

      isInWishlist: (productId: string) => {
        return get().wishlist.some((item) => item.productId === productId);
      },

      toggleWishlist: async (product: Product) => {
        const isInWishlist = get().isInWishlist(product.id);
        if (isInWishlist) {
          await get().removeFromWishlist(product.id);
        } else {
          await get().addToWishlist(product);
        }
      },
    }),
    {
      name: 'leafin_wishlist',
      partialize: (state) => ({ 
        wishlist: state.wishlist,
        wishlistProducts: state.wishlistProducts 
      }), // Persist wishlist items and products
    }
  )
);
