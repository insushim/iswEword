'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { StudentProvider } from '@/contexts/StudentContext';
import ProfileSelector from './ProfileSelector';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <StudentProvider>
        <ProfileSelector />
        {children}
      </StudentProvider>
    </ThemeProvider>
  );
}
