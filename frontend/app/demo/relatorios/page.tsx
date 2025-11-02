'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { DemoSidebar } from '@/components/demo-sidebar';
import { DemoBanner } from '@/components/demo-banner';
import { CategoryDonutChart } from '@/components/charts/category-donut-chart';
import { DailyEvolutionChart } from '@/components/charts/daily-evolution-chart';
import { MonthlyComparisonChart } from '@/components/charts/monthly-comparison-chart';
import { YearlyComparisonChart } from '@/components/charts/yearly-comparison-chart';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

// Mock data local para a área de demonstração
const mockData = {
  user: { nome: 'Usuário Demo', email: 'demo@exemplo.com' },
  notificacoes: [
    {
      id: 1,
      tipo: 'info',
      titulo: 'Categoria Lazer > 80%',
      descricao: 'Atenção ao limite',
      tempo: '3 min atrás',
    },
  ],
  categorias: [
    { name: 'Mercado', value: 1850, color: '#10b981' },
    { name: 'Transporte', value: 980, color: '#3b82f6' },
    { name: 'Lazer', value: 750, color: '#8b5cf6' },
    { name: 'Restaurantes', value: 680, color: '#f59e0b' },
    { name: 'Outros', value: 990, color: '#ef4444' },
  ],
  evolucaoMensal: [
    { day: '01', balance: 4500 },
    { day: '05', balance: 4200 },
    { day: '10', balance: 3800 },
    { day: '15', balance: 3500 },
    { day: '20', balance: 3100 },
    { day: '25', balance: 2800 },
    { day: '30', balance: 2350 },
  ],
  comparativoAnual: {
    receitas: { atual: 4500, anterior: 4200, variacao: 7.1 },
    despesas: { atual: 2150, anterior: 2400, variacao: -10.4 },
    saldo: { atual: 2350, anterior: 1800, variacao: 30.6 },
  },
};

