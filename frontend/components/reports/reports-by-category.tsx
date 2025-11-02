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
  Cell,
  Pie,
  PieChart,
  Legend,
} from 'recharts';

const categoryData = [
  {
    name: 'Mercado',
    amount: 1850,
    percentage: 35.2,
    color: 'hsl(var(--chart-1))',
  },
  {
    name: 'Transporte',
    amount: 980,
    percentage: 18.7,
    color: 'hsl(var(--chart-2))',
  },
  {
    name: 'Lazer',
    amount: 750,
    percentage: 14.3,
    color: 'hsl(var(--chart-3))',
  },
  {
    name: 'Restaurantes',
    amount: 680,
    percentage: 12.9,
    color: 'hsl(var(--chart-4))',
  },
  {
    name: 'Outros',
    amount: 990,
    percentage: 18.9,
    color: 'hsl(var(--chart-5))',
  },
];

const monthlyTrend = [
  {
    month: 'Nov',
    mercado: 1200,
    transporte: 400,
    lazer: 600,
    restaurantes: 500,
    outros: 300,
  },
  {
    month: 'Dez',
    mercado: 1650,
    transporte: 780,
    lazer: 890,
    restaurantes: 720,
    outros: 450,
  },
  {
    month: 'Jan',
    mercado: 1850,
    transporte: 980,
    lazer: 750,
    restaurantes: 680,
    outros: 990,
  },
];

export function ReportsByCategory() {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
          <CardDescription>Janeiro 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey='amount'
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className='rounded-lg border bg-background p-2 shadow-sm'>
                        <div className='grid grid-cols-2 gap-2'>
                          <div className='flex flex-col'>
                            <span className='text-[0.70rem] uppercase text-muted-foreground'>
                              Categoria
                            </span>
                            <span className='font-bold text-muted-foreground'>
                              {data.name}
                            </span>
                          </div>
                          <div className='flex flex-col'>
                            <span className='text-[0.70rem] uppercase text-muted-foreground'>
                              Valor
                            </span>
                            <span className='font-bold'>
                              {formatCurrency(data.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                content={({ payload }) => (
                  <div className='flex flex-wrap justify-center gap-4 mt-4'>
                    {payload?.map((entry, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <div
                          className='h-3 w-3 rounded-full'
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className='text-sm text-muted-foreground'>
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Categorias</CardTitle>
          <CardDescription>Total: {formatCurrency(total)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {categoryData.map((category, index) => (
              <div
                key={category.name}
                className='flex items-center justify-between'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium'>
                    {index + 1}
                  </div>
                  <div>
                    <div className='font-medium'>{category.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {category.percentage}% do total
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-medium'>
                    {formatCurrency(category.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle>Evolução por Categoria</CardTitle>
          <CardDescription>Últimos 3 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={monthlyTrend}>
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
              <Bar dataKey='mercado' stackId='a' fill='hsl(var(--chart-1))' />
              <Bar
                dataKey='transporte'
                stackId='a'
                fill='hsl(var(--chart-2))'
              />
              <Bar dataKey='lazer' stackId='a' fill='hsl(var(--chart-3))' />
              <Bar
                dataKey='restaurantes'
                stackId='a'
                fill='hsl(var(--chart-4))'
              />
              <Bar dataKey='outros' stackId='a' fill='hsl(var(--chart-5))' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
