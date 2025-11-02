'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  ArrowLeft,
  Settings,
  LogOut,
  Calendar,
  Filter,
  Edit2,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { DemoSidebar } from '@/components/demo-sidebar';

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
  const [selectedMonth, setSelectedMonth] = useState('Janeiro 2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [filterType, setFilterType] = useState('Todos');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [showModal, setShowModal] = useState(false);

  // Fechar dropdowns quando clicado fora
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

  // Filtrar transações
  const transacoesFiltradas = mockData.transacoes.filter(transacao => {
    const matchesSearch = transacao.descricao
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'Todos' || transacao.tipo === filterType.toLowerCase();
    const matchesCategory =
      filterCategory === 'Todas' || transacao.categoria === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <DemoSidebar />

      {/* Main Content */}
      <div className='ml-64'>
        {/* Header */}
        <header className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-6'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <input
                  type='text'
                  placeholder='Buscar transações...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 w-80'
                />
              </div>

              <div className='flex items-center space-x-2'>
                <span className='text-sm text-muted-foreground'>Mês:</span>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className='bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500'
                >
                  <option>Janeiro 2025</option>
                  <option>Dezembro 2024</option>
                  <option>Novembro 2024</option>
                </select>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setShowModal(true)}
                className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
              >
                <Plus className='h-4 w-4' />
                <span>Nova Transação</span>
              </button>

              <div className='relative dropdown-container'>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className='relative p-2 hover:bg-accent rounded-lg transition-colors'
                >
                  <Bell className='h-6 w-6 text-muted-foreground hover:text-foreground' />
                  <span className='absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    2
                  </span>
                </button>

                {showNotifications && (
                  <div
                    className='absolute right-0 top-12 w-96 bg-background border border-border rounded-lg shadow-xl z-40'
                    onClick={e => e.stopPropagation()}
                  >
                    <div className='p-4 border-b border-border'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-semibold text-foreground'>
                          Notificações
                        </h3>
                        <button className='text-sm text-muted-foreground hover:text-foreground'>
                          Marcar todas como lidas
                        </button>
                      </div>
                    </div>
                    <div className='max-h-96 overflow-y-auto'>
                      {mockData.notificacoes.map(notif => (
                        <div
                          key={notif.id}
                          className='p-4 border-b border-border/50 hover:bg-accent/30 transition-colors'
                        >
                          <div className='flex items-start space-x-3'>
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notif.tipo === 'alerta'
                                  ? 'bg-red-500'
                                  : notif.tipo === 'info'
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                              }`}
                            ></div>
                            <div className='flex-1'>
                              <h4 className='font-medium text-foreground text-sm'>
                                {notif.titulo}
                              </h4>
                              <p className='text-muted-foreground text-sm mt-1'>
                                {notif.descricao}
                              </p>
                              <p className='text-muted-foreground/70 text-xs mt-2'>
                                {notif.tempo}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ThemeToggle />

              <div className='relative dropdown-container'>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className='flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors'
                >
                  <div className='w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium'>
                    US
                  </div>
                </button>

                {showUserMenu && (
                  <div
                    className='absolute right-0 top-12 w-64 bg-background border border-border rounded-lg shadow-xl z-40'
                    onClick={e => e.stopPropagation()}
                  >
                    <div className='p-4 border-b border-border'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium'>
                          US
                        </div>
                        <div>
                          <h3 className='font-medium text-foreground'>
                            {mockData.user.nome}
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            {mockData.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='p-2'>
                      <button className='w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-accent rounded-lg transition-colors'>
                        <Settings className='h-4 w-4 text-muted-foreground' />
                        <span className='text-foreground'>Perfil</span>
                      </button>
                      <button className='w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-accent rounded-lg transition-colors'>
                        <Settings className='h-4 w-4 text-muted-foreground' />
                        <span className='text-foreground'>Configurações</span>
                      </button>
                      <hr className='my-2 border-border' />
                      <button className='w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-accent rounded-lg transition-colors text-red-400'>
                        <LogOut className='h-4 w-4' />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Demo Banner */}
        <div className='bg-gradient-to-r from-emerald-600 to-teal-600 mx-6 mt-6 p-4 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => (window.location.href = '/')}
                className='text-white hover:text-emerald-100 transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
              </button>
              <div>
                <h2 className='text-xl font-bold text-white'>
                  Demonstração do SpendWise
                </h2>
                <p className='text-emerald-100'>
                  Explore todas as funcionalidades com dados de exemplo
                </p>
              </div>
            </div>
            <button className='bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors border border-white/20'>
              <UserPlus className='h-4 w-4' />
              <span>Começar Agora</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className='p-6 space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>Transações</h1>
              <p className='text-muted-foreground'>
                Gerencie todas as suas transações financeiras
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className='bg-card/60 backdrop-blur-sm p-4 rounded-lg border border-border'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center space-x-2'>
                <Filter className='h-4 w-4 text-muted-foreground' />
                <h3 className='font-medium text-foreground'>Filtros</h3>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>
                  Tipo
                </label>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className='w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500'
                >
                  <option>Todos</option>
                  <option>Receita</option>
                  <option>Despesa</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>
                  Categoria
                </label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className='w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500'
                >
                  <option>Todas</option>
                  <option>Alimentação</option>
                  <option>Transporte</option>
                  <option>Entretenimento</option>
                  <option>Educação</option>
                  <option>Saúde</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>
                  Período
                </label>
                <select className='w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500'>
                  <option>Último mês</option>
                  <option>Últimos 3 meses</option>
                  <option>Último ano</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela de Transações */}
          <div className='bg-card/60 backdrop-blur-sm rounded-lg border border-border overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border'>
                    <th className='px-6 py-4 text-left text-sm font-medium text-muted-foreground'>
                      Data
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-muted-foreground'>
                      Descrição
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-muted-foreground'>
                      Tipo
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-muted-foreground'>
                      Categoria
                    </th>
                    <th className='px-6 py-4 text-right text-sm font-medium text-muted-foreground'>
                      Valor
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-medium text-muted-foreground'>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transacoesFiltradas.map(transacao => (
                    <tr
                      key={transacao.id}
                      className='border-b border-border/50 hover:bg-accent/30 transition-colors'
                    >
                      <td className='px-6 py-4 text-sm text-foreground'>
                        {transacao.data}
                      </td>
                      <td className='px-6 py-4'>
                        <div>
                          <p className='text-sm font-medium text-foreground'>
                            {transacao.descricao}
                          </p>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transacao.tipo === 'receita'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-foreground'>
                        {transacao.categoria}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <span
                          className={`text-sm font-semibold ${
                            transacao.tipo === 'receita'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {transacao.tipo === 'receita' ? '+' : '-'}R${' '}
                          {transacao.valor.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center justify-center space-x-2'>
                          <button className='p-1 hover:bg-accent rounded transition-colors'>
                            <Edit2 className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                          </button>
                          <button className='p-1 hover:bg-accent rounded transition-colors'>
                            <Trash2 className='h-4 w-4 text-muted-foreground hover:text-red-400' />
                          </button>
                          <button className='p-1 hover:bg-accent rounded transition-colors'>
                            <MoreHorizontal className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumo */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Total de Receitas
                  </p>
                  <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    R${' '}
                    {mockData.transacoes
                      .filter(t => t.tipo === 'receita')
                      .reduce((acc, t) => acc + t.valor, 0)
                      .toFixed(2)
                      .replace('.', ',')}
                  </p>
                </div>
                <ArrowUpIcon className='h-8 w-8 text-green-600 dark:text-green-400' />
              </div>
            </div>

            <div className='bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Total de Despesas
                  </p>
                  <p className='text-2xl font-bold text-red-600 dark:text-red-400'>
                    R${' '}
                    {mockData.transacoes
                      .filter(t => t.tipo === 'despesa')
                      .reduce((acc, t) => acc + t.valor, 0)
                      .toFixed(2)
                      .replace('.', ',')}
                  </p>
                </div>
                <ArrowDownIcon className='h-8 w-8 text-red-600 dark:text-red-400' />
              </div>
            </div>

            <div className='bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Saldo Total</p>
                  <p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
                    R${' '}
                    {mockData.transacoes
                      .reduce(
                        (acc, t) =>
                          t.tipo === 'receita' ? acc + t.valor : acc - t.valor,
                        0
                      )
                      .toFixed(2)
                      .replace('.', ',')}
                  </p>
                </div>
                <DollarSign className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Nova Transação */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-foreground'>
                Nova Transação
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>
                  Descrição
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  placeholder='Ex: Almoço no restaurante'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>
                  Valor
                </label>
                <input
                  type='number'
                  step='0.01'
                  className='w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  placeholder='0,00'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>
                  Tipo
                </label>
                <select className='w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500'>
                  <option value='receita'>Receita</option>
                  <option value='despesa'>Despesa</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-1'>
                  Categoria
                </label>
                <select className='w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500'>
                  <option value='alimentacao'>Alimentação</option>
                  <option value='transporte'>Transporte</option>
                  <option value='entretenimento'>Entretenimento</option>
                  <option value='educacao'>Educação</option>
                  <option value='saude'>Saúde</option>
                </select>
              </div>

              <div className='flex space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors'
                >
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
