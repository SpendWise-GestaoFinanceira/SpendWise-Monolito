'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Transaction = {
  id: string;
  date: Date;
  description: string;
  type: 'income' | 'expense';
  category?: string;
  amount: number;
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date(2024, 0, 20),
    description: 'Supermercado Extra',
    type: 'expense',
    category: 'Mercado',
    amount: 156.8,
  },
  {
    id: '2',
    date: new Date(2024, 0, 19),
    description: 'Freelance Design',
    type: 'income',
    amount: 800.0,
  },
  {
    id: '3',
    date: new Date(2024, 0, 18),
    description: 'Uber para trabalho',
    type: 'expense',
    category: 'Transporte',
    amount: 25.5,
  },
  {
    id: '4',
    date: new Date(2024, 0, 17),
    description: 'Almoço no restaurante',
    type: 'expense',
    category: 'Restaurantes',
    amount: 45.0,
  },
  {
    id: '5',
    date: new Date(2024, 0, 15),
    description: 'Netflix',
    type: 'expense',
    category: 'Lazer',
    amount: 29.9,
  },
  {
    id: '6',
    date: new Date(2024, 0, 12),
    description: 'Combustível',
    type: 'expense',
    category: 'Transporte',
    amount: 120.0,
  },
  {
    id: '7',
    date: new Date(2024, 0, 10),
    description: 'Venda de produto',
    type: 'income',
    amount: 350.0,
  },
  {
    id: '8',
    date: new Date(2024, 0, 8),
    description: 'Farmácia',
    type: 'expense',
    category: 'Outros',
    amount: 67.5,
  },
  {
    id: '9',
    date: new Date(2024, 0, 5),
    description: 'Cinema',
    type: 'expense',
    category: 'Lazer',
    amount: 32.0,
  },
  {
    id: '10',
    date: new Date(2024, 0, 1),
    description: 'Salário',
    type: 'income',
    amount: 4500.0,
  },
];

export function TransactionsTable() {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className='text-right'>Valor</TableHead>
            <TableHead className='w-[70px]'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center'>
                Nenhuma transação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className='font-medium'>
                  {format(transaction.date, 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === 'income' ? 'default' : 'secondary'
                    }
                  >
                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transaction.category || (
                    <span className='text-muted-foreground'>—</span>
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  <span
                    className={
                      transaction.type === 'income'
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Abrir menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem className='gap-2'>
                        <Edit className='h-4 w-4' />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className='gap-2 text-destructive'>
                        <Trash2 className='h-4 w-4' />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
