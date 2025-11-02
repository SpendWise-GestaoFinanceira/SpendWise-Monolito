'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  CheckCircle,
  Target,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { WeeklyBudgetChart } from '@/components/charts/weekly-budget-chart';
import { useCategorias } from '@/hooks/use-categorias';
import { useTransacoes } from '@/hooks/use-transacoes';

export default function OrcamentoPage() {
  const currentDate = new Date();
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
  const initialMonth = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hooks para dados reais
  const { categorias } = useCategorias();
  const { transacoes } = useTransacoes();

  // Calcular dados reais do orçamento filtrados por mês
  const dadosOrcamento = useMemo(() => {
    // Extrair mês e ano do selectedMonth (formato: "Janeiro 2024")
    const [monthName, yearStr] = selectedMonth.split(' ');
    const monthIndex = months.indexOf(monthName);
    const year = parseInt(yearStr);

    // Filtrar transações do mês selecionado
    const transacoesDoMes = transacoes.filter(t => {
      const dataTransacao = new Date(t.dataTransacao);
      return (
        dataTransacao.getMonth() === monthIndex &&
        dataTransacao.getFullYear() === year
      );
    });

    const totalGasto = transacoesDoMes
      .filter(t => t.tipo === 2) // Apenas despesas
      .reduce(
        (sum, t) =>
          sum + ((typeof t.valor === 'number' ? t.valor : t.valor?.valor) || 0),
        0
      );

    const totalLimite = categorias.reduce((sum, c) => sum + (c.limite || 0), 0);

    const restante = totalLimite - totalGasto;
    const percentualUsado =
      totalLimite > 0 ? Math.round((totalGasto / totalLimite) * 100) : 0;

    return {
      orcamentoTotal: totalLimite,
      gastoAtual: totalGasto,
      restante: restante,
      percentualUsado: percentualUsado,
      transacoesDoMes,
    };
  }, [transacoes, categorias, selectedMonth, months]);

  // Gerar últimos 6 meses
  const monthOptions = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const options = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(currentYear, currentMonth - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      options.push(`${monthName} ${year}`);
    }

    return options;
  }, [months]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthDropdownOpen &&
        !(event.target as Element).closest('.month-dropdown-container')
      ) {
        setMonthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [monthDropdownOpen]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className='space-y-10'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
          Orçamento Mensal
        </h1>
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

      {/* Current Budget Cards - EXATO da demo */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Orçamento Total
            </p>
            <Target className='h-5 w-5 text-blue-500' />
          </div>
          <p className='text-3xl font-bold mt-2 text-slate-900 dark:text-slate-100'>
            R${' '}
            {dadosOrcamento.orcamentoTotal.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
            Limite mensal definido
          </p>
        </div>

        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Gasto Atual
            </p>
            <TrendingUp className='h-5 w-5 text-red-500' />
          </div>
          <p className='text-3xl font-bold mt-2 text-slate-900 dark:text-slate-100'>
            R${' '}
            {dadosOrcamento.gastoAtual.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
            {dadosOrcamento.percentualUsado}% do orçamento utilizado
          </p>
        </div>

        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Restante
            </p>
            <DollarSign className='h-5 w-5 text-emerald-500' />
          </div>
          <p
            className={`text-3xl font-bold mt-2 ${dadosOrcamento.restante >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
          >
            R${' '}
            {Math.abs(dadosOrcamento.restante).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
            {dadosOrcamento.restante >= 0
              ? 'Disponível para gastos'
              : 'Limite excedido'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
            Progresso Geral
          </h3>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Uso do orçamento mensal
          </p>
        </div>
        <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4'>
          <div
            className={`h-4 rounded-full transition-all duration-300 ${
              dadosOrcamento.percentualUsado >= 90
                ? 'bg-red-500'
                : dadosOrcamento.percentualUsado >= 75
                  ? 'bg-yellow-500'
                  : 'bg-emerald-500'
            }`}
            style={{
              width: `${Math.min(100, dadosOrcamento.percentualUsado)}%`,
            }}
          />
        </div>
        <p className='text-sm text-slate-600 dark:text-slate-400 mt-2 text-center'>
          {dadosOrcamento.percentualUsado}% utilizado
        </p>
      </div>

      {/* Weekly Chart - EXATO da demo */}
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

      {/* Categories Budget */}
      <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20'>
        <div className='p-6 border-b border-slate-300/40 dark:border-slate-700/20'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
            Orçamento por Categoria
          </h3>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Acompanhe seus gastos por categoria
          </p>
        </div>
        <div className='p-6'>
          {categorias.length === 0 ? (
            <p className='text-center text-slate-500 dark:text-slate-400 py-8'>
              Nenhuma categoria com limite definido
            </p>
          ) : (
            <div className='space-y-4'>
              {categorias
                .filter(c => c.limite && c.limite > 0)
                .map(cat => {
                  // Usar transações do mês selecionado (dadosOrcamento.transacoesDoMes)
                  const gastoCategoria = dadosOrcamento.transacoesDoMes
                    .filter(t => t.categoriaId === cat.id && t.tipo === 2)
                    .reduce(
                      (sum, t) =>
                        sum +
                        ((typeof t.valor === 'number'
                          ? t.valor
                          : t.valor?.valor) || 0),
                      0
                    );

                  const percentual = cat.limite
                    ? Math.round((gastoCategoria / cat.limite) * 100)
                    : 0;

                  return (
                    <div
                      key={cat.id}
                      className='p-4 bg-slate-100/50 dark:bg-slate-700/30 rounded-lg'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <h4 className='font-medium text-slate-900 dark:text-slate-100'>
                          {cat.nome}
                        </h4>
                        <span
                          className={`text-sm font-medium ${
                            percentual >= 90
                              ? 'text-red-500'
                              : percentual >= 75
                                ? 'text-yellow-500'
                                : 'text-emerald-500'
                          }`}
                        >
                          {percentual}%
                        </span>
                      </div>
                      <p className='text-sm text-slate-600 dark:text-slate-400 mb-2'>
                        R${' '}
                        {gastoCategoria.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        de R${' '}
                        {(cat.limite || 0).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <div className='w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full ${
                            percentual >= 90
                              ? 'bg-red-500'
                              : percentual >= 75
                                ? 'bg-yellow-500'
                                : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, percentual)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
