import { describe, it, expect } from '@jest/globals';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('deve mesclar classes corretamente', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('deve remover classes undefined', () => {
      const result = cn('text-red-500', undefined, 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('deve lidar com classes condicionais', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('active-class');
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar valor positivo', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('1.234,56');
      expect(result).toContain('R$');
    });

    it('deve formatar valor negativo', () => {
      const result = formatCurrency(-1234.56);
      expect(result).toContain('1.234,56');
      expect(result).toContain('-');
    });

    it('deve formatar zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0,00');
      expect(result).toContain('R$');
    });

    it('deve formatar valores decimais', () => {
      const result = formatCurrency(99.99);
      expect(result).toContain('99,99');
    });
  });

  describe('formatDate', () => {
    it('deve formatar data DD/MM/YYYY', () => {
      const date = new Date('2025-10-15');
      const result = formatDate(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve formatar data completa', () => {
      const date = new Date('2025-10-15');
      const result = formatDate(date, 'full');
      expect(result).toContain('2025');
    });

    it('deve formatar apenas mês/ano', () => {
      const date = new Date('2025-10-15');
      const result = formatDate(date, 'month-year');
      expect(result).toContain('2025');
    });
  });
});
