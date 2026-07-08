import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured, useAuthStore } from '@/lib/supabase';

interface AuthContextValue {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useAuthStore((s) => s.session);
  const loading = useAuthStore((s) => s.loading);
  const initialized = useAuthStore((s) => s.initialized);
  const setSession = useAuthStore((s) => s.setSession);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const isDemoMode = !isSupabaseConfigured;

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
      setInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setLoading, setInitialized]);

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase not configured — using demo mode' };
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase not configured — using demo mode' };
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isDemoMode || !!session,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        loading,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
