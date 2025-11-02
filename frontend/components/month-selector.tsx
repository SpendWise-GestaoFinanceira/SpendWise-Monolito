'use client';

import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function MonthSelector() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const selectMonth = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
  };

  return (
    <div className='flex items-center gap-1'>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => navigateMonth('prev')}
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='gap-2 min-w-[140px] bg-transparent'
          >
            {currentMonth} {currentYear}
            <ChevronDown className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='center'>
          {months.map((month, index) => (
            <DropdownMenuItem
              key={month}
              onClick={() => selectMonth(index)}
              className={currentDate.getMonth() === index ? 'bg-accent' : ''}
            >
              {month} {currentYear}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => navigateMonth('next')}
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}
