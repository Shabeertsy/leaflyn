import api from '../lib/axios';
import type { APICart } from '../types';

export const cartService = {
  /**
   * Get the current user's cart
   */
  getCart: async (): Promise<APICart> => {
    const response = await api.get('/api/cart/');
    return response.data;
  },

  /**
   * Add a product variant to cart
   * @param variantUuid - UUID of the product variant
   * @param quantity - Quantity to add (default: 1)
   */
  addToCart: async (variantUuid: string, quantity: number = 1): Promise<APICart> => {
    const response = await api.post('/api/add-to-cart/', {
      variant_uuid: variantUuid,
      quantity,
    });
    return response.data;
  },

  /**
   * Remove an item from cart
   * @param cartItemUuid - UUID of the cart item to remove
   */
  removeFromCart: async (cartItemUuid: string): Promise<APICart> => {
    const response = await api.delete(`/api/remove-from-cart/${cartItemUuid}/`);
    return response.data;
  },

  /**
   * Update cart item quantity
   * @param cartItemUuid - UUID of the cart item
   * @param quantity - New quantity
   */
  updateCartItem: async (cartItemUuid: string, quantity: number): Promise<APICart> => {
    const response = await api.patch(`/api/update-cart-item/${cartItemUuid}/`, {
      quantity,
    });
    return response.data;
  },
};
