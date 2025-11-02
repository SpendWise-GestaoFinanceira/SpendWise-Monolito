'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowDownIcon,
  ArrowUpIcon,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { DemoBanner } from '@/components/demo-banner';
import { DemoSidebar } from '@/components/demo-sidebar';
import { DailyEvolutionChart } from '@/components/charts/daily-evolution-chart';
import { CategoryDonutChart } from '@/components/charts/category-donut-chart';

// Mock data
const mockData = {
  user: { nome: 'João Silva', email: 'joao.silva@exemplo.com' },
  dashboard: {
    saldoMes: 2350.0,
    receitas: 4500.0,
    despesas: 2150.0,
    percentualOrcamento: 61,
  },
  transacoes: [
    {
      id: 1,
      descricao: 'Supermercado Extra',
      valor: 156.8,
      tipo: 'despesa',
      categoria: 'Mercado',
      data: '20/01',
    },
    {
      id: 2,
      descricao: 'Freelance Design',
      valor: 800.0,
      tipo: 'receita',
      categoria: 'Receita',
      data: '19/01',
    },
    {
      id: 3,
      descricao: 'Uber',
      valor: 25.5,
      tipo: 'despesa',
      categoria: 'Transporte',
      data: '18/01',
    },
    {
      id: 4,
      descricao: 'Netflix',
      valor: 29.9,
      tipo: 'despesa',
      categoria: 'Lazer',
      data: '15/01',
    },
    {
      id: 5,
      descricao: 'Salário',
      valor: 4500.0,
      tipo: 'receita',
      categoria: 'Receita',
      data: '01/01',
    },
  ],
  categorias: [
    { nome: 'Alimentação', percentual: 30.2 },
    { nome: 'Transporte', percentual: 24.2 },
    { nome: 'Lazer', percentual: 17.7 },
    { nome: 'Casa', percentual: 15.8 },
    { nome: 'Outros', percentual: 12.1 },
  ],
  alertas: [
    { tipo: 'Info', descricao: 'Orçamento mensal em 61%', badge: 'Info' },
  ],
  // Dados para gráficos
  dailyEvolution: [
    { day: '01', saldo: 4500 },
    { day: '05', saldo: 4350 },
    { day: '10', saldo: 3980 },
    { day: '15', saldo: 3520 },
    { day: '20', saldo: 2850 },
    { day: '25', saldo: 2350 },
    { day: '30', saldo: 2350 },
  ],
  categoryDistribution: [
    { name: 'Alimentação', value: 650, color: '#f59e0b' },
    { name: 'Transporte', value: 520, color: '#3b82f6' },
    { name: 'Entretenimento', value: 380, color: '#8b5cf6' },
    { name: 'Educação', value: 420, color: '#10b981' },
    { name: 'Outros', value: 180, color: '#6b7280' },
  ],
};

