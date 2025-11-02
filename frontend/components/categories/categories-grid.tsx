'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Tipo local para Category
type Category = {
  id: string;
  name: string;
  type: string;
  monthlyLimit: number;
  currentSpent: number;
};

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Mercado',
    type: 'essential',
    monthlyLimit: 1200,
    currentSpent: 650,
  },
  {
    id: '2',
    name: 'Transporte',
    type: 'essential',
    monthlyLimit: 400,
    currentSpent: 380,
  },
  {
    id: '3',
    name: 'Lazer',
    type: 'superfluous',
    monthlyLimit: 600,
    currentSpent: 520,
  },
  {
    id: '4',
    name: 'Restaurantes',
    type: 'superfluous',
    monthlyLimit: 500,
    currentSpent: 420,
  },
  {
    id: '5',
    name: 'Saúde',
    type: 'essential',
    monthlyLimit: 300,
    currentSpent: 150,
  },
  {
    id: '6',
    name: 'Educação',
    type: 'essential',
    monthlyLimit: 500,
    currentSpent: 200,
  },
];

interface CategoriesGridProps {
  onEditCategory: (category: Category) => void;
}

export function CategoriesGrid({ onEditCategory }: CategoriesGridProps) {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getProgressPercentage = (spent: number, limit?: number) => {
    if (!limit) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressStatus = (spent: number, limit?: number) => {
    if (!limit) return 'normal';
    const percentage = (spent / limit) * 100;
    if (percentage > 100) return 'exceeded';
    if (percentage > 80) return 'warning';
    return 'normal';
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({
      title: 'Categoria excluída',
      description: 'A categoria foi removida com sucesso.',
    });
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {categories.map(category => {
        const progressPercentage = getProgressPercentage(
          category.currentSpent,
          category.monthlyLimit
        );
        const status = getProgressStatus(
          category.currentSpent,
          category.monthlyLimit
        );

        return (
          <Card key={category.id} className='relative'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-base font-medium'>
                {category.name}
              </CardTitle>
              <div className='flex items-center gap-2'>
                {status === 'exceeded' && (
                  <AlertTriangle className='h-4 w-4 text-red-500' />
                )}
                {status === 'warning' && (
                  <AlertTriangle className='h-4 w-4 text-amber-500' />
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Abrir menu</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() => onEditCategory(category)}
                      className='gap-2'
                    >
                      <Edit className='h-4 w-4' />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCategory(category.id)}
                      className='gap-2 text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Badge
                  variant={
                    category.type === 'essential' ? 'default' : 'secondary'
                  }
                >
                  {category.type === 'essential' ? 'Essencial' : 'Supérfluo'}
                </Badge>
                {status === 'exceeded' && (
                  <Badge variant='destructive' className='gap-1'>
                    <AlertTriangle className='h-3 w-3' />
                    Ultrapassado
                  </Badge>
                )}
                {status === 'warning' && (
                  <Badge
                    variant='secondary'
                    className='gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  >
                    <AlertTriangle className='h-3 w-3' />
                    Alerta
                  </Badge>
                )}
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Gasto atual</span>
                  <span className='font-medium'>
                    {formatCurrency(category.currentSpent)}
                  </span>
                </div>

                {category.monthlyLimit && (
                  <>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>
                        Limite mensal
                      </span>
                      <span className='font-medium'>
                        {formatCurrency(category.monthlyLimit)}
                      </span>
                    </div>

                    <div className='space-y-1'>
                      <Progress
                        value={progressPercentage}
                        className={`h-2 ${
                          status === 'exceeded'
                            ? '[&>div]:bg-red-500'
                            : status === 'warning'
                              ? '[&>div]:bg-amber-500'
                              : '[&>div]:bg-primary'
                        }`}
                      />
                      <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>{progressPercentage.toFixed(0)}% usado</span>
                        <span>
                          {category.monthlyLimit - category.currentSpent > 0
                            ? `${formatCurrency(category.monthlyLimit - category.currentSpent)} restante`
                            : `${formatCurrency(category.currentSpent - category.monthlyLimit)} acima`}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {!category.monthlyLimit && (
                  <p className='text-xs text-muted-foreground'>
                    Sem limite definido
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
