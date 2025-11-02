'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { OrcamentoMensal } from '@/lib/types';

export function useOrcamento(anoMes?: string) {
  const [orcamento, setOrcamento] = useState<OrcamentoMensal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gerar anoMes atual se não fornecido (formato: YYYY-MM)
  const getCurrentAnoMes = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const fetchOrcamento = async (targetAnoMes?: string) => {
    try {
      setIsLoading(true);
      const mes = targetAnoMes || anoMes || getCurrentAnoMes();
      const response = await apiClient.getOrcamentoMensal(mes);

      if (response.success && response.data) {
        setOrcamento(response.data);
      } else {
        setError(response.message || 'Erro ao carregar orçamento');
      }
    } catch (err) {
      setError('Erro ao carregar orçamento');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrcamento = async (data: any) => {
    try {
      const response = await apiClient.createOrcamentoMensal(data);

      if (response.success && response.data) {
        setOrcamento(response.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao criar orçamento:', err);
      return false;
    }
  };

  const updateOrcamento = async (anoMes: string, data: any) => {
    try {
      const response = await apiClient.updateOrcamentoMensal(anoMes, data);

      if (response.success && response.data) {
        setOrcamento(response.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao atualizar orçamento:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchOrcamento();
  }, [anoMes]);

  return {
    orcamento,
    isLoading,
    error,
    refetch: fetchOrcamento,
    createOrcamento,
    updateOrcamento,
    getCurrentAnoMes,
  };
}
