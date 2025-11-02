'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, DollarSign, Save } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api/client';

export default function PerfilPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    rendaMensal: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        rendaMensal: user.rendaMensal || 0,
      });
    }
  }, [user]);

  if (!mounted) return null;

  const handleSalvar = async () => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não identificado');
      }

      // Validações básicas
      const nomeValidado = formData.nome?.trim() || '';
      if (!nomeValidado || nomeValidado.length < 2) {
        toast({
          title: 'Erro de validação',
          description: 'Nome deve ter pelo menos 2 caracteres.',
          variant: 'destructive',
        });
        return;
      }

      const rendaValidada = parseFloat(String(formData.rendaMensal));
      if (isNaN(rendaValidada) || rendaValidada <= 0) {
        toast({
          title: 'Erro de validação',
          description: 'Renda mensal deve ser um valor maior que zero.',
          variant: 'destructive',
        });
        return;
      }

      // Backend não aceita email, apenas nome e rendaMensal
      const response = await apiClient.updateProfile(user.id, {
        nome: nomeValidado,
        rendaMensal: rendaValidada,
      });

      if (response.success && response.data) {
        // Atualizar o contexto chamando refreshUser
        await refreshUser();

        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações foram salvas com sucesso.',
        });
      } else {
        throw new Error(response.message || 'Erro ao atualizar perfil');
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error?.message || 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
          Meu Perfil
        </h1>
        <p className='text-slate-600 dark:text-slate-400 mt-2'>
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Card do Perfil */}
      <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20'>
        <div className='flex items-center gap-4 mb-8'>
          <div className='w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg'>
            <span className='text-white font-semibold text-2xl'>
              {user?.nome
                ?.split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'US'}
            </span>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
              {user?.nome || 'Usuário'}
            </h2>
            <p className='text-slate-600 dark:text-slate-400'>
              {user?.email || 'email@exemplo.com'}
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Nome */}
          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
              <User className='w-4 h-4 inline mr-2' />
              Nome Completo
            </label>
            <input
              type='text'
              name='nome'
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
              className='w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 dark:text-white'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
              <Mail className='w-4 h-4 inline mr-2' />
              E-mail
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              disabled
              className='w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed'
            />
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
              O e-mail não pode ser alterado
            </p>
          </div>

          {/* Renda Mensal */}
          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
              <DollarSign className='w-4 h-4 inline mr-2' />
              Renda Mensal (R$)
            </label>
            <input
              type='number'
              name='rendaMensal'
              value={formData.rendaMensal}
              onChange={e =>
                setFormData({
                  ...formData,
                  rendaMensal:
                    e.target.value === '' ? 0 : parseFloat(e.target.value),
                })
              }
              min='0'
              step='0.01'
              className='w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900 dark:text-white'
            />
          </div>

          {/* Data de Cadastro */}
          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
              <Calendar className='w-4 h-4 inline mr-2' />
              Membro desde
            </label>
            <div className='px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400'>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                : 'Data não disponível'}
            </div>
          </div>

          {/* Botão Salvar */}
          <button
            type='submit'
            onClick={handleSalvar}
            className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200'
          >
            <Save className='w-4 h-4' />
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-300/40 dark:border-slate-700/20'>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Status da Conta
          </p>
          <p className='text-2xl font-bold text-emerald-500 mt-2'>
            {user?.isAtivo ? 'Ativa' : 'Inativa'}
          </p>
        </div>

        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-300/40 dark:border-slate-700/20'>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            ID do Usuário
          </p>
          <p className='text-sm font-mono text-slate-900 dark:text-white mt-2 truncate'>
            {user?.id || 'N/A'}
          </p>
        </div>

        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-300/40 dark:border-slate-700/20'>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Última Atualização
          </p>
          <p className='text-sm text-slate-900 dark:text-white mt-2'>
            {user?.updatedAt
              ? new Date(user.updatedAt).toLocaleDateString('pt-BR')
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
