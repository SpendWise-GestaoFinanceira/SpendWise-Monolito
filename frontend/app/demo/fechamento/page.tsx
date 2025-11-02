'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Lock,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Shield,
} from 'lucide-react';
import { DemoSidebar } from '@/components/demo-sidebar';
import { DemoBanner } from '@/components/demo-banner';
import { NovaTransacaoModal } from '@/components/nova-transacao-modal';

// Dados de demonstração locais (mock)
const mockData = {
  user: { nome: 'Usuário Demo', email: 'demo@exemplo.com' },
  notificacoes: [
    {
      id: 1,
      tipo: 'info',
      titulo: 'Novo orçamento disponível',
      descricao: 'Janeiro/2024',
      tempo: '2 min atrás',
    },
  ],
  fechamentoAtual: { mes: 'Janeiro 2024' },
  historicoFechamentos: [
    {
      mes: 'Dezembro 2023',
      dataFechamento: '05/01/2024',
      receitas: 5200,
      despesas: 4200,
      saldoFinal: 1000,
    },
    {
      mes: 'Novembro 2023',
      dataFechamento: '03/12/2023',
      receitas: 4500,
      despesas: 3800,
      saldoFinal: 700,
    },
  ],
};

export default function FechamentoPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Setembro 2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  // mantém modal legacy (não utilizada aqui)
  const [showModal, setShowModal] = useState(false);

  // Estado do fechamento atual e histórico (mock)
  const [statusAtual, setStatusAtual] = useState<'Aberto' | 'Fechado'>(
    'Aberto'
  );
  const [mesAtual, setMesAtual] = useState('Janeiro 2024');
  const [receitas, setReceitas] = useState(4500);
  const [despesas, setDespesas] = useState(2150);
  const saldoFinal = receitas - despesas;

  type HistoricoItem = {
    mes: string;
    fechadoEm: string;
    receitas: number;
    despesas: number;
    saldo: number;
  };
  const [historico, setHistorico] = useState<HistoricoItem[]>([
    {
      mes: 'Dezembro 2023',
      fechadoEm: '05/01/2024',
      receitas: 5200,
      despesas: 4200,
      saldo: 1000,
    },
    {
      mes: 'Novembro 2023',
      fechadoEm: '03/12/2023',
      receitas: 4500,
      despesas: 3800,
      saldo: 700,
    },
  ]);

  // Modal de confirmação para fechar mês
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Montar componente
  useEffect(() => setMounted(true), []);

  // Fechar dropdowns quando clicado fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest('[data-dropdown="notifications"]') &&
        !target.closest('[data-dropdown="user"]')
      ) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground'>
      <DemoSidebar />

      {/* Main Content */}
      <div className='ml-64'>
        {/* Descritivo */}
        <section className='max-w-7xl mx-auto px-8 pt-8 mt-0'>
          <div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              Fechamento Mensal
            </h1>
            <p className='text-muted-foreground'>
              Gerencie o fechamento dos seus períodos financeiros
            </p>
          </div>
        </section>

        {/* Banner Comece Agora */}
        <DemoBanner
          title='Modo Demonstração'
          subtitle='Crie sua conta gratuita para gerenciar suas finanças de verdade'
          backHref='/'
          ctaHref='/register'
          ctaLabel='Começar Agora'
        />

        {/* Conteúdo */}
        <main className='max-w-7xl mx-auto px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Coluna esquerda - cartão principal */}
            <div className='lg:col-span-2 bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                    Janeiro 2024{' '}
                    <span className='ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 align-middle'>
                      Aberto
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
                    {receitas.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-red-400 font-medium mb-1 inline-flex items-center gap-2'>
                    <TrendingUp className='h-4 w-4 rotate-180' />
                    Despesas
                  </p>
                  <p className='text-2xl font-bold text-red-500'>
                    R${' '}
                    {despesas.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
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
        </main>

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
                  onClick={() => {
                    const fechadoEm = new Date().toLocaleDateString('pt-BR');
                    setHistorico(prev => [
                      {
                        mes: mesAtual,
                        fechadoEm,
                        receitas,
                        despesas,
                        saldo: saldoFinal,
                      },
                      ...prev,
                    ]);
                    setStatusAtual('Fechado');
                    setShowCloseModal(false);
                  }}
                  className='px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors'
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Nova Transação */}
      <NovaTransacaoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
