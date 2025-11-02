'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
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

interface SidebarProps {
  className?: string;
}

export function DemoSidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { href: '/demo', icon: Home, label: 'Dashboard' },
    { href: '/demo/transacoes', icon: CreditCard, label: 'Transações' },
    { href: '/demo/categorias', icon: Tag, label: 'Categorias' },
    { href: '/demo/orcamento', icon: Wallet, label: 'Orçamento' },
    { href: '/demo/relatorios', icon: BarChart3, label: 'Relatórios' },
    { href: '/demo/fechamento', icon: CheckSquare, label: 'Fechamento' },
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
              <p className='text-xs text-slate-500 dark:text-slate-400'>Demo</p>
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
              <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse'></span>
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
              <div className='w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md'>
                <span className='text-white font-semibold text-sm'>UD</span>
              </div>
              <div className='flex-1 text-left'>
                <p className='text-sm font-medium text-slate-900 dark:text-white'>
                  Usuário Demo
                </p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  demo@exemplo.com
                </p>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-90' : 'group-hover:translate-x-0.5'}`}
              />
            </button>

            {/* Dropdown do Perfil */}
            {showUserMenu && (
              <div className='absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-200'>
                <button
                  onClick={() => (window.location.href = '/demo/perfil')}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200'
                >
                  <User className='w-4 h-4' />
                  Perfil
                </button>
                <button
                  onClick={() => (window.location.href = '/demo/configuracoes')}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200'
                >
                  <Settings className='w-4 h-4' />
                  Configurações
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
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

      {/* Painel de Notificações - Slide da Direita */}
      {showNotifications && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity'
            onClick={() => setShowNotifications(false)}
          />

          {/* Painel */}
          <div className='fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out'>
            <div className='flex flex-col h-full'>
              {/* Header */}
              <div className='p-4 border-b border-slate-200 dark:border-slate-800'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                    Notificações
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors'
                  >
                    <span className='text-slate-500 dark:text-slate-400'>
                      ✕
                    </span>
                  </button>
                </div>
              </div>

              {/* Conteúdo */}
              <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                <div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-orange-500 hover:shadow-md transition-shadow cursor-pointer'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg'>
                      <span className='text-orange-600 dark:text-orange-400 text-lg'>
                        ⚠️
                      </span>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-slate-900 dark:text-white text-sm'>
                        Orçamento atingindo limite
                      </h4>
                      <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                        Alimentação: 85% utilizado
                      </p>
                      <span className='text-xs text-slate-500 dark:text-slate-500 mt-2 block'>
                        Há 2 horas
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-emerald-500 hover:shadow-md transition-shadow cursor-pointer'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg'>
                      <span className='text-emerald-600 dark:text-emerald-400 text-lg'>
                        💰
                      </span>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-slate-900 dark:text-white text-sm'>
                        Nova transação registrada
                      </h4>
                      <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                        Supermercado - R$ 146,60
                      </p>
                      <span className='text-xs text-slate-500 dark:text-slate-500 mt-2 block'>
                        Há 5 horas
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                      <span className='text-blue-600 dark:text-blue-400 text-lg'>
                        📊
                      </span>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-slate-900 dark:text-white text-sm'>
                        Relatório mensal disponível
                      </h4>
                      <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                        Janeiro 2025 pronto para análise
                      </p>
                      <span className='text-xs text-slate-500 dark:text-slate-500 mt-2 block'>
                        Há 1 dia
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className='p-4 border-t border-slate-200 dark:border-slate-800'>
                <button className='w-full py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'>
                  Marcar todas como lidas
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
