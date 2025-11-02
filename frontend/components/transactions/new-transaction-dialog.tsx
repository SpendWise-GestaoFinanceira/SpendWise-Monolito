'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface NewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTransactionDialog({
  open,
  onOpenChange,
}: NewTransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'mercado', label: 'Mercado' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'restaurantes', label: 'Restaurantes' },
    { value: 'outros', label: 'Outros' },
  ];

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setDate(undefined);
    setCategory('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    const numericAmount = Number.parseFloat(
      amount.replace(/[^\d,]/g, '').replace(',', '.')
    );

    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: 'Erro de validação',
        description: 'O valor deve ser maior que zero.',
        variant: 'destructive',
      });
      return;
    }

    if (!date) {
      toast({
        title: 'Erro de validação',
        description: 'A data é obrigatória.',
        variant: 'destructive',
      });
      return;
    }

    if (date > new Date()) {
      toast({
        title: 'Erro de validação',
        description: 'A data não pode ser futura.',
        variant: 'destructive',
      });
      return;
    }

    if (type === 'expense' && !category) {
      toast({
        title: 'Erro de validação',
        description: 'A categoria é obrigatória para despesas.',
        variant: 'destructive',
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'A descrição é obrigatória.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Transação criada',
      description: 'A transação foi adicionada com sucesso.',
    });

    setIsLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const formatCurrency = (value: string) => {
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(formatCurrency(value));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova receita ou despesa ao seu controle financeiro.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='type'>Tipo</Label>
            <Select
              value={type}
              onValueChange={(value: 'income' | 'expense') => setType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='income'>Receita</SelectItem>
                <SelectItem value='expense'>Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='amount'>Valor</Label>
            <Input
              id='amount'
              placeholder='R$ 0,00'
              value={amount}
              onChange={handleAmountChange}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {date
                    ? format(date, 'dd/MM/yyyy', { locale: ptBR })
                    : 'Selecione a data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {type === 'expense' && (
            <div className='space-y-2'>
              <Label htmlFor='category'>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione uma categoria' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='description'>Descrição</Label>
            <Textarea
              id='description'
              placeholder='Descreva a transação...'
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
