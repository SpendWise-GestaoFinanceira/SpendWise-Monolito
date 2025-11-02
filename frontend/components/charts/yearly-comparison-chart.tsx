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

export function YearlyComparisonChart() {
  const { transacoes } = useTransacoes();

  // Calcular despesas dos últimos 2 anos por mês
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
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;
    const result = [];

    // Para cada mês do ano
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthData: any = { month: months[monthIndex] };

      // Ano passado
      const transacoesLastYear = transacoes.filter(t => {
        const dataT = new Date(t.dataTransacao);
        return (
          dataT.getMonth() === monthIndex &&
          dataT.getFullYear() === lastYear &&
          t.tipo === 2
        );
      });
      const despesasLastYear = transacoesLastYear.reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );
      monthData[lastYear.toString()] = Math.round(despesasLastYear);

      // Ano atual
      const transacoesCurrentYear = transacoes.filter(t => {
        const dataT = new Date(t.dataTransacao);
        return (
          dataT.getMonth() === monthIndex &&
          dataT.getFullYear() === currentYear &&
          t.tipo === 2
        );
      });
      const despesasCurrentYear = transacoesCurrentYear.reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );
      monthData[currentYear.toString()] = Math.round(despesasCurrentYear);

      result.push(monthData);
    }

    return result;
  }, [transacoes]);

  // Detectar os anos dinamicamente
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
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
                            {entry.dataKey}
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
          <Bar
            dataKey={lastYear.toString()}
            fill='#64748b'
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey={currentYear.toString()}
            fill='#10b981'
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
