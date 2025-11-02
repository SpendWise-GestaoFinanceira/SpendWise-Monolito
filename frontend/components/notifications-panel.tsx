'use client';

import { useNotifications } from '@/contexts/NotificationsContext';
import { Bell, X, Trash2, Check } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
}: NotificationsPanelProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return '⚠️';
      case 'sucesso':
        return '✅';
      case 'erro':
        return '❌';
      default:
        return '💡';
    }
  };

  const getBorderColor = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return 'border-l-orange-500';
      case 'sucesso':
        return 'border-l-emerald-500';
      case 'erro':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) return 'Agora';
    if (seconds < 3600) return `Há ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Há ${Math.floor(seconds / 3600)} h`;
    return `Há ${Math.floor(seconds / 86400)} dias`;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity'
        onClick={onClose}
      />

      {/* Painel */}
      <div className='fixed top-0 right-0 h-full w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col'>
        {/* Header */}
        <div className='p-4 border-b border-slate-200 dark:border-slate-800'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <Bell className='w-5 h-5 text-slate-700 dark:text-slate-300' />
              <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                Notificações
              </h3>
              {unreadCount > 0 && (
                <span className='px-2 py-0.5 text-xs font-medium bg-emerald-500 text-white rounded-full'>
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors'
            >
              <X className='w-5 h-5 text-slate-500 dark:text-slate-400' />
            </button>
          </div>

          {notifications.length > 0 && (
            <div className='flex gap-2'>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors'
                >
                  <Check className='w-3 h-3' />
                  Marcar todas como lidas
                </button>
              )}
              <button
                onClick={clearAll}
                className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
              >
                <Trash2 className='w-3 h-3' />
                Limpar tudo
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className='flex-1 overflow-y-auto p-4'>
          {notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <Bell className='w-16 h-16 text-slate-300 dark:text-slate-700 mb-3' />
              <p className='text-slate-500 dark:text-slate-400 text-sm'>
                Nenhuma notificação
              </p>
              <p className='text-slate-400 dark:text-slate-500 text-xs mt-1'>
                Você está em dia!
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`group relative bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-l-4 ${getBorderColor(notification.tipo)} hover:shadow-md transition-all cursor-pointer ${
                    !notification.lida
                      ? 'bg-emerald-50/50 dark:bg-emerald-900/10'
                      : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className='absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all'
                  >
                    <X className='w-3 h-3 text-slate-500' />
                  </button>

                  <div className='flex items-start gap-3'>
                    <div className='text-2xl'>{getIcon(notification.tipo)}</div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-slate-900 dark:text-white text-sm flex items-center gap-2'>
                        {notification.titulo}
                        {!notification.lida && (
                          <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                        )}
                      </h4>
                      <p className='text-xs text-slate-600 dark:text-slate-400 mt-1'>
                        {notification.descricao}
                      </p>
                      <span className='text-xs text-slate-500 dark:text-slate-500 mt-2 block'>
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
