import type { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  isSupabaseConfigured,
  onAuthStateChange,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from '@/src/lib/supabase/auth';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOutUser: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChange((nextSession, nextUser) => {
      setSession(nextSession);
      setUser(nextUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    return result.error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const result = await signUpWithEmail(email, password);
    return result.error;
  }, []);

  const signOutUser = useCallback(async () => {
    const result = await signOut();
    return result.error;
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      isLoading,
      isConfigured: isSupabaseConfigured,
      signIn,
      signUp,
      signOutUser,
    }),
    [session, user, isLoading, signIn, signUp, signOutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
