import { create } from 'zustand';

interface UIState {
  showMobileMenu: boolean;
  showCart: boolean;
  setShowMobileMenu: (show: boolean) => void;
  setShowCart: (show: boolean) => void;
  toggleMobileMenu: () => void;
  toggleCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  showMobileMenu: false,
  showCart: false,
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  setShowCart: (show) => set({ showCart: show }),
  toggleMobileMenu: () => set((state) => ({ showMobileMenu: !state.showMobileMenu })),
  toggleCart: () => set((state) => ({ showCart: !state.showCart })),
}));
