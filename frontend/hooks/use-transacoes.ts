'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { Transacao } from '@/lib/types';

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransacoes = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getTransacoes();

      if (response.success && response.data) {
        // Se for PaginatedResponse, pegar apenas o array de items
        const transacoesArray = Array.isArray(response.data)
          ? response.data
          : (response.data as any).items || [];
        setTransacoes(transacoesArray);
      } else {
        setError(response.message || 'Erro ao carregar transações');
      }
    } catch (err) {
      setError('Erro ao carregar transações');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTransacao = async (data: any) => {
    try {
      const response = await apiClient.createTransacao(data);

      if (response.success && response.data) {
        await fetchTransacoes(); // Recarrega a lista
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao criar transação:', err);
      return false;
    }
  };

  const updateTransacao = async (id: string, data: any) => {
    try {
      const response = await apiClient.updateTransacao(id, data);

      if (response.success && response.data) {
        await fetchTransacoes(); // Recarrega a lista
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao atualizar transação:', err);
      return false;
    }
  };

  const deleteTransacao = async (id: string) => {
    try {
      const response = await apiClient.deleteTransacao(id);

      if (response.success) {
        await fetchTransacoes(); // Recarrega a lista
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao deletar transação:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, []);

  return {
    transacoes,
    isLoading,
    error,
    refetch: fetchTransacoes,
    createTransacao,
    updateTransacao,
    deleteTransacao,
  };
}
