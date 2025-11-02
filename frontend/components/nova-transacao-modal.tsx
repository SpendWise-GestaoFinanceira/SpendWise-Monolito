'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Plus } from 'lucide-react';
import { useTransacoes } from '@/hooks/use-transacoes';
import { useCategorias } from '@/hooks/use-categorias';
import { useToast } from '@/hooks/use-toast';
import { getCategoryColor } from '@/lib/category-colors';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useTransacoes as useTransacoesHook } from '@/hooks/use-transacoes';

interface NovaTransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData?: {
    id?: string;
    descricao?: string;
    valor?: number;
    tipo?: 'receita' | 'despesa';
    categoriaId?: string;
  };
}

export function NovaTransacaoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: NovaTransacaoModalProps) {
  const { createTransacao, updateTransacao } = useTransacoes();
  const { categorias: categoriasAPI } = useCategorias();
  const { transacoes } = useTransacoesHook();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa' as 'receita' | 'despesa',
    categoriaId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoDropdownOpen, setTipoDropdownOpen] = useState(false);
  const [categoriaDropdownOpen, setCategoriaDropdownOpen] = useState(false);

  // Função para mapear nome da categoria para value
  const getCategoryValueFromLabel = (label: string): string => {
    const categoryMap: { [key: string]: string } = {
      Alimentação: 'alimentacao',
      Transporte: 'transporte',
      Entretenimento: 'entretenimento',
      Educação: 'educacao',
      Saúde: 'saude',
      Trabalho: 'trabalho',
      Outros: 'outros',
    };
    return categoryMap[label] || 'outros';
  };

  // Hydrate form when opening in edit mode
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        descricao: initialData.descricao ?? '',
        valor: initialData.valor !== undefined ? String(initialData.valor) : '',
        tipo: initialData.tipo ?? 'despesa',
        categoriaId:
          initialData.categoriaId ??
          (categoriasAPI.length > 0 ? categoriasAPI[0].id : ''),
      });
    } else if (isOpen && !initialData) {
      // Reset ao criar nova
      setFormData({
        descricao: '',
        valor: '',
        tipo: 'despesa',
        categoriaId: categoriasAPI.length > 0 ? categoriasAPI[0].id : '',
      });
    }
  }, [isOpen, initialData?.id]); // Apenas reagir a mudanças no isOpen e no ID

  // Bloquear scroll e interações quando modal estiver aberta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
      return () => {
        document.body.style.overflow = 'unset';
        document.body.style.pointerEvents = 'auto';
      };
    }
  }, [isOpen]);

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

  // Removido useEffect que causava loop infinito
  // Lógica movida para os onClick dos botões

  const tiposTransacao = [
    { value: 'receita', label: 'Receita', color: 'bg-emerald-500' },
    { value: 'despesa', label: 'Despesa', color: 'bg-red-500' },
  ];

  // Usar categorias reais da API com cores dinâmicas
  const categorias = categoriasAPI.map(cat => {
    const color = cat.cor || getCategoryColor(cat.nome); // ✅ USA COR SALVA
    return {
      value: cat.id,
      label: cat.nome,
      color: color,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descricao || !formData.valor || !formData.categoriaId) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    // Validar limite de orçamento para despesas
    if (formData.tipo === 'despesa') {
      const categoriaEscolhida = categoriasAPI.find(
        c => c.id === formData.categoriaId
      );

      if (
        categoriaEscolhida &&
        categoriaEscolhida.limite &&
        categoriaEscolhida.limite > 0
      ) {
        // Calcular gasto atual da categoria no mês
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();

        const gastoAtualCategoria = transacoes
          .filter(t => {
            const dataT = new Date(t.dataTransacao);
            return (
              t.tipo === 2 &&
              t.categoria?.id === formData.categoriaId &&
              dataT.getMonth() === mesAtual &&
              dataT.getFullYear() === anoAtual &&
              t.id !== initialData?.id
            ); // Excluir transação atual se estiver editando
          })
          .reduce(
            (sum, t) =>
              sum +
              (typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0),
            0
          );

        const novoValor = parseFloat(formData.valor);
        const novoTotal = gastoAtualCategoria + novoValor;
        const limite = categoriaEscolhida.limite;

        // BLOQUEAR se exceder o limite (backend não permite)
        if (novoTotal > limite) {
          toast({
            title: '🚫 Limite de Orçamento Excedido',
            description:
              `Esta despesa excede o limite da categoria "${categoriaEscolhida.nome}".\n\n` +
              `Gasto atual: R$ ${gastoAtualCategoria.toFixed(2)}\n` +
              `Nova despesa: R$ ${novoValor.toFixed(2)}\n` +
              `Total: R$ ${novoTotal.toFixed(2)}\n` +
              `Limite: R$ ${limite.toFixed(2)}\n` +
              `Excesso: R$ ${(novoTotal - limite).toFixed(2)}\n\n` +
              `Reduza o valor da despesa para continuar.`,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        // AVISAR se atingir exatamente o limite (80-100%)
        const percentualUsado = Math.round((novoTotal / limite) * 100);
        if (percentualUsado >= 80 && percentualUsado <= 100) {
          toast({
            title:
              percentualUsado === 100
                ? '⚠️ Limite de Orçamento Atingido'
                : '⚠️ Atenção: Próximo do Limite',
            description:
              `Categoria: ${categoriaEscolhida.nome}\n` +
              `Gasto atual: R$ ${gastoAtualCategoria.toFixed(2)}\n` +
              `Nova despesa: R$ ${novoValor.toFixed(2)}\n` +
              `Total: R$ ${novoTotal.toFixed(2)} (${percentualUsado}% do limite)\n` +
              `Limite: R$ ${limite.toFixed(2)}`,
            variant: percentualUsado === 100 ? 'default' : 'default',
          });
          // Continua normalmente, apenas avisa
        }
      }
    }

    setIsSubmitting(true);

    try {
      const transacaoData = {
        Id: initialData?.id, // ✅ Incluir ID para edição
        Descricao: formData.descricao,
        Valor: {
          Valor: parseFloat(formData.valor),
          Moeda: 'BRL',
        },
        DataTransacao: new Date().toISOString(),
        Tipo: formData.tipo === 'receita' ? 1 : 2,
        CategoriaId: formData.categoriaId,
        Observacoes: null,
      };

      let success: boolean;

      if (initialData?.id) {
        // Modo edição
        success = await updateTransacao(initialData.id, transacaoData);
      } else {
        // Modo criação
        success = await createTransacao(transacaoData);
      }

      if (success) {
        toast({
          title: 'Sucesso!',
          description: initialData?.id
            ? 'Transação atualizada com sucesso.'
            : 'Transação criada com sucesso.',
        });

        // Adicionar notificação persistente
        addNotification({
          tipo: initialData?.id ? 'info' : 'sucesso',
          titulo: initialData?.id
            ? 'Transação atualizada'
            : 'Nova transação criada',
          descricao: `${formData.descricao}: R$ ${parseFloat(formData.valor).toFixed(2)}`,
          link: '/transacoes',
        });

        // Reset form
        setFormData({
          descricao: '',
          valor: '',
          tipo: 'despesa',
          categoriaId: '',
        });

        if (onSubmit) onSubmit(formData);
        onClose();
      } else {
        toast({
          title: 'Erro',
          description: initialData?.id
            ? 'Não foi possível atualizar a transação.'
            : 'Não foi possível criar a transação.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error);

      // Tratar erro de limite excedido do backend
      const errorMessage = error?.message || error?.toString() || '';

      if (
        errorMessage.includes('limite') ||
        errorMessage.includes('orçamento') ||
        errorMessage.includes('excede')
      ) {
        toast({
          title: '🚫 Limite de Orçamento Excedido',
          description:
            'Esta transação excede o limite da categoria. O sistema não permite gastos acima do orçamento configurado.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro',
          description: initialData?.id
            ? 'Ocorreu um erro ao atualizar a transação.'
            : 'Ocorreu um erro ao criar a transação.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50'
      style={{
        pointerEvents: 'auto',
        width: '100vw',
        height: '100vh',
        minWidth: '100vw',
        minHeight: '100vh',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className='bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-600/30 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>
            {initialData ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button
            onClick={onClose}
            className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'
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

        <p className='text-sm text-slate-600 dark:text-slate-400 mb-6'>
          {initialData
            ? 'Edite os dados da transação abaixo.'
            : 'Adicione uma nova transação ao seu controle financeiro.'}
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1'>
              Descrição <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='descricao'
              value={formData.descricao}
              onChange={e => handleInputChange('descricao', e.target.value)}
              className='w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200'
              placeholder='Ex: Almoço no restaurante'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1'>
              Valor <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              name='valor'
              step='0.01'
              value={formData.valor}
              onChange={e => handleInputChange('valor', e.target.value)}
              className='w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200'
              placeholder='0,00'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1'>
              Tipo
            </label>
            <div className='relative'>
              <button
                type='button'
                onClick={() => {
                  setTipoDropdownOpen(!tipoDropdownOpen);
                  setCategoriaDropdownOpen(false);
                }}
                className='w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between'
              >
                <span className='flex items-center'>
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${tiposTransacao.find(t => t.value === formData.tipo)?.color || 'bg-gray-500'}`}
                  ></div>
                  {tiposTransacao.find(t => t.value === formData.tipo)?.label ||
                    'Selecione'}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${tipoDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {tipoDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl shadow-xl z-50 overflow-hidden'>
                  {tiposTransacao.map(tipo => (
                    <button
                      key={tipo.value}
                      type='button'
                      onClick={() => {
                        handleInputChange('tipo', tipo.value);
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
            <label className='block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1'>
              Categoria
            </label>
            <div className='relative'>
              <button
                type='button'
                onClick={() => {
                  setCategoriaDropdownOpen(!categoriaDropdownOpen);
                  setTipoDropdownOpen(false);
                }}
                className='w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between'
              >
                <span className='flex items-center'>
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${categorias.find(c => c.value === formData.categoriaId)?.color || 'bg-gray-500'}`}
                  ></div>
                  {categorias.find(c => c.value === formData.categoriaId)
                    ?.label || 'Selecione'}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${categoriaDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {categoriaDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto'>
                  {categorias.map(categoria => (
                    <button
                      key={categoria.value}
                      type='button'
                      onClick={() => {
                        handleInputChange('categoriaId', categoria.value);
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

          <div className='flex space-x-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-6 py-3 text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl font-medium transition-all duration-200 hover:scale-105'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting
                ? 'Salvando...'
                : initialData?.id
                  ? 'Salvar alterações'
                  : 'Criar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}

// Componente do botão de acesso rápido
export function NovaTransacaoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
    >
      <Plus className='h-4 w-4' />
      <span>Nova Transação</span>
    </button>
  );
}
