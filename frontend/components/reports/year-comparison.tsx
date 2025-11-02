'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const yearlyComparison = [
  { month: 'Jan', '2023': 3200, '2024': 2150 },
  { month: 'Fev', '2023': 3450, '2024': 0 },
  { month: 'Mar', '2023': 3100, '2024': 0 },
  { month: 'Abr', '2023': 3650, '2024': 0 },
  { month: 'Mai', '2023': 3800, '2024': 0 },
  { month: 'Jun', '2023': 3200, '2024': 0 },
  { month: 'Jul', '2023': 3450, '2024': 0 },
  { month: 'Ago', '2023': 3100, '2024': 0 },
  { month: 'Set', '2023': 3650, '2024': 0 },
  { month: 'Out', '2023': 3800, '2024': 0 },
  { month: 'Nov', '2023': 3200, '2024': 0 },
  { month: 'Dez', '2023': 4200, '2024': 0 },
];

const yearlyMetrics = [
  {
    metric: 'Total de Despesas',
    '2023': 42400,
    '2024': 2150,
    variacao: -94.9,
  },
  {
    metric: 'Média Mensal',
    '2023': 3533,
    '2024': 2150,
    variacao: -39.2,
  },
  {
    metric: 'Maior Gasto Mensal',
    '2023': 4200,
    '2024': 2150,
    variacao: -48.8,
  },
];

export function YearComparison() {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='grid gap-6 lg:grid-cols-3'>
        {yearlyMetrics.map(item => (
          <Card key={item.metric}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {item.metric}
              </CardTitle>
              {item.variacao > 0 ? (
                <TrendingUp className='h-4 w-4 text-emerald-600' />
              ) : (
                <TrendingDown className='h-4 w-4 text-red-600' />
              )}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(item['2024'])}
              </div>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <span>2023: {formatCurrency(item['2023'])}</span>
                <span
                  className={
                    item.variacao > 0 ? 'text-emerald-600' : 'text-red-600'
                  }
                >
                  {item.variacao > 0 ? '+' : ''}
                  {item.variacao.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparativo Mensal 2023 vs 2024</CardTitle>
          <CardDescription>Despesas por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={400}>
            <BarChart data={yearlyComparison}>
              <XAxis
                dataKey='month'
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
                      <div className='rounded-lg border bg-background p-3 shadow-sm'>
                        <div className='font-medium mb-2'>{label}</div>
                        <div className='space-y-1'>
                          {payload.map((entry, index) => (
                            <div
                              key={index}
                              className='flex items-center justify-between gap-4'
                            >
                              <div className='flex items-center gap-2'>
                                <div
                                  className='h-3 w-3 rounded-full'
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className='text-sm'>{entry.dataKey}</span>
                              </div>
                              <span className='font-medium'>
                                {formatCurrency(entry.value as number)}
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
              <Bar dataKey='2023' fill='hsl(var(--chart-1))' />
              <Bar dataKey='2024' fill='hsl(var(--chart-2))' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
