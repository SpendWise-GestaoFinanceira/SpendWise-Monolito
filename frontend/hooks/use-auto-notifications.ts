import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useCategorias } from '@/hooks/use-categorias';
import { useTransacoes } from '@/hooks/use-transacoes';

/**
 * Hook que gera notificações automáticas baseadas em eventos do sistema
 */
export function useAutoNotifications() {
  const { addNotification } = useNotifications();
  const { categorias } = useCategorias();
  const { transacoes } = useTransacoes();

  // Notificação quando uma categoria atinge 80% do limite
  useEffect(() => {
    if (!categorias || !transacoes) return;

    // Verificar se alertas de limite estão ativados
    const settings = localStorage.getItem('notificationSettings');
    const notificationSettings = settings
      ? JSON.parse(settings)
      : { emailLimites: true };

    if (!notificationSettings.emailLimites) return;

    // Filtrar transações do mês atual
    const currentDate = new Date();
    const transacoesDoMes = transacoes.filter(t => {
      const dataTransacao = new Date(t.dataTransacao);
      return (
        dataTransacao.getMonth() === currentDate.getMonth() &&
        dataTransacao.getFullYear() === currentDate.getFullYear()
      );
    });

    categorias.forEach(categoria => {
      if (!categoria.limite) return;

      const gastos = transacoesDoMes
        .filter(t => t.categoriaId === categoria.id && t.tipo === 2) // Despesas
        .reduce((sum, t) => {
          const valor =
            typeof t.valor === 'number' ? t.valor : t.valor?.valor || 0;
          return sum + valor;
        }, 0);

      const percentual = (gastos / categoria.limite) * 100;

      // Notificar quando atingir 80%
      if (percentual >= 80 && percentual < 100) {
        const key = `limite-80-${categoria.id}-${currentDate.getMonth()}-${currentDate.getFullYear()}`;
        const alreadyNotified = localStorage.getItem(key);

        if (!alreadyNotified) {
          addNotification({
            tipo: 'alerta',
            titulo: 'Orçamento atingindo limite',
            descricao: `${categoria.nome}: ${percentual.toFixed(0)}% utilizado`,
            link: '/orcamento',
          });
          localStorage.setItem(key, 'true');
        }
      }

      // Notificar quando ultrapassar 100%
      if (percentual >= 100) {
        const key = `limite-100-${categoria.id}-${currentDate.getMonth()}-${currentDate.getFullYear()}`;
        const alreadyNotified = localStorage.getItem(key);

        if (!alreadyNotified) {
          addNotification({
            tipo: 'erro',
            titulo: 'Limite ultrapassado!',
            descricao: `${categoria.nome}: ${percentual.toFixed(0)}% do orçamento`,
            link: '/orcamento',
          });
          localStorage.setItem(key, 'true');
        }
      }
    });
  }, [categorias, transacoes, addNotification]);

  // Notificação de boas-vindas (apenas uma vez)
  useEffect(() => {
    const welcomed = localStorage.getItem('welcomed');
    if (!welcomed) {
      setTimeout(() => {
        addNotification({
          tipo: 'sucesso',
          titulo: 'Bem-vindo ao SpendWise!',
          descricao:
            'Configure suas categorias e comece a controlar suas finanças.',
          link: '/categorias',
        });
        localStorage.setItem('welcomed', 'true');
      }, 2000);
    }
  }, [addNotification]);

  // Notificação quando uma nova transação é criada
  useEffect(() => {
    const lastCount = parseInt(
      localStorage.getItem('lastTransactionCount') || '0'
    );
    const currentCount = transacoes?.length || 0;

    if (currentCount > lastCount && lastCount > 0) {
      const diff = currentCount - lastCount;
      addNotification({
        tipo: 'info',
        titulo:
          diff === 1 ? 'Nova transação registrada' : `${diff} novas transações`,
        descricao: 'Sua lista foi atualizada',
        link: '/transacoes',
      });
    }

    if (currentCount > 0) {
      localStorage.setItem('lastTransactionCount', currentCount.toString());
    }
  }, [transacoes, addNotification]);
}
