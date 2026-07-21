/**
 * AuthContext
 *
 * When VITE_CLERK_PUBLISHABLE_KEY is set → real Clerk user via @clerk/react.
 * Otherwise                              → demo user (preview / local dev).
 */
import { createContext, useContext, useState, type ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password?: string) => Promise<{ error: string | null }>;
  signInWithGoogle: (email?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Demo provider (no Clerk key) ─────────────────────────────────────────────
const DEMO_USER: AuthUser = { id: 'demo-user', email: 'demo@vyapaarai.com' };

function DemoAuthProvider({
  children,
  onSignOut,
}: {
  children: ReactNode;
  onSignOut?: () => void;
}) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('vyapaar-demo-user');
    if (stored === 'logged-out') return null;
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return DEMO_USER;
  });

  const signIn = async (email: string, password?: string) => {
    const loggedUser = { id: 'demo-user', email };
    setUser(loggedUser);
    window.localStorage.setItem('vyapaar-demo-user', JSON.stringify(loggedUser));
    return { error: null };
  };

  const signUp = async (email: string, password?: string) => {
    const loggedUser = { id: 'demo-user', email };
    setUser(loggedUser);
    window.localStorage.setItem('vyapaar-demo-user', JSON.stringify(loggedUser));
    return { error: null };
  };

  const signInWithGoogle = async (email?: string) => {
    const loggedUser = { id: 'google-user', email: email || 'google.user@gmail.com' };
    setUser(loggedUser);
    window.localStorage.setItem('vyapaar-demo-user', JSON.stringify(loggedUser));
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    window.localStorage.setItem('vyapaar-demo-user', 'logged-out');
    onSignOut?.();
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Clerk provider (key present) ─────────────────────────────────────────────
function ClerkAuthProvider({
  children,
  onSignOut,
}: {
  children: ReactNode;
  onSignOut?: () => void;
}) {
  // Dynamic import so we never crash when Clerk isn't configured
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useUser, useClerk, useSignIn, useSignUp } = require('@clerk/react') as typeof import('@clerk/react');
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { signIn: clerkSignIn, isLoaded: signInLoaded } = useSignIn() as any;
  const { signUp: clerkSignUp, isLoaded: signUpLoaded } = useSignUp() as any;

  const user: AuthUser | null = isLoaded && clerkUser
    ? { id: clerkUser.id, email: clerkUser.primaryEmailAddress?.emailAddress ?? '' }
    : null;

  const signIn = async (email: string, password?: string) => {
    if (!signInLoaded) return { error: 'Clerk is not loaded yet.' };
    try {
      const result = await clerkSignIn.create({
        identifier: email,
        password,
      });
      if (result.status === 'complete') {
        return { error: null };
      }
      return { error: `Sign in status: ${result.status}` };
    } catch (err: any) {
      return { error: err.errors?.[0]?.message || err.message || 'Error signing in' };
    }
  };

  const signUp = async (email: string, password?: string) => {
    if (!signUpLoaded) return { error: 'Clerk is not loaded yet.' };
    try {
      const result = await clerkSignUp.create({
        emailAddress: email,
        password,
      });
      if (result.status === 'complete') {
        return { error: null };
      }
      return { error: `Sign up status: ${result.status}` };
    } catch (err: any) {
      return { error: err.errors?.[0]?.message || err.message || 'Error signing up' };
    }
  };

  const signInWithGoogle = async (email?: string) => {
    if (!signInLoaded) return { error: 'Clerk is not loaded yet.' };
    try {
      await clerkSignIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/app',
        ...(email ? { loginHint: email } : {}),
      });
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Error signing in with Google' };
    }
  };

  const signOut = async () => {
    await clerkSignOut();
    onSignOut?.();
  };

  return (
    <AuthContext.Provider value={{ user, loading: !isLoaded, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Public provider (auto-selects mode) ──────────────────────────────────────
export function AuthProvider({
  children,
  onSignOut,
}: {
  children: ReactNode;
  onSignOut?: () => void;
}) {
  const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (hasClerk) {
    return (
      <ClerkAuthProvider onSignOut={onSignOut}>
        {children}
      </ClerkAuthProvider>
    );
  }

  return (
    <DemoAuthProvider onSignOut={onSignOut}>
      {children}
    </DemoAuthProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
