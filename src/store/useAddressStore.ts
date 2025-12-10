import { create } from 'zustand';
import { addressService, type APIAddress } from '../services/addressService';

export interface Address {
  uuid: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchAddresses: () => Promise<void>;
  addAddress: (addressData: {
    name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    country: string;
    pin_code: string;
    is_default?: boolean;
  }) => Promise<void>;
  updateAddress: (uuid: string, addressData: Partial<{
    name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    country: string;
    pin_code: string;
    is_default: boolean;
  }>) => Promise<void>;
  deleteAddress: (uuid: string) => Promise<void>;
  setDefaultAddress: (uuid: string) => Promise<void>;
}

// Helper to map API address to local format
const mapAPIAddressToLocal = (apiAddress: APIAddress): Address => ({
  uuid: apiAddress.uuid,
  name: apiAddress.name,
  phone: apiAddress.phone,
  addressLine1: apiAddress.address_line_1,
  addressLine2: apiAddress.address_line_2,
  city: apiAddress.city,
  state: apiAddress.state,
  country: apiAddress.country,
  pincode: apiAddress.pin_code,
  isDefault: apiAddress.is_default,
});

export const useAddressStore = create<AddressState>()((set) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    try {
      set({ isLoading: true, error: null });
      const apiAddresses = await addressService.fetchAddresses();
      const addresses = apiAddresses.map(mapAPIAddressToLocal);
      set({ addresses, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch addresses:', error);
      set({
        error: error.response?.data?.error || 'Failed to fetch addresses',
        isLoading: false,
        addresses: [] 
      });
    }
  },

  addAddress: async (addressData) => {
    try {
      set({ isLoading: true, error: null });
      const apiAddress = await addressService.addAddress(addressData);
      const newAddress = mapAPIAddressToLocal(apiAddress);
      
      // Add to local state
      set((state) => ({
        addresses: [...state.addresses, newAddress],
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Failed to add address:', error);
      set({
        error: error.response?.data?.error || 'Failed to add address',
        isLoading: false
      });
      throw error;
    }
  },

  updateAddress: async (uuid, addressData) => {
    try {
      set({ isLoading: true, error: null });
      const apiAddress = await addressService.updateAddress(uuid, addressData);
      const updatedAddress = mapAPIAddressToLocal(apiAddress);
      
      // Update in local state
      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.uuid === uuid ? updatedAddress : addr
        ),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Failed to update address:', error);
      set({
        error: error.response?.data?.error || 'Failed to update address',
        isLoading: false
      });
      throw error;
    }
  },

  deleteAddress: async (uuid) => {
    try {
      set({ isLoading: true, error: null });
      await addressService.deleteAddress(uuid);
      
      // Remove from local state
      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.uuid !== uuid),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Failed to delete address:', error);
      set({
        error: error.response?.data?.error || 'Failed to delete address',
        isLoading: false
      });
      throw error;
    }
  },

  setDefaultAddress: async (uuid) => {
    try {
      set({ isLoading: true, error: null });
      await addressService.updateAddress(uuid, { is_default: true });
      
      // Update local state - set all to false, then set selected to true
      set((state) => ({
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.uuid === uuid
        })),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Failed to set default address:', error);
      set({
        error: error.response?.data?.error || 'Failed to set default address',
        isLoading: false
      });
      throw error;
    }
  },
}));
