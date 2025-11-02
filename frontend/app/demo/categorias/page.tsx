'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Target,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import { NovaCategoriaModal } from '@/components/nova-categoria-modal';
import { EditarCategoriaModal } from '@/components/editar-categoria-modal';
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal';
import { DemoSidebar } from '@/components/demo-sidebar';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { DemoBanner } from '@/components/demo-banner';
import { getCategoryColor } from '@/lib/category-colors';

interface Categoria {
  id: number;
  nome: string;
  gasto: number;
  limite: number;
}

const mockUser = { nome: 'João Silva', email: 'joao.silva@exemplo.com' };

const mockCategorias: Categoria[] = [
  { id: 1, nome: 'Alimentação', gasto: 520, limite: 800 },
  { id: 2, nome: 'Transporte', gasto: 180, limite: 300 },
  { id: 3, nome: 'Lazer', gasto: 240, limite: 400 },
  { id: 4, nome: 'Casa', gasto: 950, limite: 1500 },
  { id: 5, nome: 'Saúde', gasto: 120, limite: 500 },
  { id: 6, nome: 'Educação', gasto: 0, limite: 700 },
];

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>(mockCategorias);
  const [showNova, setShowNova] = useState(false);
  const [editCat, setEditCat] = useState<Categoria | null>(null);
  const [deleteCat, setDeleteCat] = useState<Categoria | null>(null);
  const [mounted, setMounted] = useState(false);

  // header state (to match dashboard)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Janeiro 2025');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Gerar opções de mês/ano dinamicamente
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

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

    // Adicionar próximos 3 meses
    for (let i = 0; i < 3; i++) {
      const date = new Date(currentYear, currentMonth + i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      options.push(`${monthName} ${year}`);
    }

    // Adicionar últimos 12 meses
    for (let i = 1; i <= 12; i++) {
      const date = new Date(currentYear, currentMonth - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      options.push(`${monthName} ${year}`);
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Element;
      if (!t.closest('[data-dropdown="notifications"]'))
        setShowNotifications(false);
      if (!t.closest('[data-dropdown="user"]')) setShowUserMenu(false);
    };
    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showNotifications, showUserMenu]);

  const categoriasFiltradas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categorias;
    return categorias.filter(c => c.nome.toLowerCase().includes(term));
  }, [categorias, searchTerm]);

  const totalGasto = useMemo(
    () => categorias.reduce((acc, c) => acc + c.gasto, 0),
    [categorias]
  );
  const totalLimite = useMemo(
    () => categorias.reduce((acc, c) => acc + c.limite, 0),
    [categorias]
  );
  const totalDisponivel = totalLimite - totalGasto;

  if (!mounted) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground'>
      {/* Sidebar */}
      <DemoSidebar />

      <div className='ml-64'>
        {/* Descritivo + Ação */}
        <section className='max-w-7xl mx-auto px-8 pt-8 mt-0'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>Categorias</h1>
              <p className='text-muted-foreground'>
                Gerencie suas categorias de gastos e limites mensais
              </p>
            </div>
            <button
              onClick={() => setShowNova(true)}
              className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              <Plus className='h-4 w-4' />
              <span>Nova Categoria</span>
            </button>
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

        {/* KPIs - EXATO da área logada */}
        <section className='max-w-7xl mx-auto px-8 mt-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                    Total Orçado
                  </p>
                  <p className='text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100'>
                    R${' '}
                    {totalLimite.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className='p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'>
                  <Target className='h-6 w-6' />
                </div>
              </div>
            </div>

            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                    Total Gasto
                  </p>
                  <p className='text-3xl font-bold mt-1 text-red-500'>
                    R${' '}
                    {totalGasto.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className='p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'>
                  <TrendingDown className='h-6 w-6' />
                </div>
              </div>
            </div>

            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/40 dark:border-slate-700/20 hover:border-slate-400/50 dark:hover:border-slate-600/30'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                    Disponível
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${totalDisponivel >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    R${' '}
                    {totalDisponivel.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className='p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'>
                  <Wallet className='h-6 w-6' />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <main className='max-w-7xl mx-auto px-8 py-10 space-y-10'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {categoriasFiltradas.map(c => {
              const hasLimit = c.limite > 0;
              const pct = hasLimit
                ? Math.min(100, Math.round((c.gasto / c.limite) * 100))
                : 0;
              const bar =
                pct >= 95
                  ? 'bg-orange-500'
                  : pct >= 85
                    ? 'bg-yellow-500'
                    : 'bg-emerald-500';
              const restante = hasLimit ? Math.max(0, c.limite - c.gasto) : 0;
              const tipo = [
                'Transporte',
                'Saúde',
                'Educação',
                'Casa',
                'Mercado',
                'Alimentação',
              ].includes(c.nome)
                ? 'Essencial'
                : 'Supérfluo';
              const showAlerta = hasLimit && pct >= 85;
              return (
                <div
                  key={c.id}
                  className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-2'>
                          <div
                            className={`w-4 h-4 rounded-full ${getCategoryColor(c.nome)}`}
                          ></div>
                          <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                            {c.nome}
                          </h3>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            tipo === 'Essencial'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-500/15 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {tipo}
                        </span>
                        {showAlerta && (
                          <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30'>
                            <AlertTriangle className='h-3 w-3' /> Alerta
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => setEditCat(c)}
                        className='p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200'
                        aria-label='Editar'
                        title='Editar'
                      >
                        <Edit2 className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => setDeleteCat(c)}
                        className='p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200'
                        aria-label='Excluir'
                        title='Excluir'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </div>

                  <div className='space-y-1 mb-3'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-slate-600 dark:text-slate-400'>
                        Gasto atual
                      </span>
                      <span className='font-medium text-slate-900 dark:text-slate-100'>
                        R${' '}
                        {c.gasto.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-slate-600 dark:text-slate-400'>
                        Limite mensal
                      </span>
                      <span className='font-medium text-slate-900 dark:text-slate-100'>
                        {hasLimit
                          ? `R$ ${c.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : 'Sem limite definido'}
                      </span>
                    </div>
                  </div>

                  <div className='h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
                    <div
                      className={`h-2 rounded-full ${bar}`}
                      style={{ width: `${isFinite(pct) ? pct : 0}%` }}
                    />
                  </div>
                  <div className='mt-2 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between'>
                    <span>{isFinite(pct) ? `${pct}% usado` : '0% usado'}</span>
                    {hasLimit && (
                      <span className=''>
                        R${' '}
                        {restante.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        restante
                      </span>
                    )}
                  </div>

                  {/* Ações rápidas removidas para manter apenas ícones no cabeçalho */}
                </div>
              );
            })}
          </div>

          {/* Resumo */}
          <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
              <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Total Gasto
              </h4>
              <div className='mt-2 text-2xl font-bold text-emerald-500'>
                R$ {totalGasto.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
              <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Categorias Ativas
              </h4>
              <div className='mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100'>
                {categorias.length}
              </div>
            </div>
            <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
              <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Média por Categoria
              </h4>
              <div className='mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100'>
                R${' '}
                {(totalGasto / Math.max(1, categorias.length)).toLocaleString(
                  'pt-BR',
                  { maximumFractionDigits: 0 }
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Modais */}
      <NovaCategoriaModal
        isOpen={showNova}
        onClose={() => setShowNova(false)}
        onSubmit={(cat: any) =>
          setCategorias(prev => [
            ...prev,
            {
              id: Date.now(),
              nome: cat.nome,
              gasto: 0,
              limite:
                cat.limiteDefinido && cat.limiteMensal ? cat.limiteMensal : 0,
            },
          ])
        }
      />
      <EditarCategoriaModal
        isOpen={!!editCat}
        onClose={() => setEditCat(null)}
        categoria={
          editCat
            ? {
                nome: editCat.nome,
                tipo: 'Essencial',
                limiteDefinido: true,
                limiteMensal: editCat.limite,
                gastoAtual: editCat.gasto,
              }
            : undefined
        }
        onSubmit={cat => {
          if (!editCat) return;
          setCategorias(prev =>
            prev.map(c =>
              c.id === editCat.id
                ? {
                    ...c,
                    nome: cat.nome,
                    limite:
                      cat.limiteDefinido && cat.limiteMensal
                        ? cat.limiteMensal
                        : c.limite,
                  }
                : c
            )
          );
          setEditCat(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteCat}
        onClose={() => setDeleteCat(null)}
        onConfirm={() => {
          if (deleteCat)
            setCategorias(prev => prev.filter(c => c.id !== deleteCat.id));
          setDeleteCat(null);
        }}
        title='Excluir categoria?'
        message={deleteCat ? `A categoria será removida permanentemente.` : ''}
        itemName={deleteCat?.nome}
      />
    </div>
  );
}
