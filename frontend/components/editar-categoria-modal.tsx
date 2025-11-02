'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

interface EditarCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria?: {
    id?: string;
    nome: string;
    tipo: string;
    cor?: string;
    limiteDefinido: boolean;
    limiteMensal?: number;
    gastoAtual?: number;
  };
  onSubmit?: (categoria: {
    nome: string;
    tipo: string;
    cor: string;
    limiteDefinido: boolean;
    limiteMensal?: number;
  }) => void;
}

export function EditarCategoriaModal({
  isOpen,
  onClose,
  categoria,
  onSubmit,
}: EditarCategoriaModalProps) {
  const [formData, setFormData] = useState({
    nome: categoria?.nome || '',
    tipo: categoria?.tipo || 'Essencial',
    cor: categoria?.cor || 'bg-blue-500',
    limiteDefinido: categoria?.limiteDefinido || false,
    limiteMensal: categoria?.limiteMensal?.toString() || '',
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

  const coresDisponiveis = [
    { value: 'bg-blue-500', label: 'Azul', color: 'bg-blue-500' },
    { value: 'bg-green-500', label: 'Verde', color: 'bg-green-500' },
    { value: 'bg-orange-500', label: 'Laranja', color: 'bg-orange-500' },
    { value: 'bg-purple-500', label: 'Roxo', color: 'bg-purple-500' },
    { value: 'bg-red-500', label: 'Vermelho', color: 'bg-red-500' },
    { value: 'bg-yellow-500', label: 'Amarelo', color: 'bg-yellow-500' },
    { value: 'bg-indigo-500', label: 'Índigo', color: 'bg-indigo-500' },
    { value: 'bg-pink-500', label: 'Rosa', color: 'bg-pink-500' },
    { value: 'bg-teal-500', label: 'Teal', color: 'bg-teal-500' },
    { value: 'bg-gray-500', label: 'Cinza', color: 'bg-gray-500' },
  ];

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
        (dropdownOpen || colorDropdownOpen) &&
        !(event.target as Element).closest('.relative')
      ) {
        setDropdownOpen(false);
        setColorDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, colorDropdownOpen]);

  // Fechar outros dropdowns quando um é aberto
  useEffect(() => {
    if (dropdownOpen) {
      setColorDropdownOpen(false);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (colorDropdownOpen) {
      setDropdownOpen(false);
    }
  }, [colorDropdownOpen]);

  // Hydrate when opening or when categoria changes
  useEffect(() => {
    if (isOpen && categoria) {
      setFormData({
        nome: categoria.nome || '',
        tipo: categoria.tipo || 'Essencial',
        cor: categoria.cor || 'bg-blue-500',
        limiteDefinido: !!categoria.limiteDefinido,
        limiteMensal:
          categoria.limiteMensal !== undefined
            ? String(categoria.limiteMensal)
            : '',
      });
    }
  }, [isOpen, categoria]);

  const tiposCategoria = [
    { value: 'Essencial', label: 'Essencial', color: 'bg-emerald-500' },
    { value: 'Supérfluo', label: 'Supérfluo', color: 'bg-blue-500' },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert('Por favor, preencha o nome da categoria.');
      return;
    }

    const categoriaData = {
      nome: formData.nome.trim(),
      tipo: formData.tipo,
      cor: formData.cor,
      limiteDefinido: formData.limiteDefinido,
      limiteMensal:
        formData.limiteDefinido && formData.limiteMensal
          ? parseFloat(formData.limiteMensal)
          : undefined,
    };

    if (onSubmit) {
      onSubmit(categoriaData);
    }

    onClose();
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
            Editar Categoria
          </h2>
          <button
            onClick={onClose}
            className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <p className='text-sm text-slate-600 dark:text-slate-400 mb-6'>
          Faça alterações na categoria selecionada.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1'>
              Nome da Categoria
            </label>
            <input
              type='text'
              value={formData.nome}
              onChange={e => handleInputChange('nome', e.target.value)}
              className='w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200'
              placeholder='Ex: Mercado'
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
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between'
              >
                <span className='flex items-center'>
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${tiposCategoria.find(t => t.value === formData.tipo)?.color}`}
                  ></div>
                  {tiposCategoria.find(t => t.value === formData.tipo)?.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl shadow-xl z-50 overflow-hidden'>
                  {tiposCategoria.map(tipo => (
                    <button
                      key={tipo.value}
                      type='button'
                      onClick={() => {
                        handleInputChange('tipo', tipo.value);
                        setDropdownOpen(false);
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
              Cor da Categoria
            </label>
            <div className='relative'>
              <button
                type='button'
                onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                className='w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 flex items-center justify-between'
              >
                <span className='flex items-center'>
                  <div
                    className={`w-4 h-4 rounded-full mr-3 ${formData.cor}`}
                  ></div>
                  {coresDisponiveis.find(c => c.value === formData.cor)?.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${colorDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {colorDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl shadow-xl z-50 overflow-hidden'>
                  <div className='grid grid-cols-5 gap-2 p-3'>
                    {coresDisponiveis.map(cor => (
                      <button
                        key={cor.value}
                        type='button'
                        onClick={() => {
                          handleInputChange('cor', cor.value);
                          setColorDropdownOpen(false);
                        }}
                        className='w-8 h-8 rounded-full hover:scale-110 transition-transform duration-200 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                        title={cor.label}
                      >
                        <div
                          className={`w-full h-full rounded-full ${cor.color}`}
                        ></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-slate-900 dark:text-slate-100'>
              Definir limite mensal
            </span>
            <button
              type='button'
              onClick={() =>
                handleInputChange('limiteDefinido', !formData.limiteDefinido)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                formData.limiteDefinido
                  ? 'bg-emerald-600'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.limiteDefinido ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {formData.limiteDefinido && (
            <div>
              <label className='block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1'>
                Limite Mensal
              </label>
              <input
                type='number'
                step='0.01'
                value={formData.limiteMensal}
                onChange={e =>
                  handleInputChange('limiteMensal', e.target.value)
                }
                className='w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200'
                placeholder='R$ 0,00'
              />
            </div>
          )}

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
              className='flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl'
            >
              Salvar Alterações
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
