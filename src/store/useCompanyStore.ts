import { create } from 'zustand';
import axios from '../lib/axios';
import type { CompanyContact } from '../types/company';

interface CompanyStore {
  companyContact: CompanyContact | null;
  isLoading: boolean;
  error: string | null;
  fetchCompanyContact: () => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companyContact: null,
  isLoading: false,
  error: null,
  fetchCompanyContact: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/company-contact/');
      set({ companyContact: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
