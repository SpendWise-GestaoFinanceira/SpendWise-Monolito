'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowDownIcon,
  ArrowUpIcon,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { DailyEvolutionChart } from '@/components/charts/daily-evolution-chart';
import { CategoryDonutChart } from '@/components/charts/category-donut-chart';
import { useTransacoes } from '@/hooks/use-transacoes';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getCategoryHexColor } from '@/lib/category-colors';
import { tailwindToHex } from '@/lib/utils/tailwind-to-hex';
import { useAutoNotifications } from '@/hooks/use-auto-notifications';
import { useCategorias } from '@/hooks/use-categorias';

export default function DashboardPage() {
  // Dados reais da API
  const { user } = useAuth();
  const { transacoes: transacoesAPI, isLoading } = useTransacoes();
  const { categorias } = useCategorias();

  // Hook de notificações automáticas
  useAutoNotifications();

  const currentDate = new Date();
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];
  const [selectedMonth, setSelectedMonth] = useState(
    `${months[currentDate.getMonth()]}/${currentDate.getFullYear()}`
  );
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orcamentoTotal, setOrcamentoTotal] = useState(0);

  // Filtrar transações do mês selecionado
  const transacoesDoMes = useMemo(() => {
    if (!selectedMonth) return transacoesAPI;

    const [monthName, year] = selectedMonth.split('/');
    const monthIndex = months.indexOf(monthName);

    return transacoesAPI.filter(t => {
      const dataTransacao = new Date(t.dataTransacao);
      return (
        dataTransacao.getMonth() === monthIndex &&
        dataTransacao.getFullYear() === parseInt(year)
      );
    });
  }, [transacoesAPI, selectedMonth]);

  // Calcular orçamento total das categorias (localmente, sem API)
  useEffect(() => {
    const totalLimite = categorias.reduce((sum, c) => sum + (c.limite || 0), 0);
    console.log('💰 Orçamento Total Calculado (local):', totalLimite);
    setOrcamentoTotal(totalLimite);
  }, [categorias]);

  // Calcular dados reais do dashboard com useMemo para recalcular quando transações mudarem
  const { receitas, despesas, saldoMes, percentualOrcamento } = useMemo(() => {
    const rec = transacoesDoMes
      .filter(t => t.tipo === 1) // 1 = Receita
      .reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );

    const desp = transacoesDoMes
      .filter(t => t.tipo === 2) // 2 = Despesa
      .reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );

    const saldo = rec - desp;
    // Percentual baseado no orçamento total (soma dos limites de todas as categorias)
    const pct =
      orcamentoTotal > 0
        ? Math.min(Math.round((desp / orcamentoTotal) * 100), 100)
        : 0;

    return {
      receitas: rec,
      despesas: desp,
      saldoMes: saldo,
      percentualOrcamento: pct,
    };
  }, [transacoesDoMes, orcamentoTotal]);

  // Transações recentes (últimas 5) com useMemo - do mês selecionado
  const transacoesRecentes = useMemo(
    () =>
      transacoesDoMes.slice(0, 5).map(t => ({
        id: t.id,
        descricao: t.descricao,
        valor: typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0,
        tipo: t.tipo === 1 ? 'receita' : 'despesa',
        categoria: t.categoria?.nome || 'Sem categoria',
        data: new Date(t.dataTransacao).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
      })),
    [transacoesDoMes]
  );

  // Agrupar despesas por categoria para o gráfico - do mês selecionado
  const despesasPorCategoria = transacoesDoMes
    .filter(t => t.tipo === 2) // 2 = Despesa
    .reduce((acc: any, t) => {
      const cat = t.categoria?.nome || 'Outros';
      const valor = typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += valor;
      return acc;
    }, {});

  const totalDespesas = Object.values(despesasPorCategoria).reduce(
    (sum: number, val: any) => sum + val,
    0
  ) as number;

  const categoriasPercentual = Object.entries(despesasPorCategoria).map(
    ([nome, valor]: [string, any]) => ({
      nome,
      percentual:
        totalDespesas > 0
          ? Number(((valor / totalDespesas) * 100).toFixed(1))
          : 0,
    })
  );

  // Preparar dados para gráfico de categorias com useMemo - COM COR DA CATEGORIA
  const categoriasGrafico = useMemo(() => {
    const dados = transacoesDoMes
      .filter(t => t.tipo === 2) // Apenas despesas
      .reduce((acc: any[], t) => {
        const catNome = t.categoria?.nome || 'Outros';
        const catCor = t.categoria?.cor;
        const valor =
          typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;

        // Converter cor Tailwind para HEX
        const corFinal =
          catCor && catCor.startsWith('bg-')
            ? tailwindToHex(catCor) // ✅ CONVERTE bg-pink-500 → #ec4899
            : catCor || getCategoryHexColor(catNome);

        const existente = acc.find(item => item.name === catNome);
        if (existente) {
          existente.value += valor;
        } else {
          acc.push({
            name: catNome,
            value: valor,
            color: corFinal,
          });
        }
        return acc;
      }, []);

    return dados;
  }, [transacoesDoMes]);

  // Calcular evolução diária do saldo - do mês selecionado
  const evolucaoDiaria = transacoesDoMes
    .reduce((acc: any[], t) => {
      const dia = new Date(t.dataTransacao).getDate();
      const diaStr = String(dia).padStart(2, '0');
      const valorNum =
        typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;
      const valor = t.tipo === 1 ? valorNum : -valorNum; // 1 = Receita (positivo)

      const existente = acc.find(item => item.day === diaStr);
      if (existente) {
        existente.saldo += valor;
      } else {
        acc.push({ day: diaStr, saldo: valor });
      }
      return acc;
    }, [])
    .sort((a, b) => parseInt(a.day) - parseInt(b.day));

  // Calcular saldo acumulado
  let saldoAcumulado = 0;
  const evolucaoDiariaAcumulada = evolucaoDiaria.map(item => {
    saldoAcumulado += item.saldo;
    return { day: item.day, saldo: saldoAcumulado };
  });

  // Alertas baseados em dados reais
  const alertas = useMemo(() => {
    const alerts: any[] = [];

    // Calcular dias restantes no mês
    const hoje = new Date();
    const ultimoDiaMes = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0
    ).getDate();
    const diaAtual = hoje.getDate();
    const diasRestantes = ultimoDiaMes - diaAtual;
    const percentualMesDecorrido = Math.round((diaAtual / ultimoDiaMes) * 100);

    // ALERTA CRÍTICO: Orçamento excedido (>100%)
    if (percentualOrcamento >= 100 && orcamentoTotal > 0) {
      alerts.push({
        tipo: 'Erro',
        descricao: `🚨 Orçamento excedido! Você gastou ${percentualOrcamento}% do limite mensal`,
        badge: 'Crítico',
      });
    }
    // ALERTA: Gastos > 80% do orçamento
    else if (percentualOrcamento >= 80 && orcamentoTotal > 0) {
      alerts.push({
        tipo: 'Alerta',
        descricao: `⚠️ Atenção! Gastos em ${percentualOrcamento}% do orçamento (R$ ${despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ ${orcamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
        badge: 'Alerta',
      });
    }
    // INFO: Gastos normais
    else if (percentualOrcamento > 0 && orcamentoTotal > 0) {
      alerts.push({
        tipo: 'Info',
        descricao: `✓ Orçamento em ${percentualOrcamento}% - Você ainda tem R$ ${(orcamentoTotal - despesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} disponíveis`,
        badge: 'Info',
      });
    }

    // ALERTA: Categorias que excederam ou estão perto do limite
    const categoriasComLimite = categorias.filter(
      c => c.limite && c.limite > 0
    );
    categoriasComLimite.forEach(cat => {
      const gastoCategoria = transacoesDoMes
        .filter(t => t.tipo === 2 && t.categoria?.id === cat.id)
        .reduce(
          (sum, t) =>
            sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
          0
        );

      const percentualCategoria = cat.limite
        ? Math.round((gastoCategoria / cat.limite) * 100)
        : 0;

      if (percentualCategoria >= 100) {
        alerts.push({
          tipo: 'Erro',
          descricao: `🚨 ${cat.nome}: limite excedido em ${percentualCategoria}%`,
          badge: 'Crítico',
        });
      } else if (percentualCategoria >= 80) {
        alerts.push({
          tipo: 'Alerta',
          descricao: `⚠️ ${cat.nome}: ${percentualCategoria}% do limite usado (R$ ${gastoCategoria.toFixed(2)} de R$ ${cat.limite?.toFixed(2) || 0})`,
          badge: 'Alerta',
        });
      }
    });

    // ALERTA: Fim do mês se aproximando
    if (diasRestantes <= 5 && diasRestantes > 0 && orcamentoTotal > 0) {
      const mediaGastoDiario = despesas / diaAtual;
      const projecaoFimMes = mediaGastoDiario * ultimoDiaMes;
      const percentualProjetado = Math.round(
        (projecaoFimMes / orcamentoTotal) * 100
      );
      const textoDias = diasRestantes === 1 ? 'dia' : 'dias';

      if (percentualProjetado > 100) {
        alerts.push({
          tipo: 'Alerta',
          descricao: `📅 ${diasRestantes === 1 ? 'Falta apenas' : 'Faltam'} ${diasRestantes} ${textoDias} para o fim do mês. Projeção: ${percentualProjetado}% do orçamento`,
          badge: 'Atenção',
        });
      } else if (diasRestantes <= 3) {
        alerts.push({
          tipo: 'Info',
          descricao: `📅 ${diasRestantes === 1 ? 'Falta apenas' : 'Faltam apenas'} ${diasRestantes} ${textoDias} para o fechamento do mês`,
          badge: 'Info',
        });
      }
    }

    // ALERTA: Gastando mais rápido que o esperado
    if (
      percentualOrcamento > percentualMesDecorrido + 15 &&
      orcamentoTotal > 0 &&
      diaAtual > 5
    ) {
      alerts.push({
        tipo: 'Alerta',
        descricao: `⏱️ Você já gastou ${percentualOrcamento}% do orçamento, mas apenas ${percentualMesDecorrido}% do mês passou`,
        badge: 'Atenção',
      });
    }

    // Se não há orçamento configurado
    if (orcamentoTotal === 0 && despesas > 0) {
      alerts.push({
        tipo: 'Info',
        descricao:
          '💡 Configure seu orçamento mensal para receber alertas personalizados',
        badge: 'Dica',
      });
    }

    // Se não há transações
    if (receitas === 0 && despesas === 0) {
      alerts.push({
        tipo: 'Info',
        descricao:
          '📝 Nenhuma transação registrada neste mês. Comece adicionando suas receitas e despesas!',
        badge: 'Info',
      });
    }

    return alerts;
  }, [
    percentualOrcamento,
    receitas,
    despesas,
    orcamentoTotal,
    categorias,
    transacoesDoMes,
  ]);

  // Gerar últimos 6 meses com formatação melhorada
  const generateMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    const options = [];

    // Gerar últimos 6 meses
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentYear, currentMonth - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      options.push({
        value: `${monthName}/${year}`,
        label: `${monthName}/${year}`,
        month: date.getMonth(),
        year: year,
      });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

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
          Dashboard
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
                  key={option.value}
                  type='button'
                  onClick={() => {
                    setSelectedMonth(option.value);
                    setMonthDropdownOpen(false);
                  }}
                  className='w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center'
                >
                  <Calendar className='w-4 h-4 mr-3 text-slate-500 dark:text-slate-400' />
                  <span className='text-slate-900 dark:text-slate-100'>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
                {i === 2 && <ArrowDownIcon className='h-5 w-5 text-red-500' />}
                {i === 3 && (
                  <TrendingUp className='h-5 w-5 text-muted-foreground' />
                )}
              </div>
              {i === 0 && (
                <div className='text-2xl font-bold text-emerald-500'>
                  R${' '}
                  {saldoMes.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
              {i === 1 && (
                <div className='text-2xl font-bold text-emerald-500'>
                  R${' '}
                  {receitas.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
              {i === 2 && (
                <div className='text-2xl font-bold text-red-500'>
                  R${' '}
                  {despesas.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
              {i === 3 && (
                <div>
                  <div className='text-2xl font-bold'>
                    {percentualOrcamento}%
                  </div>
                  <div className='w-full bg-muted rounded-full h-2 mt-2'>
                    <div
                      className='bg-emerald-500 h-2 rounded-full'
                      style={{ width: `${percentualOrcamento}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
              Evolução Diária
            </h3>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Saldo acumulado ao longo do mês
            </p>
          </div>
          <DailyEvolutionChart
            selectedMonth={selectedMonth}
            data={evolucaoDiariaAcumulada}
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
            data={categoriasGrafico}
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
            {alertas.map((a: any, idx: number) => (
              <li key={idx} className='flex items-center justify-between py-3'>
                <p className='text-sm font-medium'>{a.descricao}</p>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.badge === 'Alerta'
                      ? 'bg-orange-500/15 text-orange-300'
                      : 'bg-blue-500/15 text-blue-300'
                  }`}
                >
                  {a.badge}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                Transações Recentes
              </h3>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Últimas 5 transações registradas
              </p>
            </div>
            <button
              onClick={() => (window.location.href = '/transacoes')}
              className='text-sm text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer'
            >
              Ver todas →
            </button>
          </div>
          <ul className='divide-y divide-slate-200/30 dark:divide-slate-700/20'>
            {isLoading ? (
              <li className='py-8 text-center text-sm text-slate-500'>
                Carregando transações...
              </li>
            ) : transacoesRecentes.length === 0 ? (
              <li className='py-8 text-center text-sm text-slate-500'>
                Nenhuma transação registrada ainda.
              </li>
            ) : (
              transacoesRecentes.map((t: any) => (
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
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
