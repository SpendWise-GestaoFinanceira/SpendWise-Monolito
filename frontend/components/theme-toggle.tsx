'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className='p-2 hover:bg-accent rounded-lg transition-colors'>
        <Sun className='h-5 w-5 text-muted-foreground hover:text-foreground' />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='p-2 hover:bg-accent rounded-lg transition-colors group'
      title={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      {isDark ? (
        <Sun className='h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors' />
      ) : (
        <Moon className='h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors' />
      )}
      <span className='sr-only'>Alternar tema</span>
    </button>
  );
}
