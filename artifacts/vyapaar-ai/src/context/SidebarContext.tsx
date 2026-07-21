import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from 'react';

interface SidebarCtx {
  isPinned: boolean;
  isDesktopOpen: boolean;
  togglePin: () => void;
  openDesktop: () => void;
  scheduleClose: () => void;
  cancelClose: () => void;
}

const SidebarContext = createContext<SidebarCtx | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isPinned, setIsPinned] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openDesktop = useCallback(() => {
    clearTimeout(closeTimer.current);
    setIsDesktopOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    if (isPinned) return;
    closeTimer.current = setTimeout(() => setIsDesktopOpen(false), 500);
  }, [isPinned]);

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  const togglePin = useCallback(() => {
    setIsPinned(prev => {
      const next = !prev;
      if (!next) setIsDesktopOpen(false); // unpin → collapse
      else setIsDesktopOpen(true);         // pin → stay open
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider value={{ isPinned, isDesktopOpen, togglePin, openDesktop, scheduleClose, cancelClose }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
