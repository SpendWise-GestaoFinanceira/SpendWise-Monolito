'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Bell,
  Plus,
  Calendar,
  Filter,
  Edit2,
  Trash2,
  ChevronDown,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { NovaTransacaoModal } from '@/components/nova-transacao-modal';
import { ConfirmDeleteTransacaoModal } from '@/components/confirm-delete-transacao-modal';
import { getCategoryColor } from '@/lib/category-colors';
import { useTransacoes } from '@/hooks/use-transacoes';
import { useCategorias } from '@/hooks/use-categorias';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function TransacoesPage() {
  // Dados reais da API
  const { user } = useAuth();
  const {
    transacoes: transacoesAPI,
    isLoading,
    refetch,
    deleteTransacao,
  } = useTransacoes();
  const { categorias } = useCategorias();

  const currentDate = new Date();
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];
  const [selectedMonth, setSelectedMonth] = useState(
    `${months[currentDate.getMonth()]}/${currentDate.getFullYear()}`
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [editTransacao, setEditTransacao] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transacaoToDelete, setTransacaoToDelete] = useState<any | null>(null);
  const [tipoDropdownOpen, setTipoDropdownOpen] = useState(false);
  const [categoriaDropdownOpen, setCategoriaDropdownOpen] = useState(false);
  const [periodoDropdownOpen, setPeriodoDropdownOpen] = useState(false);

  // Transformar transações da API para o formato esperado pela UI (com useMemo)
  const transacoes = useMemo(
    () =>
      transacoesAPI.map(t => {
        // Extrai valor - pode vir como objeto Money ou número direto
        const valorNumerico =
          typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;

        return {
          id: t.id,
          descricao: t.descricao,
          valor: valorNumerico,
          tipo: t.tipo === 1 ? 'receita' : 'despesa',
          categoria: t.categoria?.nome || t.categoriaNome || 'Sem categoria',
          categoriaCor:
            t.categoria?.cor ||
            t.categoriaCor ||
            getCategoryColor(t.categoria?.nome || t.categoriaNome || 'Outros'),
          categoriaId: t.categoriaId,
          data: new Date(t.dataTransacao).toLocaleDateString('pt-BR'),
        };
      }),
    [transacoesAPI]
  );

  // Gerar últimos 6 meses com formatação melhorada
  const generateMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    const options = [];

    // Gerar últimos 6 meses
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentYear, currentMonth - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      options.push({
        value: `${monthName}/${year}`,
        label: `${monthName}/${year}`,
        month: date.getMonth(),
        year: year,
      });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  const tiposTransacao = [
    { value: 'Todos', label: 'Todos', color: 'bg-slate-500' },
    { value: 'Receita', label: 'Receita', color: 'bg-emerald-500' },
    { value: 'Despesa', label: 'Despesa', color: 'bg-red-500' },
  ];

  // Categorias reais do backend
  const categoriasTransacao = useMemo(() => {
    const todas = [{ value: 'Todas', label: 'Todas', color: 'bg-slate-500' }];
    const categoriasReais = categorias.map(cat => ({
      value: cat.nome,
      label: cat.nome,
      color: cat.cor || getCategoryColor(cat.nome),
    }));
    return [...todas, ...categoriasReais];
  }, [categorias]);

  // Filtrar transações por busca, tipo, categoria E mês
  const transacoesFiltradas = useMemo(() => {
    // Extrair mês e ano do selectedMonth (formato: "Jan/2025")
    const [monthName, yearStr] = selectedMonth.split('/');
    const monthIndex = months.indexOf(monthName);
    const year = parseInt(yearStr);

    return transacoes.filter(transacao => {
      // Filtro de busca
      const matchesSearch = transacao.descricao
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filtro de tipo
      const matchesType =
        filterType === 'Todos' || transacao.tipo === filterType.toLowerCase();

      // Filtro de categoria
      const matchesCategory =
        filterCategory === 'Todas' || transacao.categoria === filterCategory;

      // Filtro de mês/ano
      const transacaoOriginal = transacoesAPI.find(t => t.id === transacao.id);
      if (transacaoOriginal) {
        const dataTransacao = new Date(transacaoOriginal.dataTransacao);
        const matchesMonth =
          dataTransacao.getMonth() === monthIndex &&
          dataTransacao.getFullYear() === year;
        return matchesSearch && matchesType && matchesCategory && matchesMonth;
      }

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [
    transacoes,
    transacoesAPI,
    searchTerm,
    filterType,
    filterCategory,
    selectedMonth,
    months,
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (tipoDropdownOpen || categoriaDropdownOpen || periodoDropdownOpen) &&
        !(event.target as Element).closest('.relative')
      ) {
        setTipoDropdownOpen(false);
        setCategoriaDropdownOpen(false);
        setPeriodoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tipoDropdownOpen, categoriaDropdownOpen, periodoDropdownOpen]);

  if (!mounted) return null;

  return (
    <div className='space-y-10'>
      {/* Header da página */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Transações</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
        >
          <Plus className='h-4 w-4' />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Filtros */}
      <div className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/30 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-2'>
            <Filter className='h-4 w-4 text-slate-600 dark:text-slate-400' />
            <h3 className='font-medium text-slate-900 dark:text-slate-100'>
              Filtros
            </h3>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {/* Campo de busca */}
          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1'>
              Buscar
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400' />
              <input
                type='text'
                placeholder='Buscar transações...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 h-11 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 w-full'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1'>
              Tipo
            </label>
            <div className='relative'>
              <button
                type='button'
                onClick={() => {
                  setTipoDropdownOpen(!tipoDropdownOpen);
                  setCategoriaDropdownOpen(false);
                }}
                className='w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between'
              >
                <span className='flex items-center'>
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${tiposTransacao.find(t => t.value === filterType)?.color}`}
                  ></div>
                  {tiposTransacao.find(t => t.value === filterType)?.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${tipoDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {tipoDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/30 rounded-2xl shadow-xl z-[9999] overflow-hidden'>
                  {tiposTransacao.map(tipo => (
                    <button
                      key={tipo.value}
                      type='button'
                      onClick={() => {
                        setFilterType(tipo.value);
                        setTipoDropdownOpen(false);
                      }}
                      className='w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center'
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${tipo.color}`}
                      ></div>
                      <span className='text-slate-900 dark:text-slate-100'>
                        {tipo.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1'>
              Categoria
            </label>
            <div className='relative'>
              <button
                type='button'
                onClick={() => {
                  setCategoriaDropdownOpen(!categoriaDropdownOpen);
                  setTipoDropdownOpen(false);
                }}
                className='w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between'
              >
                <span className='flex items-center'>
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${categoriasTransacao.find(c => c.value === filterCategory)?.color}`}
                  ></div>
                  {
                    categoriasTransacao.find(c => c.value === filterCategory)
                      ?.label
                  }
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${categoriaDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {categoriaDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/30 rounded-2xl shadow-xl z-[9999] overflow-hidden'>
                  {categoriasTransacao.map(categoria => (
                    <button
                      key={categoria.value}
                      type='button'
                      onClick={() => {
                        setFilterCategory(categoria.value);
                        setCategoriaDropdownOpen(false);
                      }}
                      className='w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center'
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${categoria.color}`}
                      ></div>
                      <span className='text-slate-900 dark:text-slate-100'>
                        {categoria.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filtro de Período - IGUAL aos outros */}
          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1'>
              Período
            </label>
            <div className='relative'>
              <button
                type='button'
                onClick={() => {
                  setPeriodoDropdownOpen(!periodoDropdownOpen);
                  setTipoDropdownOpen(false);
                  setCategoriaDropdownOpen(false);
                }}
                className='w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between'
              >
                <span className='flex items-center'>
                  <Calendar className='w-4 h-4 mr-3 text-slate-500 dark:text-slate-400' />
                  {selectedMonth}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${periodoDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {periodoDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/30 rounded-2xl shadow-xl z-[9999] overflow-hidden max-h-60 overflow-y-auto'>
                  {monthOptions.map(option => (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => {
                        setSelectedMonth(option.value);
                        setPeriodoDropdownOpen(false);
                      }}
                      className='w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center'
                    >
                      <Calendar className='w-4 h-4 mr-3 text-slate-500 dark:text-slate-400' />
                      <span className='text-slate-900 dark:text-slate-100'>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Transações - EXATO da demo */}
      <div className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/30 dark:border-slate-700/20 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-slate-200/30 dark:border-slate-700/20'>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'
                >
                  Data
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'
                >
                  Descrição
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'
                >
                  Tipo
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'
                >
                  Categoria
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'
                >
                  Valor
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.map(transacao => (
                <tr
                  key={transacao.id}
                  className='border-b border-slate-200/30 dark:border-slate-700/20 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all duration-200'
                >
                  <td className='px-6 py-4 text-sm text-slate-900 dark:text-slate-100'>
                    {transacao.data}
                  </td>
                  <td className='px-6 py-4'>
                    <div>
                      <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                        {transacao.descricao}
                      </p>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transacao.tipo === 'receita' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}
                    >
                      {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm text-slate-900 dark:text-slate-100'>
                    <div className='flex items-center'>
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${transacao.categoriaCor || getCategoryColor(transacao.categoria)}`}
                      ></div>
                      {transacao.categoria}
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 text-right text-sm font-semibold ${transacao.tipo === 'receita' ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {transacao.tipo === 'receita' ? '+' : '-'}R${' '}
                    {transacao.valor.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <div className='inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400'>
                      <button
                        onClick={() => {
                          setEditTransacao(transacao);
                          setShowModal(true);
                        }}
                        className='p-2 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200'
                        title='Editar'
                        aria-label='Editar transação'
                      >
                        <Edit2 className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => {
                          setTransacaoToDelete(transacao);
                          setShowDeleteModal(true);
                        }}
                        className='p-2 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200'
                        title='Excluir'
                        aria-label='Excluir transação'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Transação */}
      <NovaTransacaoModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTransacao(null);
        }}
        initialData={
          editTransacao
            ? {
                id: editTransacao.id,
                descricao: editTransacao.descricao,
                valor: editTransacao.valor,
                tipo: editTransacao.tipo as 'receita' | 'despesa',
                categoriaId: editTransacao.categoriaId,
              }
            : undefined
        }
        onSubmit={() => {
          // O modal faz a criação/edição via API
          setShowModal(false);
          setEditTransacao(null);
          refetch(); // Recarrega a lista
        }}
      />

      {/* Modal Confirmar Exclusão */}
      <ConfirmDeleteTransacaoModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTransacaoToDelete(null);
        }}
        onConfirm={async () => {
          if (transacaoToDelete) {
            await deleteTransacao(transacaoToDelete.id);
          }
          setTransacaoToDelete(null);
          setShowDeleteModal(false);
        }}
        transacao={transacaoToDelete}
      />
    </div>
  );
}
