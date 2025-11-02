'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';

const budgetHistory = [
  {
    month: 'Janeiro 2024',
    budget: 3500,
    spent: 2150,
    status: 'current' as const,
  },
  {
    month: 'Dezembro 2023',
    budget: 3200,
    spent: 3450,
    status: 'exceeded' as const,
  },
  {
    month: 'Novembro 2023',
    budget: 3200,
    spent: 2890,
    status: 'completed' as const,
  },
  {
    month: 'Outubro 2023',
    budget: 3000,
    spent: 2750,
    status: 'completed' as const,
  },
];

export function BudgetHistory() {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getProgressPercentage = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getStatusBadge = (status: string, spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;

    switch (status) {
      case 'current':
        return <Badge variant='default'>Atual</Badge>;
      case 'exceeded':
        return <Badge variant='destructive'>Excedido</Badge>;
      case 'completed':
        return percentage > 100 ? (
          <Badge variant='destructive'>Excedido</Badge>
        ) : (
          <Badge variant='secondary'>Concluído</Badge>
        );
      default:
        return null;
    }
  };

  const getTrend = (
    currentSpent: number,
    currentBudget: number,
    previousSpent: number,
    previousBudget: number
  ) => {
    const currentPercentage = (currentSpent / currentBudget) * 100;
    const previousPercentage = (previousSpent / previousBudget) * 100;
    const difference = currentPercentage - previousPercentage;

    if (Math.abs(difference) < 1) return null;

    return difference > 0 ? (
      <div className='flex items-center gap-1 text-red-600'>
        <TrendingUp className='h-3 w-3' />
        <span className='text-xs'>+{difference.toFixed(1)}%</span>
      </div>
    ) : (
      <div className='flex items-center gap-1 text-emerald-600'>
        <TrendingDown className='h-3 w-3' />
        <span className='text-xs'>{difference.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Orçamentos</CardTitle>
        <CardDescription>Últimos meses</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {budgetHistory.map((item, index) => {
          const progressPercentage = getProgressPercentage(
            item.spent,
            item.budget
          );
          const previousItem = budgetHistory[index + 1];

          return (
            <div
              key={item.month}
              className='space-y-3 pb-4 border-b last:border-b-0'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium text-sm'>{item.month}</div>
                  <div className='text-xs text-muted-foreground'>
                    {formatCurrency(item.spent)} de{' '}
                    {formatCurrency(item.budget)}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {previousItem &&
                    getTrend(
                      item.spent,
                      item.budget,
                      previousItem.spent,
                      previousItem.budget
                    )}
                  {getStatusBadge(item.status, item.spent, item.budget)}
                </div>
              </div>

              <div className='space-y-1'>
                <Progress
                  value={progressPercentage}
                  className={`h-2 ${
                    progressPercentage > 100
                      ? '[&>div]:bg-red-500'
                      : progressPercentage > 80
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-primary'
                  }`}
                />
                <div className='flex justify-between text-xs text-muted-foreground'>
                  <span>{progressPercentage.toFixed(0)}% usado</span>
                  <span>
                    {item.budget - item.spent >= 0
                      ? `${formatCurrency(item.budget - item.spent)} restante`
                      : `${formatCurrency(item.spent - item.budget)} acima`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
