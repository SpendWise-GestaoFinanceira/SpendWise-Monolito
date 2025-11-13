'use client';

import { ReactNode, useState, useEffect } from 'react';
import { NotificationsProvider } from '@/contexts/NotificationsContext';

export default function DemoLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return <NotificationsProvider>{children}</NotificationsProvider>;
}
