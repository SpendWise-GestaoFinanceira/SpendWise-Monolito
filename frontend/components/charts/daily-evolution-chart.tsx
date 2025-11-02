'use client';

import {
  Area,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DailyEvolutionChartProps {
  selectedMonth?: string;
  data?: Array<{ day: string; saldo: number }>;
}

// Gera dados determinísticos a partir do mês selecionado (fallback se não tiver dados reais)
function generateData(month: string | undefined) {
  const base = 4800;
  const seed = (month || 'Setembro 2025')
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const days = Array.from({ length: 20 }, (_, i) => i + 1);
  let saldo = base - (seed % 300); // ponto de partida ligeiramente variável
  return days.map(d => {
    // variação gradual
    const delta = ((seed % 13) - 6) * 10;
    saldo = Math.max(1200, saldo + delta - 90); // tendência leve de queda
    return { day: String(d).padStart(2, '0'), saldo };
  });
}

export function DailyEvolutionChart({
  selectedMonth,
  data: externalData,
}: DailyEvolutionChartProps) {
  const hasRealData = externalData && externalData.length > 0;
  const data = hasRealData ? externalData : [];

  // Se não tiver dados reais, mostra mensagem
  if (!hasRealData) {
    return (
      <div className='flex items-center justify-center h-[300px]'>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          Nenhuma transação registrada. Crie transações para visualizar a
          evolução.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={data}>
        <defs>
          <linearGradient id='greenGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#10b981' stopOpacity={0.3} />
            <stop offset='100%' stopColor='#10b981' stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey='day'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={value => `R$ ${value.toLocaleString('pt-BR')}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className='rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-lg backdrop-blur-sm'>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='flex flex-col'>
                      <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                        Dia
                      </span>
                      <span className='font-bold text-slate-900 dark:text-slate-100'>
                        {label}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                        Saldo
                      </span>
                      <span className='font-bold text-slate-900 dark:text-slate-100'>
                        R$ {payload[0].value?.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type='monotone'
          dataKey='saldo'
          stroke='none'
          fill='url(#greenGradient)'
        />
        <Line
          type='monotone'
          dataKey='saldo'
          strokeWidth={2.5}
          stroke='#10b981' // verde explícito
          dot={{ r: 2, stroke: '#10b981', fill: '#10b981' }}
          activeDot={{ r: 4, stroke: '#10b981', fill: '#10b981' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
