'use client';

import { useEffect, useState } from 'react';
import { Search, Bell, Settings, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
  rightButton?: { label: string; onClick: () => void } | null;
}

export function AppHeader({ rightButton = null }: AppHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

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
    <header className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-8 py-4 relative z-10 border-b border-slate-200/20 dark:border-slate-800/20 shadow-lg overflow-visible'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg'>
            <span className='text-lg font-bold text-white'>S</span>
          </div>
          <div>
            <h1 className='text-xl font-bold text-slate-900 dark:text-slate-100'>
              SpendWise
            </h1>
            <p className='text-xs text-slate-600 dark:text-slate-400'>
              Finanças Pessoais
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          {rightButton && (
            <button
              onClick={rightButton.onClick}
              className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              {rightButton.label}
            </button>
          )}

          <div className='relative' data-dropdown='notifications'>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className='relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200'
            >
              <Bell className='h-6 w-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors' />
              <span className='absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg'>
                2
              </span>
            </button>
            {showNotifications && (
              <div className='absolute right-0 top-12 w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/30 rounded-2xl shadow-2xl z-50 overflow-hidden'>
                <div className='p-4 border-b border-slate-200/30 dark:border-slate-700/20'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-slate-900 dark:text-slate-100'>
                      Notificações
                    </h3>
                    <button className='text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'>
                      Marcar todas como lidas
                    </button>
                  </div>
                </div>
                <div className='max-h-96 overflow-y-auto'>
                  {[1, 2].map(id => (
                    <div
                      key={id}
                      className='p-4 border-b border-slate-200/30 dark:border-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
                    >
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-slate-900 dark:text-slate-100'>
                          Notificação {id}
                        </span>
                        <span className='text-slate-600 dark:text-slate-400'>
                          agora
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='p-4 border-t border-slate-200/30 dark:border-slate-700/20 text-center text-emerald-500 hover:text-emerald-600 cursor-pointer transition-colors'>
                  Ver todas as notificações
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          <div className='relative' data-dropdown='user'>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className='flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200'
            >
              <div className='w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg'>
                US
              </div>
            </button>
            {showUserMenu && (
              <div className='absolute right-0 top-12 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/30 rounded-2xl shadow-2xl z-50 p-4 overflow-hidden'>
                <div className='flex items-center space-x-3 mb-3'>
                  <div className='w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium'>
                    US
                  </div>
                  <div>
                    <h3 className='font-medium text-slate-900 dark:text-slate-100'>
                      Usuário Demo
                    </h3>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      demo@exemplo.com
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => (window.location.href = '/perfil')}
                  className='w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-900 dark:text-slate-100'
                >
                  <User className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                  <span>Perfil</span>
                </button>
                <button
                  onClick={() => (window.location.href = '/configuracoes')}
                  className='w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-900 dark:text-slate-100'
                >
                  <Settings className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                  <span>Configurações</span>
                </button>
                <hr className='my-2 border-slate-200/30 dark:border-slate-700/20' />
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-red-500 hover:text-red-600'
                >
                  <LogOut className='h-4 w-4' />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
