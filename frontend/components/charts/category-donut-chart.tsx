'use client';

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { getCategoryHexColor } from '@/lib/category-colors';

interface CategoryDonutChartProps {
  selectedMonth?: string;
  data?: Array<{ name: string; value: number; color: string }>;
}

// Paleta usando o sistema centralizado de cores
const palette = [
  { name: 'Alimentação', color: getCategoryHexColor('Alimentação') },
  { name: 'Transporte', color: getCategoryHexColor('Transporte') },
  { name: 'Entretenimento', color: getCategoryHexColor('Entretenimento') },
  { name: 'Educação', color: getCategoryHexColor('Educação') },
  { name: 'Outros', color: getCategoryHexColor('Outros') },
];

function generateData(month: string | undefined) {
  // usa uma seed do mês para variar os pesos de forma determinística
  const seed = (month || 'Setembro 2025')
    .split('')
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = [650, 380, 520, 420, 180];
  // aplica pequenas variações por categoria
  const values = base.map((v, idx) =>
    Math.max(120, v + ((seed % (idx + 5)) - 2) * 25)
  );
  return palette.map((p, i) => ({
    name: p.name,
    value: values[i],
    color: p.color,
  }));
}

export function CategoryDonutChart({
  selectedMonth,
  data: externalData,
}: CategoryDonutChartProps) {
  const hasRealData = externalData && externalData.length > 0;
  const data = hasRealData ? externalData : [];

  // Se não tiver dados reais, mostra mensagem
  if (!hasRealData) {
    return (
      <div className='flex items-center justify-center h-[300px]'>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          Nenhuma despesa registrada. Crie transações de despesa para visualizar
          a distribuição.
        </p>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center'>
      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey='value'
            stroke='#0f172a'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className='rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-lg backdrop-blur-sm'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                          Categoria
                        </span>
                        <span className='font-bold text-slate-900 dark:text-slate-100'>
                          {data.name}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] uppercase text-slate-500 dark:text-slate-400 font-medium'>
                          Valor
                        </span>
                        <span className='font-bold text-slate-900 dark:text-slate-100'>
                          R$ {data.value.toLocaleString('pt-BR')}
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
            content={() => (
              <div className='flex flex-wrap justify-center gap-4 mt-4'>
                {data.map((entry, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <div
                      className='h-3 w-3 rounded-full'
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className='text-sm text-muted-foreground'>
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
