import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<{ data: T; success: boolean; message?: string }>,
  options: UseApiOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  const { toast } = useToast();

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();

      if (response.success) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || 'Erro desconhecido';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        onError?.(errorMessage);
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro inesperado';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      onError?.(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [apiCall, onSuccess, onError, toast]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

// Hook específico para categorias
export function useCategorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getCategorias();
      if (response.success) {
        setCategorias(response.data);
      } else {
        setError(response.message || 'Erro ao carregar categorias');
        toast({
          title: 'Erro',
          description: response.message || 'Erro ao carregar categorias',
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createCategoria = useCallback(
    async (data: any) => {
      try {
        const response = await apiClient.createCategoria(data);
        if (response.success) {
          setCategorias(prev => [...prev, response.data]);
          toast({
            title: 'Sucesso',
            description: 'Categoria criada com sucesso!',
          });
          return true;
        } else {
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao criar categoria',
            variant: 'destructive',
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro inesperado';
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  const updateCategoria = useCallback(
    async (id: string, data: any) => {
      try {
        const response = await apiClient.updateCategoria(id, data);
        if (response.success) {
          setCategorias(prev =>
            prev.map(cat => (cat.id === id ? response.data : cat))
          );
          toast({
            title: 'Sucesso',
            description: 'Categoria atualizada com sucesso!',
          });
          return true;
        } else {
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao atualizar categoria',
            variant: 'destructive',
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro inesperado';
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  const deleteCategoria = useCallback(
    async (id: string) => {
      try {
        const response = await apiClient.deleteCategoria(id);
        if (response.success) {
          setCategorias(prev => prev.filter(cat => cat.id !== id));
          toast({
            title: 'Sucesso',
            description: 'Categoria excluída com sucesso!',
          });
          return true;
        } else {
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao excluir categoria',
            variant: 'destructive',
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro inesperado';
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  return {
    categorias,
    loading,
    error,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  };
}

// Hook específico para transações
export function useTransacoes(filters?: any) {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTransacoes = useCallback(
    async (overrideFilters?: any) => {
      setLoading(true);
      setError(null);

      try {
        const appliedFilters = overrideFilters ?? filters;
        const response = await apiClient.getTransacoes(appliedFilters);
        if (response.success) {
          setTransacoes(response.data.data);
        } else {
          setError(response.message || 'Erro ao carregar transações');
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao carregar transações',
            variant: 'destructive',
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro inesperado';
        setError(errorMessage);
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [filters, toast]
  );

  const createTransacao = useCallback(
    async (data: any) => {
      try {
        const response = await apiClient.createTransacao(data);
        if (response.success) {
          setTransacoes(prev => [response.data, ...prev]);
          toast({
            title: 'Sucesso',
            description: 'Transação criada com sucesso!',
          });
          return true;
        } else {
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao criar transação',
            variant: 'destructive',
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro inesperado';
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  const updateTransacao = useCallback(
    async (id: string, data: any) => {
      try {
        const response = await apiClient.updateTransacao(id, data);
        if (response.success) {
          setTransacoes(prev =>
            prev.map(trans => (trans.id === id ? response.data : trans))
          );
          toast({
            title: 'Sucesso',
            description: 'Transação atualizada com sucesso!',
          });
          return true;
        } else {
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao atualizar transação',
            variant: 'destructive',
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro inesperado';
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  const deleteTransacao = useCallback(
    async (id: string) => {
      try {
        const response = await apiClient.deleteTransacao(id);
        if (response.success) {
          setTransacoes(prev => prev.filter(trans => trans.id !== id));
          toast({
            title: 'Sucesso',
            description: 'Transação excluída com sucesso!',
          });
          return true;
        } else {
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao excluir transação',
            variant: 'destructive',
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro inesperado';
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  return {
    transacoes,
    loading,
    error,
    fetchTransacoes,
    createTransacao,
    updateTransacao,
    deleteTransacao,
  };
}
