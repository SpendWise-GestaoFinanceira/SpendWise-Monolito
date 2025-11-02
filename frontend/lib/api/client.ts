import {
  ApiResponse,
  LoginResponse,
  User,
  Categoria,
  Transacao,
  OrcamentoMensal,
  Meta,
  FechamentoMensal,
  TransacaoFilters,
  RelatorioCategoria,
  RelatorioMensal,
  EstatisticasOrcamento,
  EstatisticasCategorias,
  PaginatedResponse,
} from '@/lib/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // SEMPRE buscar o token mais recente do localStorage
    const currentToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : this.token;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API ERROR:', {
          status: response.status,
          url: url,
          body: errorText,
        });
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(JSON.stringify(errorData, null, 2));
        } catch {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      // DELETE retorna 204 No Content (sem corpo)
      if (
        response.status === 204 ||
        response.headers.get('content-length') === '0'
      ) {
        return {
          data: true as T,
          success: true,
        };
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  // Auth endpoints
  async login(
    email: string,
    senha: string
  ): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  }

  async register(
    nome: string,
    email: string,
    senha: string,
    confirmarSenha: string
  ): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/Auth/register', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha, confirmarSenha }),
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/Usuarios/me');
  }

  async updateProfile(
    userId: string,
    data: { nome?: string; rendaMensal?: number }
  ): Promise<ApiResponse<User>> {
    const payload = {
      Nome: data.nome,
      RendaMensal: data.rendaMensal,
    };
    console.log('🔵 Enviando PUT /Usuarios/' + userId, payload);
    return this.request<User>(`/Usuarios/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // Categorias endpoints
  async getCategorias(): Promise<ApiResponse<Categoria[]>> {
    return this.request<Categoria[]>('/categorias');
  }

  async getCategoriaById(id: string): Promise<ApiResponse<Categoria>> {
    return this.request<Categoria>(`/categorias/${id}`);
  }

  async createCategoria(data: any): Promise<ApiResponse<Categoria>> {
    return this.request<Categoria>('/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategoria(
    id: string,
    data: any
  ): Promise<ApiResponse<Categoria>> {
    return this.request<Categoria>(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, Id: id }),
    });
  }

  async deleteCategoria(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/categorias/${id}`, {
      method: 'DELETE',
    });
  }

  // Transações endpoints
  async getTransacoes(
    filters?: TransacaoFilters
  ): Promise<ApiResponse<PaginatedResponse<Transacao>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    // Sempre incluir categoria no resultado
    params.append('includeCategoria', 'true');

    const queryString = params.toString();
    const endpoint = `/transacoes?${queryString}`;

    return this.request<PaginatedResponse<Transacao>>(endpoint);
  }

  async getTransacaoById(id: string): Promise<ApiResponse<Transacao>> {
    return this.request<Transacao>(`/transacoes/${id}`);
  }

  async createTransacao(data: {
    descricao: string;
    valor: number;
    dataTransacao: string;
    tipo: string;
    categoriaId?: string;
    observacoes?: string;
  }): Promise<ApiResponse<Transacao>> {
    return this.request<Transacao>('/transacoes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransacao(
    id: string,
    data: any
  ): Promise<ApiResponse<Transacao>> {
    return this.request<Transacao>(`/transacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransacao(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/transacoes/${id}`, {
      method: 'DELETE',
    });
  }

  // Orçamento Mensal endpoints
  async getOrcamentoMensal(
    anoMes: string
  ): Promise<ApiResponse<OrcamentoMensal>> {
    return this.request<OrcamentoMensal>(
      `/OrcamentosMensais/periodo/${anoMes}`
    );
  }

  async createOrcamentoMensal(data: {
    anoMes: string;
    valor: number;
  }): Promise<ApiResponse<OrcamentoMensal>> {
    return this.request<OrcamentoMensal>('/OrcamentosMensais', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrcamentoMensal(
    id: string,
    data: {
      valor: number;
    }
  ): Promise<ApiResponse<OrcamentoMensal>> {
    return this.request<OrcamentoMensal>(`/OrcamentosMensais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOrcamentoMensal(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/OrcamentosMensais/${id}`, {
      method: 'DELETE',
    });
  }

  async getEstatisticasOrcamento(
    anoMes: string
  ): Promise<ApiResponse<EstatisticasOrcamento>> {
    return this.request<EstatisticasOrcamento>(
      `/OrcamentosMensais/estatisticas/${anoMes}`
    );
  }

  async getEstatisticasCategorias(
    anoMes: string
  ): Promise<ApiResponse<EstatisticasCategorias>> {
    return this.request<EstatisticasCategorias>(
      `/OrcamentosMensais/estatisticas/categorias/${anoMes}`
    );
  }

  // Metas endpoints
  async getMetas(): Promise<ApiResponse<Meta[]>> {
    return this.request<Meta[]>('/metas');
  }

  async createMeta(data: {
    descricao: string;
    valorAlvo: number;
    prazo: string;
  }): Promise<ApiResponse<Meta>> {
    return this.request<Meta>('/metas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMeta(
    id: string,
    data: {
      descricao: string;
      valorAlvo: number;
      prazo: string;
    }
  ): Promise<ApiResponse<Meta>> {
    return this.request<Meta>(`/metas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMeta(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/metas/${id}`, {
      method: 'DELETE',
    });
  }

  // Fechamento Mensal endpoints
  async fecharMes(anoMes: string): Promise<ApiResponse<FechamentoMensal>> {
    return this.request<FechamentoMensal>('/FechamentoMensal/fechar', {
      method: 'POST',
      body: JSON.stringify({ anoMes }),
    });
  }

  async getFechamentosMensais(): Promise<ApiResponse<FechamentoMensal[]>> {
    return this.request<FechamentoMensal[]>('/FechamentoMensal');
  }

  // Relatórios endpoints
  async getRelatorioCategorias(
    anoMes: string
  ): Promise<ApiResponse<RelatorioCategoria[]>> {
    return this.request<RelatorioCategoria[]>(
      `/Relatorios/categorias?anoMes=${anoMes}`
    );
  }

  async getRelatorioMensal(
    ano: number
  ): Promise<ApiResponse<RelatorioMensal[]>> {
    return this.request<RelatorioMensal[]>(`/Relatorios/mensal?ano=${ano}`);
  }

  async getRelatorioComparativo(
    anoInicio: number,
    anoFim: number
  ): Promise<ApiResponse<RelatorioMensal[]>> {
    return this.request<RelatorioMensal[]>(
      `/Relatorios/comparativo?anoInicio=${anoInicio}&anoFim=${anoFim}`
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
