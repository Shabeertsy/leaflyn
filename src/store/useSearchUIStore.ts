import { create } from 'zustand';
import type { Product } from '../types';

interface SearchUIState {
  searchQuery: string;
  selectedCategoryId: string;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating';
  allProducts: Product[];
  currentPage: number;
  lastLoadedPage: number;
  nextPage: string | null;
  
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (id: string) => void;
  setSortBy: (sort: 'popular' | 'price-low' | 'price-high' | 'rating') => void;
  setAllProducts: (products: Product[] | ((prev: Product[]) => Product[])) => void;
  setCurrentPage: (page: number) => void;
  setLastLoadedPage: (page: number) => void;
  setNextPage: (url: string | null) => void;
  resetSearchState: () => void;
}

export const useSearchUIStore = create<SearchUIState>((set) => ({
  searchQuery: '',
  selectedCategoryId: 'all',
  sortBy: 'popular',
  allProducts: [],
  currentPage: 1,
  lastLoadedPage: 0,
  nextPage: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setAllProducts: (products) => set((state) => ({
    allProducts: typeof products === 'function' ? products(state.allProducts) : products
  })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setLastLoadedPage: (page) => set({ lastLoadedPage: page }),
  setNextPage: (url) => set({ nextPage: url }),
  resetSearchState: () => set({
    searchQuery: '',
    selectedCategoryId: 'all',
    sortBy: 'popular',
    allProducts: [],
    currentPage: 1,
    lastLoadedPage: 0,
    nextPage: null
  }),
}));
