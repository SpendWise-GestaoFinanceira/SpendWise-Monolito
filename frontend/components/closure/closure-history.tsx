'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

// Tipo local para Closure
type Closure = {
  id: string;
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  closedAt: string;
};

interface ClosureHistoryProps {
  months: Closure[];
}

export function ClosureHistory({ months }: ClosureHistoryProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Lock className='h-5 w-5' />
          Histórico de Fechamentos
        </CardTitle>
        <CardDescription>Períodos já fechados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {months.length === 0 ? (
            <p className='text-center text-muted-foreground py-4'>
              Nenhum período fechado ainda.
            </p>
          ) : (
            months.map(month => (
              <div
                key={month.id}
                className='space-y-3 pb-4 border-b last:border-b-0'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='font-medium text-sm'>
                      {month.month} {month.year}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Fechado em{' '}
                      {month.closedAt
                        ? new Date(month.closedAt).toLocaleDateString('pt-BR')
                        : 'N/A'}
                    </div>
                  </div>
                  <Badge variant='secondary' className='gap-1'>
                    <Lock className='h-3 w-3' />
                    Fechado
                  </Badge>
                </div>

                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div>
                    <span className='text-muted-foreground'>Receitas:</span>
                    <div className='font-medium text-emerald-600'>
                      {formatCurrency(month.totalIncome)}
                    </div>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Despesas:</span>
                    <div className='font-medium text-red-600'>
                      {formatCurrency(month.totalExpenses)}
                    </div>
                  </div>
                </div>

                <div className='text-xs'>
                  <span className='text-muted-foreground'>Saldo final:</span>
                  <div
                    className={`font-bold ${month.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                  >
                    {formatCurrency(month.balance)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