export default function RelatoriosPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('Por Categoria');
  const [dateFrom, setDateFrom] = useState('01/2024');
  const [dateTo, setDateTo] = useState('01/2024');

  // Função para formatar data MM/AAAA
  const formatDate = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Limita a 6 dígitos (MMAAAA)
    const limited = numbers.slice(0, 6);

    // Adiciona a barra após os 2 primeiros dígitos
    if (limited.length <= 2) {
      return limited;
    }

    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);
    setDateFrom(formatted);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);
    setDateTo(formatted);
  };

  // Montar componente
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground'>
      <DemoSidebar />

      {/* Main Content */}
      <div className='ml-64'>
        {/* Page Content */}
        <main className='max-w-7xl mx-auto px-8 py-10 space-y-10'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>Relatórios</h1>
              <p className='text-muted-foreground'>
                Análise detalhada dos seus gastos e receitas
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <button className='flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'>
                <Download className='h-4 w-4' />
                <span>Exportar CSV</span>
              </button>
              <button className='flex items-center space-x-2 bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-300/40 dark:border-slate-700/20 rounded-full px-6 py-3 text-slate-900 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-700/70 transition-all duration-200 shadow-lg hover:shadow-xl'>
                <FileText className='h-4 w-4' />
                <span>Exportar PDF</span>
              </button>
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

          {/* Period Filter */}
          <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                  Período:
                </h3>
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <input
                      type='text'
                      value={dateFrom}
                      onChange={handleDateFromChange}
                      className='bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-600/20 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 w-32 text-center font-medium'
                      placeholder='MM/AAAA'
                      maxLength={7}
                    />
                  </div>
                  <span className='text-slate-600 dark:text-slate-400 font-medium px-2'>
                    até
                  </span>
                  <div className='relative'>
                    <input
                      type='text'
                      value={dateTo}
                      onChange={handleDateToChange}
                      className='bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-600/20 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 w-32 text-center font-medium'
                      placeholder='MM/AAAA'
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Tabs */}
          <div className='mb-6'>
            <div className='flex space-x-1 bg-slate-100/70 dark:bg-slate-700/30 backdrop-blur-sm p-1 rounded-xl border border-slate-200/30 dark:border-slate-600/20'>
              {['Por Categoria', 'Por Mês', 'Comparativo Ano a Ano'].map(
                tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-600/30'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Report Content */}
          {activeTab === 'Por Categoria' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
              {/* Chart Area 1 */}
              <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                    Distribuição por Categoria
                  </h3>
                  <PieChart className='h-5 w-5 text-emerald-500' />
                </div>
                <div className='text-slate-600 dark:text-slate-400 text-center'>
                  <p className='mb-4'>Janeiro 2024</p>
                  <CategoryDonutChart data={mockData.categorias} />
                </div>
              </div>

              {/* Ranking */}
              <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                    Ranking de Categorias
                  </h3>
                  <BarChart3 className='h-5 w-5 text-emerald-500' />
                </div>
                <div className='space-y-3'>
                  <p className='text-sm text-slate-600 dark:text-slate-400 mb-3'>
                    Total: R$ 5.250,00
                  </p>
                  {mockData.categorias.map((item, index) => {
                    const total = mockData.categorias.reduce(
                      (sum, cat) => sum + cat.value,
                      0
                    );
                    const percent = ((item.value / total) * 100).toFixed(1);
                    return (
                      <div
                        key={index}
                        className='flex items-center justify-between py-2'
                      >
                        <div className='flex items-center space-x-3'>
                          <span className='text-slate-600 dark:text-slate-400 text-sm font-medium'>
                            {index + 1}
                          </span>
                          <span className='text-slate-900 dark:text-slate-100'>
                            {item.name}
                          </span>
                          <span className='text-sm text-slate-600 dark:text-slate-400'>
                            {percent}% do total
                          </span>
                        </div>
                        <span className='text-slate-900 dark:text-slate-100 font-medium'>
                          R${' '}
                          {item.value.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Por Mês' && (
            <div className='space-y-6'>
              {/* KPI Cards */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Receitas
                    </h4>
                    <TrendingUp className='h-4 w-4 text-emerald-500' />
                  </div>
                  <div className='text-2xl font-bold text-emerald-500'>
                    R$ 4.500,00
                  </div>
                  <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                    vs mês anterior:{' '}
                    <span className='text-emerald-500'>+5.1%</span>
                  </p>
                </div>
                <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Despesas
                    </h4>
                    <TrendingUp className='h-4 w-4 text-red-500 rotate-180' />
                  </div>
                  <div className='text-2xl font-bold text-red-500'>
                    R$ 2.150,00
                  </div>
                  <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                    vs mês anterior: <span className='text-red-500'>+8.2%</span>
                  </p>
                </div>
                <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Saldo
                    </h4>
                    <TrendingUp className='h-4 w-4 text-emerald-500' />
                  </div>
                  <div className='text-2xl font-bold text-emerald-500'>
                    R$ 2.350,00
                  </div>
                  <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                    vs mês anterior:{' '}
                    <span className='text-emerald-500'>+30.6%</span>
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4'>
                    Evolução do Saldo
                  </h3>
                  <p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
                    Últimos 7 meses
                  </p>
                  <DailyEvolutionChart selectedMonth='Janeiro 2024' />
                </div>
                <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4'>
                    Receitas vs Despesas
                  </h3>
                  <p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
                    Últimos 7 meses
                  </p>
                  <MonthlyComparisonChart />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Comparativo Ano a Ano' && (
            <div className='space-y-6'>
              {/* KPI Cards */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Total de Despesas
                    </h4>
                    <TrendingUp className='h-4 w-4 text-red-500 rotate-180' />
                  </div>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                    R$ 2.150,00
                  </div>
                  <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                    2024: R$ 49.400,00{' '}
                    <span className='text-red-500'>+4.1%</span>
                  </p>
                </div>
                <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Média Mensal
                    </h4>
                    <BarChart3 className='h-4 w-4 text-slate-500' />
                  </div>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                    R$ 2.150,00
                  </div>
                  <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                    2023: R$ 3.053,00{' '}
                    <span className='text-red-500'>-8.2%</span>
                  </p>
                </div>
                <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Maior Gasto Mensal
                    </h4>
                    <TrendingUp className='h-4 w-4 text-red-500 rotate-180' />
                  </div>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                    R$ 2.150,00
                  </div>
                  <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                    2023: R$ 4.200,00{' '}
                    <span className='text-emerald-500'>-48.8%</span>
                  </p>
                </div>
              </div>

              {/* Comparative Chart */}
              <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-300/40 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
                <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4'>
                  Comparativo Mensal 2023 vs 2024
                </h3>
                <p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
                  Despesas por mês
                </p>
                <YearlyComparisonChart />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
