'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { Categoria } from '@/lib/types';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getCategorias();

      if (response.success && response.data) {
        setCategorias(response.data);
      } else {
        setError(response.message || 'Erro ao carregar categorias');
      }
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategoria = async (data: any) => {
    try {
      const response = await apiClient.createCategoria(data);

      if (response.success && response.data) {
        await fetchCategorias(); // Recarrega a lista
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
      return false;
    }
  };

  const updateCategoria = async (id: string, data: any) => {
    try {
      const response = await apiClient.updateCategoria(id, data);

      if (response.success && response.data) {
        await fetchCategorias(); // Recarrega a lista
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      return false;
    }
  };

  const deleteCategoria = async (id: string) => {
    try {
      const response = await apiClient.deleteCategoria(id);

      if (response.success) {
        await fetchCategorias(); // Recarrega a lista
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao deletar categoria:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    isLoading,
    error,
    refetch: fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  };
}
