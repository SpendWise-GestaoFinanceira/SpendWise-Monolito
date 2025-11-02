'use client';

import { ReactNode, useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';

function AppContent({ children }: { children: ReactNode }) {
  useRealTimeNotifications();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground'>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className='ml-64'>
        {/* Content */}
        <main className='max-w-7xl mx-auto px-8 py-8'>{children}</main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <ProtectedRoute>
      <NotificationsProvider>
        <AppContent>{children}</AppContent>
      </NotificationsProvider>
    </ProtectedRoute>
  );
}
