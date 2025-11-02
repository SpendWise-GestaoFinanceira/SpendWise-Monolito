'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  AlertTriangle,
  Edit2,
  Trash2,
  Target,
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import { NovaCategoriaModal } from '@/components/nova-categoria-modal';
import {
  getCategoryColor,
  calcularPercentualLimite,
  getProgressBarColor,
} from '@/lib/utils/category-utils';
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal';
import { useCategorias } from '@/hooks/use-categorias';
import { useTransacoes } from '@/hooks/use-transacoes';
export default function CategoriasPage() {
  // Dados reais da API
  const {
    categorias: categoriasAPI,
    isLoading: loadingCategorias,
    refetch,
    deleteCategoria,
  } = useCategorias();
  const { transacoes: transacoesAPI, isLoading: loadingTransacoes } =
    useTransacoes();

  const [showNova, setShowNova] = useState(false);
  const [editCat, setEditCat] = useState<any | null>(null);
  const [deleteCat, setDeleteCat] = useState<any | null>(null);

  // Calcular gastos por categoria a partir das transações
  const categoriasComGastos = useMemo(() => {
    return categoriasAPI.map(cat => {
      const gastoCategoria = transacoesAPI
        .filter(t => t.categoriaId === cat.id && t.tipo === 2) // 2 = Despesa
        .reduce(
          (sum, t) =>
            sum +
            ((typeof t.valor === 'number' ? t.valor : t.valor?.valor) || 0),
          0
        );

      return {
        id: cat.id,
        nome: cat.nome,
        cor: cat.cor, // ✅ Incluir cor da categoria
        gasto: gastoCategoria,
        limite: cat.limite || 0,
        tipo: cat.tipo,
      };
    });
  }, [categoriasAPI, transacoesAPI]);

  const totalGasto = useMemo(
    () => categoriasComGastos.reduce((acc, c) => acc + c.gasto, 0),
    [categoriasComGastos]
  );
  const totalLimite = useMemo(
    () => categoriasComGastos.reduce((acc, c) => acc + c.limite, 0),
    [categoriasComGastos]
  );
  const totalDisponivel = totalLimite - totalGasto;

  return (
    <div className='space-y-10'>
      {/* Header da página - EXATO da demo */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Categorias</h1>
        </div>
        <button
          onClick={() => setShowNova(true)}
          className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
        >
          <Plus className='h-4 w-4' />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* KPIs - EXATO da demo */}
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

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {loadingCategorias ? (
          <div className='col-span-full text-center py-10 text-slate-500'>
            Carregando categorias...
          </div>
        ) : categoriasComGastos.length === 0 ? (
          <div className='col-span-full text-center py-10 text-slate-500'>
            Nenhuma categoria cadastrada ainda.
          </div>
        ) : (
          categoriasComGastos.map((c: any) => {
            const hasLimit = c.limite && c.limite > 0;
            const pct = calcularPercentualLimite(c.gasto || 0, c.limite);
            const bar = getProgressBarColor(pct);
            const restante = hasLimit
              ? Math.max(0, (c.limite || 0) - (c.gasto || 0))
              : 0;
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
                          className={`w-4 h-4 rounded-full ${c.cor || getCategoryColor(c.nome)}`}
                        ></div>
                        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
                          {c.nome}
                        </h3>
                      </div>
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
                      className='p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200'
                      aria-label='Editar'
                      title='Editar'
                    >
                      <Edit2 className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => setDeleteCat(c)}
                      className='p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200'
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
                      {(c.gasto || 0).toLocaleString('pt-BR', {
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
                        ? `R$ ${(c.limite || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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
              </div>
            );
          })
        )}
      </div>

      {/* Resumo - EXATO da demo */}
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
            {categoriasComGastos.length}
          </div>
        </div>
        <div className='bg-slate-50/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-300/40 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300'>
          <h4 className='text-sm font-medium text-slate-600 dark:text-slate-400'>
            Média por Categoria
          </h4>
          <div className='mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100'>
            R${' '}
            {(
              totalGasto / Math.max(1, categoriasComGastos.length)
            ).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </section>

      {/* Modais */}
      <NovaCategoriaModal
        isOpen={showNova}
        onClose={() => {
          setShowNova(false);
          refetch();
        }}
        onSubmit={() => {
          setShowNova(false);
          refetch();
        }}
      />
      <NovaCategoriaModal
        isOpen={!!editCat}
        initialData={
          editCat
            ? {
                id: editCat.id,
                nome: editCat.nome,
                cor: editCat.cor, // ✅ INCLUIR COR
                tipo: editCat.tipo,
                limite: editCat.limite,
              }
            : undefined
        }
        onClose={() => {
          setEditCat(null);
          refetch();
        }}
        onSubmit={() => {
          setEditCat(null);
          refetch();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteCat}
        onClose={() => setDeleteCat(null)}
        onConfirm={async () => {
          if (deleteCat?.id) {
            const success = await deleteCategoria(deleteCat.id);
            if (success) {
              refetch();
            }
          }
          setDeleteCat(null);
        }}
        title='Excluir categoria?'
        message={deleteCat ? `A categoria será removida permanentemente.` : ''}
        itemName={deleteCat?.nome}
      />
    </div>
  );
}
