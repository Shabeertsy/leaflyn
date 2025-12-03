import api from '../lib/axios';
import type { APIWishlistItem } from '../types';

export const wishlistService = {
  /**
   * Get all wishlist items for the current user
   */
  getWishlist: async (): Promise<APIWishlistItem[]> => {
    const response = await api.get('/api/wishlist/');
    return response.data;
  },

  /**
   * Add a product variant to wishlist
   * @param variantUuid - UUID of the product variant
   */
  addToWishlist: async (variantUuid: string): Promise<{ message: string }> => {
    const response = await api.post('/api/wishlist/', {
      variant_uuid: variantUuid,
    });
    return response.data;
  },

  /**
   * Remove a product variant from wishlist
   * @param variantUuid - UUID of the product variant
   */
  removeFromWishlist: async (variantUuid: string): Promise<{ message: string }> => {
    const response = await api.delete('/api/wishlist/', {
      data: {
        variant_uuid: variantUuid,
      },
    });
    return response.data;
  },
};
