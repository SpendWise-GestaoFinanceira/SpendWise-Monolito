import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const recentTransactions = [
  {
    id: 1,
    description: 'Supermercado Extra',
    category: 'Mercado',
    amount: -156.8,
    date: '20/01',
    type: 'expense' as const,
  },
  {
    id: 2,
    description: 'Freelance Design',
    category: null,
    amount: 800.0,
    date: '19/01',
    type: 'income' as const,
  },
  {
    id: 3,
    description: 'Uber',
    category: 'Transporte',
    amount: -25.5,
    date: '18/01',
    type: 'expense' as const,
  },
  {
    id: 4,
    description: 'Netflix',
    category: 'Lazer',
    amount: -29.9,
    date: '15/01',
    type: 'expense' as const,
  },
  {
    id: 5,
    description: 'Salário',
    category: null,
    amount: 4500.0,
    date: '01/01',
    type: 'income' as const,
  },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Últimas 5 transações registradas</CardDescription>
        </div>
        <Button variant='ghost' size='sm' className='gap-2'>
          Ver todas
          <ArrowRight className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {recentTransactions.map(transaction => (
            <div
              key={transaction.id}
              className='flex items-center justify-between'
            >
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium'>
                    {transaction.description}
                  </p>
                  {transaction.type === 'expense' && transaction.category && (
                    <Badge variant='outline' className='text-xs'>
                      {transaction.category}
                    </Badge>
                  )}
                  {transaction.type === 'income' && (
                    <Badge variant='secondary' className='text-xs'>
                      Receita
                    </Badge>
                  )}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {transaction.date}
                </p>
              </div>
              <span
                className={`text-sm font-medium ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {transaction.type === 'income' ? '+' : ''}
                R${' '}
                {Math.abs(transaction.amount).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
