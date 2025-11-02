import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col'>
          {/* Header Melhorado */}
          <header className='border-b border-slate-200/20 dark:border-slate-700/50 backdrop-blur-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex items-center justify-between h-16'>
                {/* Lado Esquerdo - Botão Voltar + Logo */}
                <div className='flex items-center space-x-4'>
                  <Button
                    variant='ghost'
                    size='sm'
                    asChild
                    className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  >
                    <Link href='/' className='flex items-center space-x-2'>
                      <ArrowLeft className='h-4 w-4' />
                      <span className='hidden sm:inline'>Voltar</span>
                    </Link>
                  </Button>

                  <div className='h-6 w-px bg-slate-300 dark:bg-slate-600' />

                  <Link href='/' className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm'>
                      <BarChart3
                        className='w-6 h-6 text-white'
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className='text-slate-900 dark:text-white text-xl font-bold tracking-wide'>
                      SpendWise
                    </span>
                  </Link>
                </div>

                {/* Lado Direito - Toggle Tema */}
                <div className='flex items-center'>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo Principal */}
          <div className='flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8'>
            <div className='w-full max-w-md'>{children}</div>
          </div>
        </div>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
