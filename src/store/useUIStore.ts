import { create } from 'zustand';

interface UIState {
  showMobileMenu: boolean;
  showCart: boolean;
  showLoginPrompt: boolean;
  pendingAction: (() => void) | null;
  setShowMobileMenu: (show: boolean) => void;
  setShowCart: (show: boolean) => void;
  setShowLoginPrompt: (show: boolean) => void;
  setPendingAction: (action: (() => void) | null) => void;
  toggleMobileMenu: () => void;
  toggleCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  showMobileMenu: false,
  showCart: false,
  showLoginPrompt: false,
  pendingAction: null,
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  setShowCart: (show) => set({ showCart: show }),
  setShowLoginPrompt: (show) => set({ showLoginPrompt: show }),
  setPendingAction: (action) => set({ pendingAction: action }),
  toggleMobileMenu: () => set((state) => ({ showMobileMenu: !state.showMobileMenu })),
  toggleCart: () => set((state) => ({ showCart: !state.showCart })),
}));
