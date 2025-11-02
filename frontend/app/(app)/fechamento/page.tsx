'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  CheckCircle,
  AlertTriangle,
  FileText,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { NovaTransacaoModal } from '@/components/nova-transacao-modal';
import { useTransacoes } from '@/hooks/use-transacoes';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationsContext';

export default function FechamentoPage() {
  const { transacoes } = useTransacoes();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [showModal, setShowModal] = useState(false);
  const [statusAtual, setStatusAtual] = useState<'Aberto' | 'Fechado'>(
    'Aberto'
  );
  const [loading, setLoading] = useState(false);
  const [fechamentosMensais, setFechamentosMensais] = useState<any[]>([]);

  const currentDate = new Date();
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
  const mesAtual = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Calcular receitas e despesas do mês atual
  const { receitas, despesas, saldoFinal } = useMemo(() => {
    const rec = transacoes
      .filter(t => {
        const dataTransacao = new Date(t.dataTransacao);
        return (
          dataTransacao.getMonth() === currentDate.getMonth() &&
          dataTransacao.getFullYear() === currentDate.getFullYear() &&
          t.tipo === 1
        );
      })
      .reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );

    const desp = transacoes
      .filter(t => {
        const dataTransacao = new Date(t.dataTransacao);
        return (
          dataTransacao.getMonth() === currentDate.getMonth() &&
          dataTransacao.getFullYear() === currentDate.getFullYear() &&
          t.tipo === 2
        );
      })
      .reduce(
        (sum, t) =>
          sum + (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
        0
      );

    return { receitas: rec, despesas: desp, saldoFinal: rec - desp };
  }, [transacoes, currentDate]);

  // Calcular histórico dos fechamentos reais
  const historico = useMemo(() => {
    return fechamentosMensais
      .filter(f => {
        const [ano, mes] = f.anoMes.split('-');
        const fechamentoDate = new Date(parseInt(ano), parseInt(mes) - 1);
        return (
          fechamentoDate <
          new Date(currentDate.getFullYear(), currentDate.getMonth())
        );
      })
      .slice(0, 2)
      .map(f => {
        const [ano, mes] = f.anoMes.split('-');
        const monthName = months[parseInt(mes) - 1];
        return {
          mes: `${monthName} ${ano}`,
          fechadoEm: new Date(f.createdAt).toLocaleDateString('pt-BR'),
          receitas: f.totalReceitas || 0,
          despesas: f.totalDespesas || 0,
          saldo: (f.totalReceitas || 0) - (f.totalDespesas || 0),
        };
      });
  }, [fechamentosMensais, currentDate, months]);

  // Modal de confirmação para fechar mês
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Carregar fechamentos mensais
  useEffect(() => {
    const loadFechamentos = async () => {
      try {
        const response = await apiClient.getFechamentosMensais();
        if (response.success && response.data) {
          setFechamentosMensais(response.data);

          // Verificar se mês atual está fechado
          const anoMesAtual = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
          const mesAtualFechado = response.data.find(
            (f: any) => f.anoMes === anoMesAtual
          );
          if (mesAtualFechado) {
            setStatusAtual('Fechado');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar fechamentos:', error);
      }
    };

    if (mounted) {
      loadFechamentos();
    }
  }, [mounted]);

  if (!mounted) return null;

  const handleFecharMes = async () => {
    setLoading(true);
    try {
      const anoMes = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

      const response = await apiClient.fecharMes(anoMes);

      if (response.success) {
        setStatusAtual('Fechado');
        setShowCloseModal(false);

        toast({
          title: 'Mês fechado com sucesso',
          description: `${mesAtual} foi fechado. As transações estão bloqueadas para edição.`,
        });

        // Adicionar notificação persistente
        addNotification({
          tipo: 'sucesso',
          titulo: 'Mês fechado com sucesso',
          descricao: `${mesAtual} foi fechado. As transações estão bloqueadas para edição.`,
          link: '/fechamento',
        });

        // Recarregar fechamentos
        const fechamentosResponse = await apiClient.getFechamentosMensais();
        if (fechamentosResponse.success && fechamentosResponse.data) {
          setFechamentosMensais(fechamentosResponse.data);
        }
      } else {
        toast({
          title: 'Erro ao fechar mês',
          description:
            response.message || 'Não foi possível realizar o fechamento.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao fechar mês',
        description: error.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Fechamento Mensal
          </h1>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Coluna esquerda - cartão principal */}
        <div className='lg:col-span-2 bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                {mesAtual}{' '}
                <span className='ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 align-middle'>
                  {statusAtual}
                </span>
              </h3>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Período atual em andamento
              </p>
            </div>
            <button
              disabled={statusAtual === 'Fechado'}
              onClick={() => setShowCloseModal(true)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                statusAtual === 'Fechado'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Lock className='h-4 w-4' />
              {statusAtual === 'Fechado' ? 'Mês Fechado' : 'Fechar Mês'}
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6'>
            <div>
              <p className='text-sm text-emerald-400 font-medium mb-1 inline-flex items-center gap-2'>
                <TrendingUp className='h-4 w-4' />
                Receitas
              </p>
              <p className='text-2xl font-bold text-emerald-500'>
                R${' '}
                {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className='text-sm text-red-400 font-medium mb-1 inline-flex items-center gap-2'>
                <TrendingUp className='h-4 w-4 rotate-180' />
                Despesas
              </p>
              <p className='text-2xl font-bold text-red-500'>
                R${' '}
                {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className='text-sm text-emerald-400 font-medium mb-1 inline-flex items-center gap-2'>
                <DollarSign className='h-4 w-4' />
                Saldo Final
              </p>
              <p className='text-2xl font-bold text-emerald-500'>
                R${' '}
                {saldoFinal.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className='mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='h-5 w-5 text-amber-400 mt-0.5' />
              <div>
                <p className='text-sm font-medium text-amber-400'>
                  Atenção: Fechamento do período
                </p>
                <p className='text-sm text-amber-300/80 mt-1'>
                  Ao fechar este mês, todas as transações do período ficarão
                  bloqueadas para edição. Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita - histórico */}
        <aside className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
          <div className='flex items-center justify-between mb-1'>
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-emerald-500' />
              <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                Histórico de Fechamentos
              </h3>
            </div>
          </div>
          <p className='text-xs text-slate-600 dark:text-slate-400 mb-4'>
            Períodos já fechados
          </p>
          <div className='space-y-4'>
            {historico.map((h, i) => (
              <div
                key={i}
                className='p-4 rounded-xl bg-slate-100/50 dark:bg-slate-700/30 hover:bg-slate-200/50 dark:hover:bg-slate-600/40 transition-all duration-200'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium text-slate-900 dark:text-slate-100'>
                      {h.mes}
                    </p>
                    <p className='text-xs text-slate-600 dark:text-slate-400'>
                      Fechado em {h.fechadoEm}
                    </p>
                  </div>
                  <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-200/50 dark:bg-slate-600/50 text-slate-600 dark:text-slate-400 border border-slate-300/30 dark:border-slate-600/30'>
                    <Lock className='h-3 w-3' /> Fechado
                  </span>
                </div>
                <div className='mt-3 grid grid-cols-3 gap-2 text-sm'>
                  <div className='text-emerald-400'>
                    Receitas:
                    <br />
                    <span className='font-semibold'>
                      R${' '}
                      {h.receitas.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className='text-red-400'>
                    Despesas:
                    <br />
                    <span className='font-semibold'>
                      R${' '}
                      {h.despesas.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className='text-emerald-400'>
                    Saldo final:
                    <br />
                    <span className='font-semibold'>
                      R${' '}
                      {h.saldo.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                {i < historico.length - 1 && (
                  <div className='mt-4 border-t border-slate-300/40 dark:border-slate-700/20'></div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Modal Confirmar Fechamento */}
      {showCloseModal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/30 rounded-2xl w-full max-w-md p-6 shadow-2xl'>
            <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>
              Confirmar Fechamento do Mês
            </h3>
            <p className='text-sm text-slate-600 dark:text-slate-400 mt-2'>
              Ao confirmar, o período atual será marcado como fechado e as
              transações ficarão bloqueadas para edição.
            </p>
            <div className='mt-6 flex items-center justify-end gap-3'>
              <button
                onClick={() => setShowCloseModal(false)}
                className='px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200'
              >
                Cancelar
              </button>
              <button
                onClick={handleFecharMes}
                disabled={loading}
                className='px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Fechando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Transação */}
      <NovaTransacaoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
