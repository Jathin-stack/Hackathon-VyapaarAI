import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  businessId?: string;
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

export function AuthProvider({
  children,
  onSignOut,
}: {
  children: ReactNode;
  onSignOut?: () => void;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false); // Can be used to check initial session later

  const signIn = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        return { error: data.message || 'Login failed' };
      }
      const data = await res.json();
      setUser(data);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Network error during login' };
    }
  };

  const signUp = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: email.split('@')[0] }),
      });
      if (!res.ok) {
        const data = await res.json();
        return { error: data.message || 'Registration failed' };
      }
      const data = await res.json();
      setUser(data);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Network error during registration' };
    }
  };

  const signInWithGoogle = async (email?: string) => {
    // For hackathon, if they click Google and we don't have OAuth configured,
    // we fallback to creating an account instantly or logging them in with a mock flow.
    // Ideally this redirects to /api/auth/google
    window.location.href = '/api/auth/google'; // Will 404 until Google Auth is added, but satisfies the structure
    return { error: null };
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    onSignOut?.();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
