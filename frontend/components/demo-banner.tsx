'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface DemoBannerProps {
  title?: string;
  subtitle?: string;
  className?: string;
  backHref?: string; // default "/"
  ctaHref?: string; // default "/register"
  ctaLabel?: string; // default "Começar Agora"
}

export function DemoBanner({
  title = 'Demonstração do SpendWise',
  subtitle = 'Explore todas as funcionalidades com dados de exemplo',
  className = '',
  backHref = '/',
  ctaHref = '/register',
  ctaLabel = 'Começar Agora',
}: DemoBannerProps) {
  return (
    <section className={`max-w-7xl mx-auto mt-8 px-8 ${className}`}>
      <div className='rounded-2xl border border-emerald-200/30 dark:border-emerald-700/20 bg-emerald-50/70 dark:bg-emerald-900/20 backdrop-blur-sm p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link
            href={backHref}
            className='inline-flex items-center gap-2 rounded-full bg-emerald-100/70 dark:bg-emerald-800/30 backdrop-blur-sm text-emerald-800 dark:text-emerald-200 px-4 py-2 hover:bg-emerald-200/70 dark:hover:bg-emerald-700/40 transition-all duration-200 border border-emerald-200/50 dark:border-emerald-700/30 shadow-sm hover:shadow-md'
            aria-label='Voltar'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Voltar</span>
          </Link>
          <div className='space-y-1'>
            <span className='block text-lg font-semibold text-emerald-700 dark:text-emerald-300'>
              {title}
            </span>
            <span className='block text-sm text-emerald-900/80 dark:text-emerald-200/70'>
              {subtitle}
            </span>
          </div>
        </div>
        <Link
          href={ctaHref}
          className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
