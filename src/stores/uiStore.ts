import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  isSidebarCollapsed: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isSidebarCollapsed: false,
  openSearch: () => set({ isSearchOpen: true, isSidebarCollapsed: true }),
  closeSearch: () => set({ isSearchOpen: false, isSidebarCollapsed: false }),
  toggleSearch: () => set((state) => ({
    isSearchOpen: !state.isSearchOpen,
    isSidebarCollapsed: !state.isSearchOpen,
  })),
}));
