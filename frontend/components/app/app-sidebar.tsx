'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CreditCard,
  PieChart,
  FileText,
  Settings,
  LogOut,
  PlusCircle,
  Clock,
  FileBarChart2,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transações', href: '/transacoes', icon: CreditCard },
  { name: 'Orçamento', href: '/orcamento', icon: PieChart },
  { name: 'Categorias', href: '/categorias', icon: FileText },
  { name: 'Relatórios', href: '/relatorios', icon: FileBarChart2 },
  { name: 'Fechamento', href: '/fechamento', icon: Clock },
];

const bottomNavigation = [
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='hidden lg:flex lg:flex-shrink-0'>
      <div className='flex flex-col w-64 border-r border-border h-screen bg-card'>
        <div className='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto'>
          <div className='flex items-center flex-shrink-0 px-6 mb-8'>
            <h1 className='text-2xl font-bold text-primary'>SpendWise</h1>
          </div>
          <div className='flex-1 flex flex-col'>
            <nav className='flex-1 px-3 space-y-1'>
              {navigation.map(item => {
                const isItemActive = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                      isItemActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isItemActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      aria-hidden='true'
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className='px-3 mt-auto mb-4'>
              <Link
                href='/transacoes/nova'
                className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              >
                <PlusCircle className='mr-2 h-5 w-5' />
                Nova Transação
              </Link>
            </div>

            <nav className='px-3 space-y-1 border-t border-border pt-4'>
              {bottomNavigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      pathname === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    aria-hidden='true'
                  />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className='w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
              >
                <LogOut
                  className='mr-3 h-5 w-5 flex-shrink-0'
                  aria-hidden='true'
                />
                Sair
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
