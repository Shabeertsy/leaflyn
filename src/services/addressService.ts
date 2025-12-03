import api from '../lib/axios';

export interface APIAddress {
  uuid: string;
  user: number;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const addressService = {
  /**
   * Fetch all addresses for the authenticated user
   * Note: Backend needs to implement GET /api/addresses/ endpoint
   */
  fetchAddresses: async (): Promise<APIAddress[]> => {
    const response = await api.get('/api/address-list/');
    return response.data;
  },

  /**
   * Add a new address for the authenticated user
   */
  addAddress: async (addressData: {
    name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    country: string;
    pin_code: string;
    is_default?: boolean;
  }): Promise<APIAddress> => {
    const response = await api.post('/api/address-add/', addressData);
    return response.data;
  },

  /**
   * Update an existing address
   * @param uuid - UUID of the address to update
   */
  updateAddress: async (
    uuid: string,
    addressData: {
      name?: string;
      phone?: string;
      address_line_1?: string;
      address_line_2?: string;
      city?: string;
      state?: string;
      country?: string;
      pin_code?: string;
      is_default?: boolean;
    }
  ): Promise<APIAddress> => {
    const response = await api.patch(`/api/address-update/${uuid}/`, addressData);
    return response.data;
  },

  /**
   * Delete an address
   * @param uuid - UUID of the address to delete
   */
  deleteAddress: async (uuid: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/address-delete/${uuid}/`);
    return response.data;
  },
};
