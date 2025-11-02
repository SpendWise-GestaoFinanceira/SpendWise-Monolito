'use client';

import { Bell, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const notifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Limite da categoria ultrapassado',
    message: "Categoria 'Alimentação' ultrapassou 100% do limite mensal",
    time: '2 min atrás',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Orçamento mensal atingindo limite',
    message: 'Você já gastou 85% do seu orçamento mensal',
    time: '1 hora atrás',
    read: false,
  },
  {
    id: 3,
    type: 'success',
    title: 'Meta de economia atingida',
    message: 'Parabéns! Você economizou R$ 500 este mês',
    time: '1 dia atrás',
    read: true,
  },
];

export function NotificationsDropdown() {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className='h-4 w-4 text-amber-500' />;
      case 'success':
        return <TrendingUp className='h-4 w-4 text-emerald-500' />;
      default:
        return <Bell className='h-4 w-4 text-sky-500' />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-4 w-4' />
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs'
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align='end'>
        <div className='flex items-center justify-between p-4'>
          <h4 className='font-semibold'>Notificações</h4>
          <Button variant='ghost' size='sm'>
            Marcar todas como lidas
          </Button>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className='h-80'>
          {notifications.map(notification => (
            <DropdownMenuItem
              key={notification.id}
              className='flex items-start gap-3 p-4'
            >
              <div className='mt-0.5'>{getIcon(notification.type)}</div>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium'>{notification.title}</p>
                  {!notification.read && (
                    <div className='h-2 w-2 rounded-full bg-sky-500' />
                  )}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {notification.message}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {notification.time}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className='p-2'>
          <Button variant='ghost' className='w-full justify-center text-sm'>
            Ver todas as notificações
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
