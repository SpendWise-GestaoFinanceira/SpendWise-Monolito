'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const weeklyData = [
  {
    week: 'Semana 1',
    period: '01-07 Jan',
    planned: 875,
    actual: 650,
    accumulated: 650,
  },
  {
    week: 'Semana 2',
    period: '08-14 Jan',
    planned: 875,
    actual: 720,
    accumulated: 1370,
  },
  {
    week: 'Semana 3',
    period: '15-21 Jan',
    planned: 875,
    actual: 780,
    accumulated: 2150,
  },
  {
    week: 'Semana 4',
    period: '22-28 Jan',
    planned: 875,
    actual: 0,
    accumulated: 2150,
  },
];

export function WeeklySpendingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Semana</CardTitle>
        <CardDescription>
          Comparação entre planejado e realizado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={weeklyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey='week'
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
                  const data = payload[0].payload;
                  return (
                    <div className='rounded-lg border bg-background p-3 shadow-sm'>
                      <div className='grid gap-2'>
                        <div className='font-medium'>{label}</div>
                        <div className='text-sm text-muted-foreground'>
                          {data.period}
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <div className='text-xs text-muted-foreground'>
                              Planejado
                            </div>
                            <div className='font-medium'>
                              R$ {data.planned.toLocaleString('pt-BR')}
                            </div>
                          </div>
                          <div>
                            <div className='text-xs text-muted-foreground'>
                              Realizado
                            </div>
                            <div className='font-medium'>
                              R$ {data.actual.toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className='border-t pt-2'>
                          <div className='text-xs text-muted-foreground'>
                            Acumulado
                          </div>
                          <div className='font-medium'>
                            R$ {data.accumulated.toLocaleString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey='planned'
              fill='hsl(var(--muted))'
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey='actual'
              fill='hsl(var(--primary))'
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className='flex items-center justify-center gap-6 mt-4'>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-muted' />
            <span className='text-sm text-muted-foreground'>Planejado</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-primary' />
            <span className='text-sm text-muted-foreground'>Realizado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
