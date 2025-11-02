// Sistema centralizado de cores para categorias
// Usado tanto nos gráficos quanto nas interfaces

export const CATEGORY_COLORS = {
  Alimentação: {
    tailwind: 'bg-orange-500',
    hex: '#f97316',
    chartColor: '#f97316',
  },
  Transporte: {
    tailwind: 'bg-blue-500',
    hex: '#3b82f6',
    chartColor: '#3b82f6',
  },
  Entretenimento: {
    tailwind: 'bg-purple-500',
    hex: '#a855f7',
    chartColor: '#a855f7',
  },
  Educação: {
    tailwind: 'bg-indigo-500',
    hex: '#6366f1',
    chartColor: '#6366f1',
  },
  Saúde: {
    tailwind: 'bg-green-500',
    hex: '#22c55e',
    chartColor: '#22c55e',
  },
  Trabalho: {
    tailwind: 'bg-yellow-500',
    hex: '#eab308',
    chartColor: '#eab308',
  },
  Mercado: {
    tailwind: 'bg-teal-500',
    hex: '#14b8a6',
    chartColor: '#14b8a6',
  },
  Lazer: {
    tailwind: 'bg-pink-500',
    hex: '#ec4899',
    chartColor: '#ec4899',
  },
  Outros: {
    tailwind: 'bg-gray-500',
    hex: '#6b7280',
    chartColor: '#6b7280',
  },
  Todas: {
    tailwind: 'bg-slate-500',
    hex: '#64748b',
    chartColor: '#64748b',
  },
} as const;

export const AVAILABLE_COLORS = [
  { value: 'bg-blue-500', label: 'Azul', hex: '#3b82f6' },
  { value: 'bg-green-500', label: 'Verde', hex: '#22c55e' },
  { value: 'bg-orange-500', label: 'Laranja', hex: '#f97316' },
  { value: 'bg-purple-500', label: 'Roxo', hex: '#a855f7' },
  { value: 'bg-red-500', label: 'Vermelho', hex: '#ef4444' },
  { value: 'bg-yellow-500', label: 'Amarelo', hex: '#eab308' },
  { value: 'bg-indigo-500', label: 'Índigo', hex: '#6366f1' },
  { value: 'bg-pink-500', label: 'Rosa', hex: '#ec4899' },
  { value: 'bg-teal-500', label: 'Teal', hex: '#14b8a6' },
  { value: 'bg-gray-500', label: 'Cinza', hex: '#6b7280' },
] as const;

// Função para obter cor de uma categoria
export function getCategoryColor(categoryName: string): string {
  return (
    CATEGORY_COLORS[categoryName as keyof typeof CATEGORY_COLORS]?.tailwind ||
    'bg-gray-500'
  );
}

// Função para obter cor hex de uma categoria (para gráficos)
export function getCategoryHexColor(categoryName: string): string {
  return (
    CATEGORY_COLORS[categoryName as keyof typeof CATEGORY_COLORS]?.hex ||
    '#6b7280'
  );
}

// Função para obter todas as cores das categorias para gráficos
export function getCategoryChartColors(categories: string[]): string[] {
  return categories.map(category => getCategoryHexColor(category));
}
