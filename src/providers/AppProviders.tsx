import type { ReactNode } from 'react';

import { AuthProvider } from '@/src/providers/AuthProvider';
import { DatabaseProvider } from '@/src/providers/DatabaseProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DatabaseProvider>
      <AuthProvider>{children}</AuthProvider>
    </DatabaseProvider>
  );
}
