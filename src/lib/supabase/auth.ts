import type { Session, User } from '@supabase/supabase-js';

import { getSupabaseClient, isSupabaseConfigured } from './client';

export interface AuthResult {
  error: string | null;
}

export async function getSession(): Promise<Session | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { error: 'Supabase is not configured. Add your project keys to .env.' };
  }

  const { error } = await client.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { error: 'Supabase is not configured. Add your project keys to .env.' };
  }

  const { error } = await client.auth.signUp({ email, password });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { error: null };
  }

  const { error } = await client.auth.signOut();
  return { error: error?.message ?? null };
}

export function onAuthStateChange(
  callback: (session: Session | null, user: User | null) => void
): () => void {
  const client = getSupabaseClient();
  if (!client) {
    callback(null, null);
    return () => undefined;
  }

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback(session, session?.user ?? null);
  });

  return () => {
    data.subscription.unsubscribe();
  };
}

export { isSupabaseConfigured };