export default function DemoPage() {
  const [selectedMonth, setSelectedMonth] = useState('Janeiro 2025');
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Gerar últimos 6 meses
  const generateMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const options = [];

    // Gerar últimos 6 meses
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentYear, currentMonth - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      options.push(`${monthName} ${year}`);
    }

    return options;
  };

  const monthOptions = generateMonthOptions();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Element;
      if (!t.closest('[data-dropdown="notifications"]'))
        setShowNotifications(false);
      if (!t.closest('[data-dropdown="user"]')) setShowUserMenu(false);
      if (!t.closest('.month-dropdown-container')) setMonthDropdownOpen(false);
    };
    if (showNotifications || showUserMenu || monthDropdownOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showNotifications, showUserMenu, monthDropdownOpen]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground'>
      {/* Sidebar */}
      <DemoSidebar />

      {/* Main */}
      <div className='ml-64'>
        {/* Content */}
        <main className='max-w-7xl mx-auto px-8 py-8 space-y-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Dashboard</h1>
              <p className='text-muted-foreground mt-1'>
                Visão geral das suas finanças
              </p>
            </div>
            <div className='month-dropdown-container relative'>
              <button
                type='button'
                onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                className='px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between min-w-[180px]'
              >
                <span className='flex items-center'>
                  <Calendar className='w-4 h-4 mr-3 text-slate-500 dark:text-slate-400' />
                  {selectedMonth}
                </span>
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform duration-200 ${monthDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {monthDropdownOpen && (
                <div className='absolute top-full right-0 mt-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/30 rounded-2xl shadow-xl z-[9999] overflow-hidden max-h-60 overflow-y-auto min-w-[180px]'>
                  {monthOptions.map(option => (
                    <button
                      key={option}
                      type='button'
                      onClick={() => {
                        setSelectedMonth(option);
                        setMonthDropdownOpen(false);
                      }}
                      className='w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center'
                    >
                      <Calendar className='w-4 h-4 mr-3 text-slate-500 dark:text-slate-400' />
                      <span className='text-slate-900 dark:text-slate-100'>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Banner Comece Agora */}
          <DemoBanner
            title='Modo Demonstração'
            subtitle='Crie sua conta gratuita para gerenciar suas finanças de verdade'
            backHref='/'
            ctaHref='/register'
            ctaLabel='Começar Agora'
            className='!mt-6'
          />

          {/* KPIs */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {['Saldo do Mês', 'Receitas', 'Despesas', '% Orçamento Usado'].map(
              (title, i) => (
                <div
                  key={i}
                  className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'
                >
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      {title}
                    </h3>
                    {i === 0 && (
                      <DollarSign className='h-5 w-5 text-muted-foreground' />
                    )}
                    {i === 1 && (
                      <ArrowUpIcon className='h-5 w-5 text-emerald-500' />
                    )}
                    {i === 2 && (
                      <ArrowDownIcon className='h-5 w-5 text-red-500' />
                    )}
                    {i === 3 && (
                      <TrendingUp className='h-5 w-5 text-muted-foreground' />
                    )}
                  </div>
                  {i === 0 && (
                    <div className='text-2xl font-bold text-emerald-500'>
                      R${' '}
                      {mockData.dashboard.saldoMes.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  )}
                  {i === 1 && (
                    <div className='text-2xl font-bold text-emerald-500'>
                      R${' '}
                      {mockData.dashboard.receitas.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  )}
                  {i === 2 && (
                    <div className='text-2xl font-bold text-red-500'>
                      R${' '}
                      {mockData.dashboard.despesas.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  )}
                  {i === 3 && (
                    <div>
                      <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                        {mockData.dashboard.percentualOrcamento}%
                      </div>
                      <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2'>
                        <div
                          className='bg-emerald-500 h-2 rounded-full'
                          style={{
                            width: `${mockData.dashboard.percentualOrcamento}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Gráficos */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
              <div className='mb-4'>
                <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                  Evolução Diária
                </h3>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  Saldo acumulado no mês
                </p>
              </div>
              <DailyEvolutionChart
                selectedMonth={selectedMonth}
                data={mockData.dailyEvolution}
              />
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
              <div className='mb-4'>
                <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                  Gastos por Categoria
                </h3>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  Top 5 categorias do mês
                </p>
              </div>
              <CategoryDonutChart
                selectedMonth={selectedMonth}
                data={mockData.categoryDistribution}
              />
            </div>
          </div>

          {/* Alertas e Transações */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                  ⚠️ Alertas
                </h3>
              </div>
              <ul className='divide-y divide-slate-200/30 dark:divide-slate-700/20'>
                {mockData.alertas.map((a, idx) => (
                  <li key={idx} className='py-3'>
                    <p className='text-sm text-slate-900 dark:text-slate-100'>
                      {a.descricao}
                    </p>
                    <span className='inline-block mt-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full'>
                      {a.badge}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                  💰 Últimas Transações
                </h3>
              </div>
              <ul className='divide-y divide-slate-200/30 dark:divide-slate-700/20'>
                {mockData.transacoes.map(t => (
                  <li
                    key={t.id}
                    className='flex items-center justify-between py-3'
                  >
                    <div>
                      <p className='text-sm font-medium'>{t.descricao}</p>
                      <p className='text-xs text-muted-foreground'>
                        {t.categoria} • {t.data}
                      </p>
                    </div>
                    <div
                      className={`text-sm font-semibold ${t.tipo === 'receita' ? 'text-emerald-500' : 'text-red-500'}`}
                    >
                      {t.tipo === 'receita' ? '+' : '-'}R${' '}
                      {t.valor.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
