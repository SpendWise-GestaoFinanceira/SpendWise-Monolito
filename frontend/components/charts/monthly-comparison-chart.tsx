'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTransacoes } from '@/hooks/use-transacoes';

export function MonthlyComparisonChart() {
  const { transacoes } = useTransacoes();

  // Calcular receitas e despesas dos últimos 7 meses
  const data = useMemo(() => {
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
    const now = new Date();
    const result = [];

    // Últimos 7 meses
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      const transacoesDoMes = transacoes.filter(t => {
        const dataT = new Date(t.dataTransacao);
        return dataT.getMonth() === monthIndex && dataT.getFullYear() === year;
      });

      const receitas = transacoesDoMes
        .filter(t => t.tipo === 1)
        .reduce(
          (sum, t) =>
            sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
          0
        );

      const despesas = transacoesDoMes
        .filter(t => t.tipo === 2)
        .reduce(
          (sum, t) =>
            sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
          0
        );

      result.push({
        month: months[monthIndex],
        receitas: Math.round(receitas),
        despesas: Math.round(despesas),
      });
    }

    return result;
  }, [transacoes]);
  return (
    <div className='w-full h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#334155' opacity={0.3} />
          <XAxis
            dataKey='month'
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={value => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-lg backdrop-blur-sm'>
                    <div className='grid grid-cols-1 gap-2'>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                          Mês
                        </span>
                        <span className='font-bold text-slate-900 dark:text-slate-100'>
                          {label}
                        </span>
                      </div>
                      {payload.map((entry, index) => (
                        <div key={index} className='flex flex-col'>
                          <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                            {entry.dataKey === 'receitas'
                              ? 'Receitas'
                              : 'Despesas'}
                          </span>
                          <span
                            className='font-bold'
                            style={{ color: entry.color }}
                          >
                            R$ {entry.value?.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey='receitas' fill='#10b981' radius={[2, 2, 0, 0]} />
          <Bar dataKey='despesas' fill='#ef4444' radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
