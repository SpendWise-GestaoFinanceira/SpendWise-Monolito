'use client';

import { useState, useEffect } from 'react';
import { Bell, Shield, Download, Trash2, Save } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function ConfiguracoesPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  const [notificacoes, setNotificacoes] = useState({
    emailTransacoes: true,
    emailLimites: true,
    pushNotifications: false,
  });

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('notificationSettings');
    if (savedConfig) {
      setNotificacoes(JSON.parse(savedConfig));
    }
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleSalvarNotificacoes = () => {
    // Salvar no localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(notificacoes));

    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event('notificationSettingsUpdated'));

    toast({
      title: 'Preferências salvas',
      description: 'Suas configurações foram atualizadas.',
    });
  };

  const handleExportarDados = () => {
    toast({
      title: 'Exportação iniciada',
      description: 'Seus dados estão sendo preparados para download.',
    });
  };

  const handleExcluirConta = () => {
    if (
      confirm(
        'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.'
      )
    ) {
      toast({
        title: 'Conta excluída',
        description: 'Você será redirecionado para a página inicial.',
        variant: 'destructive',
      });
      setTimeout(() => logout(), 2000);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
          Configurações
        </h1>
        <p className='text-slate-600 dark:text-slate-400 mt-2'>
          Gerencie suas preferências, notificações e segurança
        </p>
      </div>

      {/* Informações do Usuário */}
      <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg'>
            <span className='text-white font-semibold text-xl'>
              {user?.nome
                ?.split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'US'}
            </span>
          </div>
          <div>
            <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
              {user?.nome || 'Usuário'}
            </h2>
            <p className='text-slate-600 dark:text-slate-400'>
              {user?.email || 'email@exemplo.com'}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 mt-6'>
          <div className='bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-slate-300 dark:border-slate-700'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>Status</p>
            <p className='text-lg font-semibold text-emerald-500 mt-1'>
              {user?.isAtivo ? 'Ativo' : 'Inativo'}
            </p>
          </div>
          <div className='bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-slate-300 dark:border-slate-700'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Renda Mensal
            </p>
            <p className='text-lg font-semibold text-slate-900 dark:text-white mt-1'>
              R${' '}
              {(user?.rendaMensal || 0).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Notificações */}
      <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30'>
            <Bell className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
              Notificações
            </h3>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Configure como deseja receber alertas
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-300 dark:border-slate-700'>
            <div>
              <h4 className='font-medium text-slate-900 dark:text-white'>
                E-mail para novas transações
              </h4>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Receba um e-mail sempre que uma transação for adicionada
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={notificacoes.emailTransacoes}
                onChange={e =>
                  setNotificacoes({
                    ...notificacoes,
                    emailTransacoes: e.target.checked,
                  })
                }
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/25 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className='flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-300 dark:border-slate-700'>
            <div>
              <h4 className='font-medium text-slate-900 dark:text-white'>
                Alertas de limite de categoria
              </h4>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Seja notificado quando atingir 80% do limite de uma categoria
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={notificacoes.emailLimites}
                onChange={e =>
                  setNotificacoes({
                    ...notificacoes,
                    emailLimites: e.target.checked,
                  })
                }
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/25 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className='flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-300 dark:border-slate-700'>
            <div>
              <h4 className='font-medium text-slate-900 dark:text-white'>
                Notificações push
              </h4>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Receba notificações no navegador
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={notificacoes.pushNotifications}
                onChange={e =>
                  setNotificacoes({
                    ...notificacoes,
                    pushNotifications: e.target.checked,
                  })
                }
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/25 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        <div className='flex justify-end mt-6'>
          <button
            onClick={handleSalvarNotificacoes}
            className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200'
          >
            <Save className='h-4 w-4' />
            Salvar Preferências
          </button>
        </div>
      </div>

      {/* Segurança e Privacidade */}
      <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-3 rounded-xl bg-red-100 dark:bg-red-900/30'>
            <Shield className='h-6 w-6 text-red-600 dark:text-red-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
              Segurança e Privacidade
            </h3>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Gerencie seus dados e segurança
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <button
            onClick={handleExportarDados}
            className='w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all'
          >
            <div className='flex items-center gap-3'>
              <Download className='h-5 w-5 text-slate-600 dark:text-slate-400' />
              <div className='text-left'>
                <h4 className='font-medium text-slate-900 dark:text-white'>
                  Exportar dados
                </h4>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  Baixe uma cópia de todas as suas informações
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleExcluirConta}
            className='w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all'
          >
            <div className='flex items-center gap-3'>
              <Trash2 className='h-5 w-5 text-red-600 dark:text-red-400' />
              <div className='text-left'>
                <h4 className='font-medium text-red-600 dark:text-red-400'>
                  Excluir conta
                </h4>
                <p className='text-sm text-red-600/70 dark:text-red-400/70'>
                  Remova permanentemente sua conta e todos os dados
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
