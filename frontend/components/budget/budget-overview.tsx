'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BudgetOverview() {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetValue, setBudgetValue] = useState('3500');
  const [tempBudgetValue, setTempBudgetValue] = useState('3500');
  const { toast } = useToast();

  // Dados mockados
  const currentSpent = 2150;
  const budget = Number.parseFloat(
    budgetValue.replace(/[^\d,]/g, '').replace(',', '.')
  );
  const remaining = budget - currentSpent;
  const progressPercentage = Math.min((currentSpent / budget) * 100, 100);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const formattedValue = (Number.parseInt(numericValue) / 100).toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      }
    );
    return formattedValue;
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempBudgetValue(formatCurrencyInput(value));
  };

  const handleSave = () => {
    const numericValue = Number.parseFloat(
      tempBudgetValue.replace(/[^\d,]/g, '').replace(',', '.')
    );

    if (!numericValue || numericValue <= 0) {
      toast({
        title: 'Erro de validação',
        description: 'O valor do orçamento deve ser maior que zero.',
        variant: 'destructive',
      });
      return;
    }

    setBudgetValue(tempBudgetValue);
    setIsEditing(false);
    toast({
      title: 'Orçamento atualizado',
      description: 'O orçamento mensal foi salvo com sucesso.',
    });
  };

  const handleCancel = () => {
    setTempBudgetValue(budgetValue);
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    if (progressPercentage > 100) {
      return (
        <Badge variant='destructive' className='gap-1'>
          <AlertTriangle className='h-3 w-3' />
          Orçamento Excedido
        </Badge>
      );
    }
    if (progressPercentage > 80) {
      return (
        <Badge
          variant='secondary'
          className='gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
        >
          <AlertTriangle className='h-3 w-3' />
          Atenção
        </Badge>
      );
    }
    return (
      <Badge variant='default' className='gap-1'>
        <CheckCircle className='h-3 w-3' />
        No Controle
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Orçamento de Janeiro 2024</CardTitle>
            <CardDescription>Controle seus gastos mensais</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='budget'>Orçamento do Mês</Label>
            {!isEditing ? (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditing(true)}
                className='gap-2'
              >
                <Edit className='h-4 w-4' />
                Editar
              </Button>
            ) : (
              <div className='flex gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleCancel}
                  className='gap-2'
                >
                  <X className='h-4 w-4' />
                  Cancelar
                </Button>
                <Button size='sm' onClick={handleSave} className='gap-2'>
                  <Save className='h-4 w-4' />
                  Salvar
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <Input
              id='budget'
              value={tempBudgetValue}
              onChange={handleBudgetChange}
              placeholder='R$ 0,00'
              className='text-2xl font-bold'
            />
          ) : (
            <div className='text-2xl font-bold text-primary'>
              {formatCurrency(budget)}
            </div>
          )}
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Gasto até agora</span>
              <span className='font-medium text-red-600'>
                {formatCurrency(currentSpent)}
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>
                {remaining >= 0 ? 'Restante' : 'Excedido'}
              </span>
              <span
                className={`font-medium ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Progresso</span>
            <span className='font-medium'>
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className={`h-3 ${
              progressPercentage > 100
                ? '[&>div]:bg-red-500'
                : progressPercentage > 80
                  ? '[&>div]:bg-amber-500'
                  : '[&>div]:bg-primary'
            }`}
          />
        </div>

        {progressPercentage > 100 && (
          <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950'>
            <div className='flex items-center gap-2'>
              <AlertTriangle className='h-4 w-4 text-red-600' />
              <p className='text-sm text-red-800 dark:text-red-200'>
                Você excedeu seu orçamento mensal em{' '}
                {formatCurrency(Math.abs(remaining))}. Considere revisar seus
                gastos ou ajustar o orçamento.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
