'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Tipo local para Category
type Category = {
  id: string;
  name: string;
  type: string;
  monthlyLimit: number;
  currentSpent: number;
};

interface EditCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'essential' | 'superfluous'>('essential');
  const [hasLimit, setHasLimit] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type as 'essential' | 'superfluous');
      setHasLimit(!!category.monthlyLimit);
      setMonthlyLimit(
        category.monthlyLimit
          ? category.monthlyLimit.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          : ''
      );
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O nome da categoria é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (hasLimit) {
      const numericLimit = Number.parseFloat(
        monthlyLimit.replace(/[^\d,]/g, '').replace(',', '.')
      );
      if (!numericLimit || numericLimit <= 0) {
        toast({
          title: 'Erro de validação',
          description: 'O limite mensal deve ser maior que zero.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);

    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Categoria atualizada',
      description: 'As alterações foram salvas com sucesso.',
    });

    setIsLoading(false);
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

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonthlyLimit(formatCurrency(value));
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Faça alterações na categoria selecionada.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome da Categoria</Label>
            <Input
              id='name'
              placeholder='Ex: Alimentação, Transporte...'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='type'>Tipo</Label>
            <Select
              value={type}
              onValueChange={(value: 'essential' | 'superfluous') =>
                setType(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='essential'>Essencial</SelectItem>
                <SelectItem value='superfluous'>Supérfluo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id='has-limit'
              checked={hasLimit}
              onCheckedChange={setHasLimit}
            />
            <Label htmlFor='has-limit'>Definir limite mensal</Label>
          </div>

          {hasLimit && (
            <div className='space-y-2'>
              <Label htmlFor='limit'>Limite Mensal</Label>
              <Input
                id='limit'
                placeholder='R$ 0,00'
                value={monthlyLimit}
                onChange={handleLimitChange}
                required={hasLimit}
              />
            </div>
          )}

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
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
