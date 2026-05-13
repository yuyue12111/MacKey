import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KeyboardLayoutType } from '@/types/keyboard';

interface PreferenceState {
  keyboardLayout: KeyboardLayoutType;
  showWindowsComparison: boolean;
  theme: 'light' | 'dark' | 'system';
  setKeyboardLayout: (layout: KeyboardLayoutType) => void;
  toggleWindowsComparison: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      keyboardLayout: 'ANSI',
      showWindowsComparison: true,
      theme: 'system',

      setKeyboardLayout: (layout) => set({ keyboardLayout: layout }),
      toggleWindowsComparison: () =>
        set((s) => ({ showWindowsComparison: !s.showWindowsComparison })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'macedu_prefs' }
  )
);
