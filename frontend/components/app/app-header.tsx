'use client';

import { useEffect, useState } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface AppHeaderProps {
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
  selectedMonth: string;
  onSelectedMonthChange: (v: string) => void;
  monthOptions?: string[];
  rightButton?: { label: string; onClick: () => void } | null;
}

export function AppHeader({
  searchPlaceholder = 'Buscar...',
  searchTerm,
  onSearchTermChange,
  selectedMonth,
  onSelectedMonthChange,
  monthOptions = ['Setembro 2025', 'Agosto 2025', 'Julho 2025'],
  rightButton = null,
}: AppHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Element;
      if (!t.closest('[data-dropdown="notifications"]'))
        setShowNotifications(false);
      if (!t.closest('[data-dropdown="user"]')) setShowUserMenu(false);
    };
    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showNotifications, showUserMenu]);

  return (
    <header className='bg-card dark:bg-[#232a38] px-8 py-6 relative z-10 rounded-b-3xl shadow-xl overflow-visible'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <input
              type='text'
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={e => onSearchTermChange(e.target.value)}
              className='pl-10 pr-4 py-2 bg-background border border-input rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <Select value={selectedMonth} onValueChange={onSelectedMonthChange}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Selecione o mês' />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(month => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className='p-2 rounded-full hover:bg-accent relative'
            aria-label='Notificações'
            data-dropdown='notifications'
          >
            <Bell className='h-5 w-5' />
            <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500'></span>
          </button>

          <div className='relative' data-dropdown='user'>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className='flex items-center space-x-2 p-1.5 rounded-full hover:bg-accent'
              aria-label='Menu do usuário'
            >
              <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground'>
                JS
              </div>
            </button>

            {showUserMenu && (
              <div className='absolute right-0 mt-2 w-56 bg-card rounded-2xl shadow-2xl overflow-hidden border border-border dark:border-white/10'>
                <div className='p-4 border-b border-border/50'>
                  <p className='font-medium'>João Silva</p>
                  <p className='text-sm text-muted-foreground truncate'>
                    joao.silva@exemplo.com
                  </p>
                </div>
                <div className='p-2'>
                  <button className='w-full flex items-center px-4 py-2 text-sm rounded-lg hover:bg-accent text-left'>
                    <Settings className='mr-2 h-4 w-4' />
                    Configurações
                  </button>
                  <button className='w-full flex items-center px-4 py-2 text-sm rounded-lg hover:bg-accent text-left text-red-500'>
                    <LogOut className='mr-2 h-4 w-4' />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {rightButton && (
            <button
              onClick={rightButton.onClick}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
            >
              {rightButton.label}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
