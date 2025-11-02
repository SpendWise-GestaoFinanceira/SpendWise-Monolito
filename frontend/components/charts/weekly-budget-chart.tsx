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
  Legend,
} from 'recharts';
import { useTransacoes } from '@/hooks/use-transacoes';
import { useCategorias } from '@/hooks/use-categorias';

export function WeeklyBudgetChart() {
  const { transacoes } = useTransacoes();
  const { categorias } = useCategorias();

  // Calcular gastos reais por semana do mês atual
  const data = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Total de limites (planejado mensal)
    const totalLimite = categorias.reduce((sum, c) => sum + (c.limite || 0), 0);
    const planejadoPorSemana = totalLimite / 4;

    // Agrupar transações do mês atual por semana
    const semanas = [
      { semana: 'Semana 1', planejado: planejadoPorSemana, realizado: 0 },
      { semana: 'Semana 2', planejado: planejadoPorSemana, realizado: 0 },
      { semana: 'Semana 3', planejado: planejadoPorSemana, realizado: 0 },
      { semana: 'Semana 4', planejado: planejadoPorSemana, realizado: 0 },
    ];

    transacoes
      .filter(t => t.tipo === 2) // Apenas despesas
      .forEach(t => {
        const data = new Date(t.dataTransacao);
        if (data.getFullYear() === year && data.getMonth() === month) {
          const dia = data.getDate();
          const semanaIndex = Math.min(3, Math.floor((dia - 1) / 7));
          const valor =
            typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;
          semanas[semanaIndex].realizado += valor;
        }
      });

    return semanas;
  }, [transacoes, categorias]);
  return (
    <div className='w-full h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#334155' opacity={0.3} />
          <XAxis
            dataKey='semana'
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={value => `R$ ${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-lg backdrop-blur-sm'>
                    <div className='grid grid-cols-1 gap-2'>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                          Período
                        </span>
                        <span className='font-bold text-slate-900 dark:text-slate-100'>
                          {label}
                        </span>
                      </div>
                      {payload.map((entry, index) => (
                        <div key={index} className='flex flex-col'>
                          <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                            {entry.dataKey === 'planejado'
                              ? 'Planejado'
                              : 'Realizado'}
                          </span>
                          <span
                            className='font-bold'
                            style={{ color: entry.color }}
                          >
                            R$ {entry.value?.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                      {payload.length === 2 && (
                        <div className='flex flex-col pt-1 border-t border-slate-200 dark:border-slate-700'>
                          <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                            Diferença
                          </span>
                          <span
                            className={`font-bold ${
                              (payload[1].value || 0) > (payload[0].value || 0)
                                ? 'text-red-500'
                                : 'text-emerald-500'
                            }`}
                          >
                            {(payload[1].value || 0) > (payload[0].value || 0)
                              ? '+'
                              : ''}
                            R${' '}
                            {(
                              Number(payload[1].value || 0) -
                              Number(payload[0].value || 0)
                            ).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType='circle' />
          <Bar
            dataKey='planejado'
            fill='#64748b'
            radius={[2, 2, 0, 0]}
            name='Planejado'
          />
          <Bar
            dataKey='realizado'
            fill='#10b981'
            radius={[2, 2, 0, 0]}
            name='Realizado'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
