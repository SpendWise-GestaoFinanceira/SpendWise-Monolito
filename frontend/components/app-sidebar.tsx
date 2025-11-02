'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { NotificationsPanel } from '@/components/notifications-panel';
import {
  Home,
  CreditCard,
  Tag,
  BarChart3,
  Wallet,
  CheckSquare,
  Bell,
  Moon,
  Sun,
  LogOut,
  Settings,
  ChevronRight,
  User,
} from 'lucide-react';

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className = '' }: AppSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/transacoes', icon: CreditCard, label: 'Transações' },
    { href: '/categorias', icon: Tag, label: 'Categorias' },
    { href: '/orcamento', icon: Wallet, label: 'Orçamento' },
    { href: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    { href: '/fechamento', icon: CheckSquare, label: 'Fechamento' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col z-50 shadow-sm ${className}`}
      >
        {/* TOPO: Logo + Nome */}
        <div className='px-6 py-6 border-b border-slate-200/50 dark:border-slate-800/50'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md'>
              <span className='text-white font-bold text-lg'>S</span>
            </div>
            <div>
              <h1 className='text-lg font-semibold text-slate-900 dark:text-white'>
                SpendWise
              </h1>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Finanças Pessoais
              </p>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO */}
        <nav className='flex-1 px-4 py-6 overflow-y-auto'>
          <div className='space-y-2'>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <div
                  key={item.href}
                  onClick={() => (window.location.href = item.href)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 group ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-emerald-500 rounded-r-full shadow-sm' />
                  )}
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100/80 dark:bg-slate-800/80 group-hover:bg-emerald-500/10 group-hover:text-emerald-500'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                  </div>
                  <span className='text-sm font-medium'>{item.label}</span>
                </div>
              );
            })}
          </div>
        </nav>

        {/* RODAPÉ: Notificações, Tema e Perfil */}
        <div className='px-4 pb-6 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 space-y-3'>
          {/* Notificações e Tema */}
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className='relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-sm'
            >
              <Bell className='w-4 h-4 text-slate-600 dark:text-slate-400' />
              {unreadCount > 0 && (
                <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse'></span>
              )}
            </button>
            <button
              onClick={toggleTheme}
              className='flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-sm'
            >
              {theme === 'dark' ? (
                <Sun className='w-4 h-4 text-slate-600 dark:text-slate-400' />
              ) : (
                <Moon className='w-4 h-4 text-slate-600 dark:text-slate-400' />
              )}
            </button>
          </div>

          {/* Perfil */}
          <div className='relative'>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-sm group'
            >
              <div className='w-9 h-9 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md'>
                <span className='text-white font-semibold text-sm'>
                  {user?.nome
                    ?.split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'US'}
                </span>
              </div>
              <div className='flex-1 text-left min-w-0'>
                <p className='text-sm font-medium text-slate-900 dark:text-white truncate'>
                  {user?.nome
                    ?.split(' ')
                    .slice(0, 2)
                    .join(' ') || 'Usuário'}
                </p>
              </div>
              <ChevronRight
                className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-90' : 'group-hover:translate-x-0.5'}`}
              />
            </button>

            {/* Dropdown do Perfil */}
            {showUserMenu && (
              <div className='absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-200'>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    window.location.href = '/perfil';
                  }}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200'
                >
                  <User className='w-4 h-4' />
                  Perfil
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    window.location.href = '/configuracoes';
                  }}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200'
                >
                  <Settings className='w-4 h-4' />
                  Configurações
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200'
                >
                  <LogOut className='w-4 h-4' />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Painel de Notificações */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
