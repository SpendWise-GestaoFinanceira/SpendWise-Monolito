'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ReportsToolbar() {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    new Date(2024, 0, 1)
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date(2024, 0, 31));
  const { toast } = useToast();

  const handleExportCSV = () => {
    toast({
      title: 'Exportação iniciada',
      description: 'O arquivo CSV será baixado em breve.',
    });
  };

  const handleExportPDF = () => {
    toast({
      title: 'Exportação iniciada',
      description: 'O arquivo PDF será baixado em breve.',
    });
  };

  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Período:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'justify-start text-left font-normal',
                  !dateFrom && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateFrom
                  ? format(dateFrom, 'MM/yyyy', { locale: ptBR })
                  : 'Início'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={dateFrom}
                onSelect={d => setDateFrom(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className='text-muted-foreground'>até</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'justify-start text-left font-normal',
                  !dateTo && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateTo ? format(dateTo, 'MM/yyyy', { locale: ptBR }) : 'Fim'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={dateTo}
                onSelect={d => setDateTo(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          onClick={handleExportCSV}
          className='gap-2 bg-transparent'
        >
          <Download className='h-4 w-4' />
          Exportar CSV
        </Button>
        <Button
          variant='outline'
          onClick={handleExportPDF}
          className='gap-2 bg-transparent'
        >
          <FileText className='h-4 w-4' />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
