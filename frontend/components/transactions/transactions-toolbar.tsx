'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Search, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TransactionsToolbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const activeFiltersCount = [
    typeFilter !== 'all',
    categoryFilter !== 'all',
    dateFrom,
    dateTo,
    searchTerm.length > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-1 items-center gap-2'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Buscar por descrição...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Tipo' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            <SelectItem value='income'>Receitas</SelectItem>
            <SelectItem value='expense'>Despesas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder='Categoria' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todas</SelectItem>
            <SelectItem value='mercado'>Mercado</SelectItem>
            <SelectItem value='transporte'>Transporte</SelectItem>
            <SelectItem value='lazer'>Lazer</SelectItem>
            <SelectItem value='restaurantes'>Restaurantes</SelectItem>
            <SelectItem value='outros'>Outros</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='gap-2 bg-transparent'>
              <Calendar className='h-4 w-4' />
              {dateFrom ? (
                dateTo ? (
                  <>
                    {format(dateFrom, 'dd/MM', { locale: ptBR })} -{' '}
                    {format(dateTo, 'dd/MM', { locale: ptBR })}
                  </>
                ) : (
                  format(dateFrom, 'dd/MM/yyyy', { locale: ptBR })
                )
              ) : (
                'Período'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <CalendarComponent
              initialFocus
              mode='range'
              defaultMonth={dateFrom}
              selected={{ from: dateFrom, to: dateTo }}
              onSelect={range => {
                setDateFrom(range?.from);
                setDateTo(range?.to);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className='flex items-center gap-2'>
        {activeFiltersCount > 0 && (
          <>
            <Badge variant='secondary' className='gap-1'>
              <Filter className='h-3 w-3' />
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
            <Button
              variant='ghost'
              size='sm'
              onClick={clearFilters}
              className='gap-1'
            >
              <X className='h-3 w-3' />
              Limpar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
