'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  message = 'Tem certeza que deseja excluir?',
  confirmText = 'Sim, Excluir',
  cancelText = 'Cancelar',
  itemName,
}: ConfirmDeleteModalProps) {
  // Bloquear scroll e interações quando modal estiver aberta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
      return () => {
        document.body.style.overflow = 'unset';
        document.body.style.pointerEvents = 'auto';
      };
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50'
      style={{
        pointerEvents: 'auto',
        width: '100vw',
        height: '100vh',
        minWidth: '100vw',
        minHeight: '100vh',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className='bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-600/30 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center'>
            <div className='w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3'>
              <AlertTriangle className='h-5 w-5 text-red-600 dark:text-red-400' />
            </div>
            <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <p className='text-sm text-slate-600 dark:text-slate-400 mb-6'>
          {message}
        </p>

        {itemName && (
          <div className='bg-slate-50/80 dark:bg-slate-700/50 rounded-2xl p-4 mb-6'>
            <p className='text-sm text-slate-600 dark:text-slate-400 mb-1'>
              Categoria a ser excluída:
            </p>
            <p className='font-medium text-slate-900 dark:text-slate-100'>
              {itemName}
            </p>
          </div>
        )}

        <div className='bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-4 mb-6'>
          <p className='text-sm text-amber-800 dark:text-amber-200 flex items-center'>
            <AlertTriangle className='h-4 w-4 mr-2' />
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className='flex space-x-3'>
          <button
            onClick={onClose}
            className='flex-1 px-6 py-3 text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl font-medium transition-all duration-200 hover:scale-105'
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className='flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2'
          >
            <AlertTriangle className='w-4 h-4' />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
