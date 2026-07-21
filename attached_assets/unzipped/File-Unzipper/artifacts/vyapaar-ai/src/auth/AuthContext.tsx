/**
 * AuthContext — Clerk bridge
 * Exposes the same interface as before so all existing views compile unchanged.
 * Auth is now powered by Replit-managed Clerk (Google, email/password, OTP).
 */
import { createContext, useContext, type ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/react';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const user: AuthUser | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
      }
    : null;

  const signOut = async () => {
    await clerkSignOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading: !isLoaded, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
