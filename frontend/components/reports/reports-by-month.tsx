'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';

const monthlyData = [
  { month: 'Jul', receitas: 4500, despesas: 3200, saldo: 1300 },
  { month: 'Ago', receitas: 4500, despesas: 3450, saldo: 1050 },
  { month: 'Set', receitas: 4800, despesas: 3100, saldo: 1700 },
  { month: 'Out', receitas: 4500, despesas: 3650, saldo: 850 },
  { month: 'Nov', receitas: 4500, despesas: 3800, saldo: 700 },
  { month: 'Dez', receitas: 5200, despesas: 4200, saldo: 1000 },
  { month: 'Jan', receitas: 4500, despesas: 2150, saldo: 2350 },
];

const monthlyComparison = [
  { metric: 'Receitas', atual: 4500, anterior: 5200, variacao: -13.5 },
  { metric: 'Despesas', atual: 2150, anterior: 4200, variacao: -48.8 },
  { metric: 'Saldo', atual: 2350, anterior: 1000, variacao: 135.0 },
];

export function ReportsByMonth() {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='grid gap-6 lg:grid-cols-3'>
        {monthlyComparison.map(item => (
          <Card key={item.metric}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {item.metric}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(item.atual)}
              </div>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <span>vs mês anterior:</span>
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

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Saldo</CardTitle>
            <CardDescription>Últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={monthlyData}>
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
                        <div className='rounded-lg border bg-background p-2 shadow-sm'>
                          <div className='grid grid-cols-2 gap-2'>
                            <div className='flex flex-col'>
                              <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                Mês
                              </span>
                              <span className='font-bold text-muted-foreground'>
                                {label}
                              </span>
                            </div>
                            <div className='flex flex-col'>
                              <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                Saldo
                              </span>
                              <span className='font-bold'>
                                {formatCurrency(payload[0].value as number)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='saldo'
                  strokeWidth={2}
                  stroke='hsl(var(--primary))'
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={monthlyData}>
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
                                  <span className='text-sm capitalize'>
                                    {entry.dataKey}
                                  </span>
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
                <Bar dataKey='receitas' fill='hsl(var(--chart-1))' />
                <Bar dataKey='despesas' fill='hsl(var(--chart-2))' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
