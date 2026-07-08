import type { SQLiteDatabase } from 'expo-sqlite';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { openDatabase } from '@/src/lib/db/client';

interface DatabaseContextValue {
  db: SQLiteDatabase | null;
  isReady: boolean;
  error: string | null;
  retry: () => void;
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setIsReady(false);
      setError(null);

      try {
        const database = await openDatabase();
        if (!cancelled) {
          setDb(database);
          setIsReady(true);
        }
      } catch (initError) {
        if (!cancelled) {
          const message =
            initError instanceof Error ? initError.message : 'Failed to open local database.';
          setError(message);
          setDb(null);
          setIsReady(false);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  const value = useMemo(
    () => ({
      db,
      isReady,
      error,
      retry,
    }),
    [db, isReady, error, retry]
  );

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase(): DatabaseContextValue {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
}
