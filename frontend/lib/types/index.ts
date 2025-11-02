// Tipos baseados no backend SpendWise

export interface User {
  id: string;
  nome: string;
  email: string;
  rendaMensal?: number;
  isAtivo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Money {
  valor: number;
  moeda: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 1 | 2; // TipoCategoria: 1 = Receita, 2 = Despesa
  limite?: number; // decimal no backend
  cor?: string; // Cor da categoria
  usuarioId: string;
  isAtiva: boolean; // IsAtiva no backend
  createdAt: string;
  updatedAt?: string;
}

export enum TipoCategoria {
  RECEITA = 1,
  DESPESA = 2,
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: Money;
  dataTransacao: string;
  tipo: TipoTransacao;
  usuarioId: string;
  categoriaId: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  categoria?: Categoria;
  categoriaNome?: string;
  categoriaCor?: string;
}

export enum TipoTransacao {
  RECEITA = 1,
  DESPESA = 2,
}

export interface OrcamentoMensal {
  id: string;
  anoMes: string;
  valor: Money;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FechamentoMensal {
  id: string;
  anoMes: string;
  usuarioId: string;
  fechadoEm: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  id: string;
  descricao: string;
  valorAlvo: Money;
  prazo: string;
  usuarioId: string;
  isAtivo: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTOs para requests
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface CreateCategoriaRequest {
  nome: string;
  descricao?: string;
  tipo: TipoCategoria;
  limite?: number;
}

export interface UpdateCategoriaRequest {
  id: string;
  nome: string;
  descricao?: string;
  tipo: TipoCategoria;
  limite?: number;
}

export interface CreateTransacaoRequest {
  descricao: string;
  valor: number;
  dataTransacao: string;
  tipo: TipoTransacao;
  categoriaId?: string;
  observacoes?: string;
}

export interface UpdateTransacaoRequest {
  id: string;
  descricao: string;
  valor: number;
  dataTransacao: string;
  categoriaId?: string;
  observacoes?: string;
}

export interface CreateOrcamentoMensalRequest {
  anoMes: string;
  valor: number;
}

export interface CreateMetaRequest {
  descricao: string;
  valorAlvo: number;
  prazo: string;
}

// DTOs para responses
export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Filtros e queries
export interface TransacaoFilters {
  tipo?: TipoTransacao;
  categoriaId?: string;
  dataInicio?: string;
  dataFim?: string;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface RelatorioCategoria {
  categoriaId: string;
  categoriaNome: string;
  total: number;
  percentual: number;
  cor: string;
}

export interface RelatorioMensal {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface EstatisticasOrcamento {
  orcamentoTotal: number;
  gastoTotal: number;
  percentualUsado: number;
  saldoRestante: number;
  diasRestantes: number;
}

export interface OrcamentoCategoria {
  categoriaId: string;
  nome: string;
  limite: number;
  gasto: number;
  percentualUtilizado: number;
  status: 'Dentro' | 'Atencao' | 'Alerta' | 'Excedido';
}

export interface EstatisticasCategorias {
  anoMes: string;
  categorias: OrcamentoCategoria[];
}

// Estados da aplicação
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  auth: AuthState;
  categorias: Categoria[];
  transacoes: Transacao[];
  orcamentoMensal: OrcamentoMensal | null;
  metas: Meta[];
  isLoading: boolean;
  error: string | null;
}
