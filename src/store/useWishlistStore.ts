import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem } from '../types';

interface WishlistState {
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      addToWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.find((item) => item.productId === productId);
          if (exists) return state;
          return {
            wishlist: [...state.wishlist, { productId, addedAt: new Date() }],
          };
        });
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.productId !== productId),
        }));
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.productId === productId);
      },
    }),
    {
      name: 'leafin_wishlist',
    }
  )
);
