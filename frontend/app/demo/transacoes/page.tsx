'use client';

import { useState, useEffect } from 'react';
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
  ArrowUpIcon,
  ArrowDownIcon,
} from 'lucide-react';
import { NovaTransacaoModal } from '@/components/nova-transacao-modal';
import { DemoBanner } from '@/components/demo-banner';
import { DemoSidebar } from '@/components/demo-sidebar';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { getCategoryColor } from '@/lib/category-colors';

// Dados mocados para demonstração
const mockData = {
  user: {
    nome: 'João Silva',
    email: 'joao.silva@exemplo.com',
    avatar: 'US',
  },
  transacoes: [
    {
      id: 1,
      descricao: 'Supermercado Extra',
      valor: 156.8,
      tipo: 'despesa',
      categoria: 'Alimentação',
      data: '20/01/2025',
    },
    {
      id: 2,
      descricao: 'Freelance Design',
      valor: 800.0,
      tipo: 'receita',
      categoria: 'Trabalho',
      data: '19/01/2025',
    },
    {
      id: 3,
      descricao: 'Uber para trabalho',
      valor: 25.5,
      tipo: 'despesa',
      categoria: 'Transporte',
      data: '18/01/2025',
    },
    {
      id: 4,
      descricao: 'Netflix Assinatura',
      valor: 29.9,
      tipo: 'despesa',
      categoria: 'Entretenimento',
      data: '15/01/2025',
    },
    {
      id: 5,
      descricao: 'Salário Janeiro',
      valor: 4500.0,
      tipo: 'receita',
      categoria: 'Trabalho',
      data: '01/01/2025',
    },
    {
      id: 6,
      descricao: 'Almoço Restaurante',
      valor: 45.0,
      tipo: 'despesa',
      categoria: 'Alimentação',
      data: '17/01/2025',
    },
    {
      id: 7,
      descricao: 'Gasolina',
      valor: 120.0,
      tipo: 'despesa',
      categoria: 'Transporte',
      data: '16/01/2025',
    },
    {
      id: 8,
      descricao: 'Farmácia',
      valor: 78.5,
      tipo: 'despesa',
      categoria: 'Saúde',
      data: '14/01/2025',
    },
  ],
  notificacoes: [
    {
      id: 1,
      titulo: 'Limite de categoria atingido',
      descricao: 'Você atingiu 80% do limite da categoria Alimentação',
      tipo: 'alerta',
      tempo: '2 horas atrás',
    },
    {
      id: 2,
      titulo: 'Nova transação adicionada',
      descricao: 'Supermercado Extra - R$ 156,80',
      tipo: 'info',
      tempo: '4 horas atrás',
    },
  ],
};

