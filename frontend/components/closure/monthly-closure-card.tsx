'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Lock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Tipo local para Closure
type Closure = {
  id: string;
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  closedAt: string;
  status: string;
};

interface MonthlyClosureCardProps {
  month: Closure;
  onCloseMonth: (monthId: string) => void;
}

export function MonthlyClosureCard({
  month,
  onCloseMonth,
}: MonthlyClosureCardProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleCloseMonth = () => {
    onCloseMonth(month.id);
    setIsConfirmDialogOpen(false);
    toast({
      title: 'Mês fechado com sucesso',
      description: `${month.month} ${month.year} foi fechado. As transações deste período não podem mais ser editadas.`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                {month.month} {month.year}
                <Badge
                  variant={month.status === 'open' ? 'default' : 'secondary'}
                >
                  {month.status === 'open' ? 'Aberto' : 'Fechado'}
                </Badge>
              </CardTitle>
              <CardDescription>
                {month.status === 'open'
                  ? 'Período atual em andamento'
                  : `Fechado em ${month.closedAt ? new Date(month.closedAt).toLocaleDateString('pt-BR') : 'N/A'}`}
              </CardDescription>
            </div>
            {month.status === 'open' && (
              <Button
                onClick={() => setIsConfirmDialogOpen(true)}
                className='gap-2'
              >
                <Lock className='h-4 w-4' />
                Fechar Mês
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='h-4 w-4 text-emerald-600' />
                <span className='text-sm font-medium'>Receitas</span>
              </div>
              <div className='text-2xl font-bold text-emerald-600'>
                {formatCurrency(month.totalIncome)}
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <TrendingDown className='h-4 w-4 text-red-600' />
                <span className='text-sm font-medium'>Despesas</span>
              </div>
              <div className='text-2xl font-bold text-red-600'>
                {formatCurrency(month.totalExpenses)}
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Saldo Final</span>
              </div>
              <div
                className={`text-2xl font-bold ${month.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {formatCurrency(month.balance)}
              </div>
            </div>
          </div>

          {month.status === 'open' && (
            <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='h-4 w-4 text-amber-600 mt-0.5' />
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-amber-800 dark:text-amber-200'>
                    Atenção: Fechamento do período
                  </p>
                  <p className='text-sm text-amber-700 dark:text-amber-300'>
                    Ao fechar este mês, todas as transações do período ficarão
                    bloqueadas para edição. Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
          )}

          {month.status === 'closed' && (
            <div className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950'>
              <div className='flex items-start gap-2'>
                <Lock className='h-4 w-4 text-slate-600 mt-0.5' />
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-slate-800 dark:text-slate-200'>
                    Período fechado
                  </p>
                  <p className='text-sm text-slate-700 dark:text-slate-300'>
                    As transações deste período estão bloqueadas para edição e
                    exclusão.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar fechamento do mês</DialogTitle>
            <DialogDescription>
              Você está prestes a fechar o período de {month.month} {month.year}
              .
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='h-4 w-4 text-amber-600 mt-0.5' />
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-amber-800 dark:text-amber-200'>
                    Importante: Esta ação não pode ser desfeita
                  </p>
                  <ul className='text-sm text-amber-700 dark:text-amber-300 space-y-1'>
                    <li>• Todas as transações do período ficarão bloqueadas</li>
                    <li>• Não será possível editar ou excluir transações</li>
                    <li>• O saldo final será consolidado</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='grid gap-2 text-sm'>
              <div className='flex justify-between'>
                <span>Receitas totais:</span>
                <span className='font-medium'>
                  {formatCurrency(month.totalIncome)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Despesas totais:</span>
                <span className='font-medium'>
                  {formatCurrency(month.totalExpenses)}
                </span>
              </div>
              <div className='flex justify-between border-t pt-2'>
                <span className='font-medium'>Saldo final:</span>
                <span
                  className={`font-bold ${month.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {formatCurrency(month.balance)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCloseMonth}>Confirmar Fechamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
