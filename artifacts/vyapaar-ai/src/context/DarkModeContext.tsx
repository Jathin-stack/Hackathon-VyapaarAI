import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface DarkModeCtx {
  isDark: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeCtx>({ isDark: false, toggle: () => {} });

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('vyapaar-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('vyapaar-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('vyapaar-theme', 'light');
    }
  }, [isDark]);

  return (
    <DarkModeContext.Provider value={{ isDark, toggle: () => setIsDark(p => !p) }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
