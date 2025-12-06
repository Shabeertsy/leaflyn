import { create } from 'zustand';
import type { Product } from '../types';

interface CategoryUIState {
  categoryId: string | null;
  products: Product[];
  page: number;
  hasMore: boolean;
  scrollPosition: number;
  
  setCategoryState: (id: string, products: Product[], page: number, hasMore: boolean) => void;
  setScrollPosition: (pos: number) => void;
  resetCategoryState: () => void;
}

export const useCategoryUIStore = create<CategoryUIState>((set) => ({
  categoryId: null,
  products: [],
  page: 1,
  hasMore: true,
  scrollPosition: 0,

  setCategoryState: (id, products, page, hasMore) => set({ categoryId: id, products, page, hasMore }),
  setScrollPosition: (pos) => set({ scrollPosition: pos }),
  resetCategoryState: () => set({ categoryId: null, products: [], page: 1, hasMore: true, scrollPosition: 0 }),
}));