export default function TransacoesPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Janeiro 2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Gerar últimos 6 meses
  const generateMonthOptions = () => {
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

    const options = [];

    // Gerar últimos 6 meses
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentYear, currentMonth - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      options.push(`${monthName} ${year}`);
    }

    return options;
  };

  const monthOptions = generateMonthOptions();
  const [filterType, setFilterType] = useState('Todos');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [editTransacao, setEditTransacao] = useState<
    (typeof mockData.transacoes)[number] | null
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transacaoToDelete, setTransacaoToDelete] = useState<
    (typeof mockData.transacoes)[number] | null
  >(null);
  const [tipoDropdownOpen, setTipoDropdownOpen] = useState(false);
  const [categoriaDropdownOpen, setCategoriaDropdownOpen] = useState(false);

  // Estado para gerenciar as transações (adicionar novas)
  const [transacoes, setTransacoes] = useState(mockData.transacoes);

  const tiposTransacao = [
    { value: 'Todos', label: 'Todos', color: 'bg-slate-500' },
    { value: 'Receita', label: 'Receita', color: 'bg-emerald-500' },
    { value: 'Despesa', label: 'Despesa', color: 'bg-red-500' },
  ];

  const categoriasTransacao = [
    { value: 'Todas', label: 'Todas', color: 'bg-slate-500' },
    { value: 'Alimentação', label: 'Alimentação', color: 'bg-orange-500' },
    { value: 'Transporte', label: 'Transporte', color: 'bg-blue-500' },
    {
      value: 'Entretenimento',
      label: 'Entretenimento',
      color: 'bg-purple-500',
    },
    { value: 'Educação', label: 'Educação', color: 'bg-indigo-500' },
    { value: 'Saúde', label: 'Saúde', color: 'bg-green-500' },
  ];

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (tipoDropdownOpen || categoriaDropdownOpen) &&
        !(event.target as Element).closest('.relative')
      ) {
        setTipoDropdownOpen(false);
        setCategoriaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tipoDropdownOpen, categoriaDropdownOpen]);

  // Fechar outros dropdowns quando um é aberto
  useEffect(() => {
    if (tipoDropdownOpen) {
      setCategoriaDropdownOpen(false);
    }
  }, [tipoDropdownOpen]);

  useEffect(() => {
    if (categoriaDropdownOpen) {
      setTipoDropdownOpen(false);
    }
  }, [categoriaDropdownOpen]);

  // Fechar dropdowns de notificações quando clicado fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Montar componente
  useEffect(() => setMounted(true), []);

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter(transacao => {
    const matchesSearch = transacao.descricao
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'Todos' || transacao.tipo === filterType.toLowerCase();
    const matchesCategory =
      filterCategory === 'Todas' || transacao.categoria === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  if (!mounted) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground'>
      <DemoSidebar />

      {/* Main Content */}
      <div className='ml-64'>
        {/* Content */}
        <main className='max-w-7xl mx-auto px-8 py-10 space-y-10'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>Transações</h1>
              <p className='text-muted-foreground'>
                Gerencie todas as suas transações financeiras
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              <Plus className='h-4 w-4' />
              <span>Nova Transação</span>
            </button>
          </div>

          {/* Banner Comece Agora */}
          <DemoBanner
            title='Modo Demonstração'
            subtitle='Crie sua conta gratuita para gerenciar suas finanças de verdade'
            backHref='/'
            ctaHref='/register'
            ctaLabel='Começar Agora'
            className='!mt-6'
          />

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
                    onClick={() => setTipoDropdownOpen(!tipoDropdownOpen)}
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
                    onClick={() =>
                      setCategoriaDropdownOpen(!categoriaDropdownOpen)
                    }
                    className='w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between'
                  >
                    <span className='flex items-center'>
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${categoriasTransacao.find(c => c.value === filterCategory)?.color}`}
                      ></div>
                      {
                        categoriasTransacao.find(
                          c => c.value === filterCategory
                        )?.label
                      }
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${categoriaDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {categoriaDropdownOpen && (
                    <div className='absolute top-full left-0 right-0 mt-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/30 rounded-2xl shadow-xl z-[9999] overflow-hidden max-h-60 overflow-y-auto'>
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

              {/* Filtro de Período */}
              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1'>
                  Período
                </label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className='h-11 rounded-2xl px-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/20 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all duration-200 w-full'>
                    <SelectValue placeholder={selectedMonth} />
                  </SelectTrigger>
                  <SelectContent className='bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/30 shadow-xl rounded-xl z-[99999]'>
                    {monthOptions.map(m => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabela de Transações */}
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
                            className={`w-3 h-3 rounded-full mr-3 ${getCategoryColor(transacao.categoria)}`}
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
                            onClick={() =>
                              setTransacoes(prev =>
                                prev.filter(t => t.id !== transacao.id)
                              )
                            }
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
        </main>

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
                  descricao: editTransacao.descricao,
                  valor: editTransacao.valor,
                  tipo: editTransacao.tipo as 'receita' | 'despesa',
                  categoriaId: editTransacao.categoria,
                }
              : undefined
          }
          onSubmit={(novaTransacao: any) => {
            if (editTransacao) {
              // Editar transação existente
              setTransacoes(prev =>
                prev.map(t =>
                  t.id === editTransacao.id
                    ? {
                        ...t,
                        descricao: novaTransacao.descricao,
                        valor: novaTransacao.valor,
                        tipo: novaTransacao.tipo,
                        categoria: novaTransacao.categoria,
                        data: t.data,
                      }
                    : t
                )
              );
              setEditTransacao(null);
            } else {
              const novoId = Math.max(0, ...transacoes.map(t => t.id)) + 1;
              setTransacoes(prev => [
                {
                  id: novoId,
                  descricao: novaTransacao.descricao,
                  valor: novaTransacao.valor,
                  tipo: novaTransacao.tipo,
                  categoria: novaTransacao.categoria,
                  data: new Date().toLocaleDateString('pt-BR'),
                },
                ...prev,
              ]);
            }
            setShowModal(false);
          }}
        />
      </div>
    </div>
  );
}
