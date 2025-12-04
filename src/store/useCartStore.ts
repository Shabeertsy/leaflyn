import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, APICart, APICartItem, Product } from '../types';
import { cartService } from '../services/cartService';
import { mapVariantToProduct } from '../lib/mappers';
import { useAuthStore } from './useAuthStore';

interface CartState {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  // Helper to find cart item UUID by product ID
  findCartItemUuid: (productId: string) => string | null;
  // Sync local cart to backend after authentication
  syncLocalCartToBackend: () => Promise<void>;
}

// Helper function to convert API cart to local cart format
const mapAPICartToLocal = (apiCart: APICart): CartItem[] => {
  return apiCart.items.map((item: APICartItem) => ({
    product: mapVariantToProduct(item.variant),
    quantity: item.quantity,
    // Store the cart item UUID in a custom property for later use
    _cartItemUuid: item.uuid,
  })) as CartItem[];
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isLoading: false,
      error: null,

      fetchCart: async () => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) return; // Use local state if not authenticated

        try {
          set({ isLoading: true, error: null });
          const apiCart = await cartService.getCart();
          const cart = mapAPICartToLocal(apiCart);
          set({ cart, isLoading: false });
        } catch (error: any) {
          // Silently fail on 401 (user not authenticated)
          if (error.response?.status === 401) {
            set({ cart: [], isLoading: false, error: null });
            return;
          }
          
          console.error('Failed to fetch cart:', error);
          set({ 
            error: error.response?.data?.error || 'Failed to fetch cart',
            isLoading: false 
          });
        }
      },

      addToCart: async (product: Product, quantity = 1) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
          try {
            set({ isLoading: true, error: null });
            const apiCart = await cartService.addToCart(product.id, quantity);
            const cart = mapAPICartToLocal(apiCart);
            set({ cart, isLoading: false });
          } catch (error: any) {
            console.error('Failed to add to cart:', error);
            set({ 
              error: error.response?.data?.error || 'Failed to add to cart',
              isLoading: false 
            });
            throw error;
          }
        } else {
          // Local logic
          const currentCart = get().cart;
          const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);
          
          let updatedCart = [...currentCart];
          if (existingItemIndex >= 0) {
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + quantity
            };
          } else {
            updatedCart.push({ product, quantity });
          }
          
          set({ cart: updatedCart });
        }
      },

      removeFromCart: async (productId: string) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
          const cartItemUuid = get().findCartItemUuid(productId);
          if (!cartItemUuid) return;

          try {
            set({ isLoading: true, error: null });
            const apiCart = await cartService.removeFromCart(cartItemUuid);
            const cart = mapAPICartToLocal(apiCart);
            set({ cart, isLoading: false });
          } catch (error: any) {
            console.error('Failed to remove from cart:', error);
            set({ 
              error: error.response?.data?.error || 'Failed to remove from cart',
              isLoading: false 
            });
            throw error;
          }
        } else {
          // Local logic
          const updatedCart = get().cart.filter(item => item.product.id !== productId);
          set({ cart: updatedCart });
        }
      },

      updateCartQuantity: async (productId: string, quantity: number) => {
        if (quantity < 1) {
          await get().removeFromCart(productId);
          return;
        }

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        
        if (isAuthenticated) {
          const cartItemUuid = get().findCartItemUuid(productId);
          if (!cartItemUuid) return;

          try {
            set({ isLoading: true, error: null });
            const apiCart = await cartService.updateCartItem(cartItemUuid, quantity);
            const cart = mapAPICartToLocal(apiCart);
            set({ cart, isLoading: false });
          } catch (error: any) {
            console.error('Failed to update cart quantity:', error);
            set({ 
              error: error.response?.data?.error || 'Failed to update cart quantity',
              isLoading: false 
            });
            throw error;
          }
        } else {
          // Local logic
          const currentCart = get().cart;
          const updatedCart = currentCart.map(item => 
            item.product.id === productId ? { ...item, quantity } : item
          );
          set({ cart: updatedCart });
        }
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      findCartItemUuid: (productId: string) => {
        const item = get().cart.find((item) => item.product.id === productId);
        return (item as any)?._cartItemUuid || null;
      },

      syncLocalCartToBackend: async () => {
        const localCart = get().cart;
        if (localCart.length === 0) return;

        try {
          set({ isLoading: true, error: null });
          
          // Prepare cart items for sync
          const itemsToSync = localCart.map(item => ({
            variantUuid: item.product.id,
            quantity: item.quantity
          }));

          // Sync to backend
          const apiCart = await cartService.syncLocalCartToBackend(itemsToSync);
          const cart = mapAPICartToLocal(apiCart);
          set({ cart, isLoading: false });
        } catch (error: any) {
          console.error('Failed to sync cart to backend:', error);
          set({ 
            error: error.response?.data?.error || 'Failed to sync cart',
            isLoading: false 
          });
          // Don't throw error - keep local cart if sync fails
        }
      },
    }),
    {
      name: 'leafin_cart',
      partialize: (state) => ({ cart: state.cart }), // Only persist cart items
    }
  )
);
