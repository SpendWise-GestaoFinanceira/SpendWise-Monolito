'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  DollarSign,
  Edit2,
  Lock,
  CheckCircle,
  AlertCircle,
  Home,
  CreditCard,
  PieChart,
  FileText,
} from 'lucide-react';
import { DemoSidebar } from '@/components/demo-sidebar';
import { DemoBanner } from '@/components/demo-banner';
import { WeeklyBudgetChart } from '@/components/charts/weekly-budget-chart';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

// Dados mocados para demonstração
const mockData = {
  user: {
    nome: 'João Silva',
    email: 'joao.silva@exemplo.com',
    avatar: 'US',
  },
  orcamentoAtual: {
    mes: 'Janeiro 2024',
    status: 'Aberto',
    orcamentoTotal: 3500.0,
    gastoAtual: 2150.0,
    restante: 1350.0,
    percentualUsado: 61.4,
  },
  historicoOrcamentos: [
    {
      mes: 'Janeiro 2024',
      orcamento: 2150.0,
      limite: 3500.0,
      percentual: 46.4,
      status: 'Atual',
      cor: 'green',
    },
    {
      mes: 'Dezembro 2023',
      orcamento: 3450.0,
      limite: 3200.0,
      percentual: 117.5,
      status: 'Excedido',
      cor: 'red',
    },
    {
      mes: 'Novembro 2023',
      orcamento: 2890.0,
      limite: 3200.0,
      percentual: 90.3,
      status: 'Concluído',
      cor: 'orange',
    },
    {
      mes: 'Outubro 2023',
      orcamento: 2750.0,
      limite: 3000.0,
      percentual: 91.7,
      status: 'Concluído',
      cor: 'orange',
    },
  ],
  notificacoes: [
    {
      id: 1,
      tipo: 'alerta',
      titulo: 'Limite da categoria ultrapassado',
      descricao: "Categoria 'Alimentação' ultrapassou 100% do limite mensal",
      tempo: '2 min atrás',
      icon: '⚠️',
    },
    {
      id: 2,
      tipo: 'info',
      titulo: 'Orçamento mensal atingindo limite',
      descricao: 'Você já gastou 85% do seu orçamento mensal',
      tempo: '1 hora atrás',
      icon: 'ℹ️',
    },
  ],
};

export default function OrcamentoPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Janeiro 2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  // Fechar dropdowns quando clicado fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Orçamento Mensal</h1>
              <p className='text-muted-foreground mt-1'>
                Controle seus gastos mensais e acompanhe o progresso
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-muted-foreground'>Mês:</span>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className='h-11 rounded-2xl px-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 w-[180px]'>
                  <SelectValue placeholder={selectedMonth} />
                </SelectTrigger>
                <SelectContent className='bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/30 shadow-xl rounded-xl z-50'>
                  {monthOptions.map(m => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          {/* Current Budget Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Orçamento do Mês
                </h3>
                <DollarSign className='h-5 w-5 text-slate-600 dark:text-slate-400' />
              </div>
              <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                R$ 3.500,00
              </div>
            </div>

            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Gasto até agora
                </h3>
                <TrendingUp className='h-5 w-5 text-red-500' />
              </div>
              <div className='text-2xl font-bold text-red-500'>R$ 2.150,00</div>
            </div>

            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                  Restante
                </h3>
                <CheckCircle className='h-5 w-5 text-emerald-500' />
              </div>
              <div>
                <div className='text-2xl font-bold text-emerald-500'>
                  R$ 1.350,00
                </div>
                <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2'>
                  <div
                    className='bg-emerald-500 h-2 rounded-full'
                    style={{ width: '61.4%' }}
                  />
                </div>
                <div className='mt-2 text-xs text-slate-600 dark:text-slate-400'>
                  61.4% usado
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20'>
            <div className='mb-4'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                Gastos por Semana
              </h3>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Comparação entre planejado e realizado
              </p>
            </div>
            <WeeklyBudgetChart />
          </div>

          {/* Budget History */}
          <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20'>
            <div className='p-6 border-b border-slate-300/40 dark:border-slate-700/20'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                Histórico de Orçamentos
              </h3>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Últimos meses
              </p>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                {mockData.historicoOrcamentos.map((orcamento, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 bg-slate-100/50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-600/40 transition-all duration-200'
                  >
                    <div className='flex items-center space-x-4'>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          orcamento.cor === 'green'
                            ? 'bg-emerald-500'
                            : orcamento.cor === 'orange'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      ></div>
                      <div>
                        <h4 className='font-medium text-slate-900 dark:text-slate-100'>
                          {orcamento.mes}
                        </h4>
                        <p className='text-sm text-slate-600 dark:text-slate-400'>
                          R${' '}
                          {orcamento.orcamento.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}{' '}
                          de R${' '}
                          {orcamento.limite.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className='text-right'>
                      <div className='flex items-center space-x-3'>
                        <span
                          className={`text-sm font-medium ${
                            orcamento.percentual <= 100
                              ? 'text-emerald-400'
                              : orcamento.percentual <= 110
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        >
                          {orcamento.percentual}%
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            orcamento.status === 'Atual'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : orcamento.status === 'Excedido'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-slate-200/50 dark:bg-slate-600/50 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {orcamento.status === 'Atual' && (
                            <CheckCircle className='h-3 w-3 mr-1' />
                          )}
                          {orcamento.status === 'Excedido' && (
                            <AlertCircle className='h-3 w-3 mr-1' />
                          )}
                          {orcamento.status === 'Concluído' && (
                            <Lock className='h-3 w-3 mr-1' />
                          )}
                          {orcamento.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
