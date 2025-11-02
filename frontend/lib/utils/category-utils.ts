/**
 * Utilitários para Categorias
 */

/**
 * Gera cor consistente baseada no nome da categoria
 */
export function getCategoryColor(categoryName: string): string {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];

  // Gerar hash simples do nome
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Usar hash para escolher cor
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Mapeia dados de categoria do backend para frontend
 */
export function mapCategoriaFromBackend(categoria: any): any {
  return {
    id: categoria.id,
    nome: categoria.nome,
    descricao: categoria.descricao,
    tipo: categoria.tipo,
    limite: categoria.limite || 0, // Backend retorna decimal ou null
    usuarioId: categoria.usuarioId,
    isAtiva: categoria.isAtiva,
    createdAt: categoria.createdAt,
    updatedAt: categoria.updatedAt,
    // Campos calculados para UI
    gasto: 0, // Será preenchido por outra query
    cor: getCategoryColor(categoria.nome),
  };
}

/**
 * Retorna label amigável do tipo de categoria
 */
export function getTipoCategoriaLabel(tipo: 1 | 2): string {
  return tipo === 1 ? 'Receita' : 'Despesa';
}

/**
 * Retorna cor do tipo de categoria
 */
export function getTipoCategoriaColor(tipo: 1 | 2): string {
  return tipo === 1 ? 'text-emerald-500' : 'text-red-500';
}

/**
 * Calcula percentual de uso do limite
 */
export function calcularPercentualLimite(
  gasto: number,
  limite?: number
): number {
  if (!limite || limite === 0) return 0;
  return Math.min(100, Math.round((gasto / limite) * 100));
}

/**
 * Retorna cor da barra de progresso baseada no percentual
 */
export function getProgressBarColor(percentual: number): string {
  if (percentual >= 95) return 'bg-red-500';
  if (percentual >= 85) return 'bg-orange-500';
  if (percentual >= 70) return 'bg-yellow-500';
  return 'bg-emerald-500';
}
