import { createContext, useContext } from 'react';
import type { ViewKey } from '../components/Sidebar';

interface NavigationCtx {
  navigate: (view: ViewKey) => void;
  active: ViewKey;
}

export const NavigationContext = createContext<NavigationCtx>({
  navigate: () => {},
  active: 'dashboard',
});

export function useNavigation() {
  return useContext(NavigationContext);
}
