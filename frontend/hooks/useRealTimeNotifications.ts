import { useEffect, useRef } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { apiClient } from '@/lib/api/client';

interface NotificationSettings {
  emailTransacoes: boolean;
  emailLimites: boolean;
  pushNotifications: boolean;
}

export function useRealTimeNotifications() {
  const { addNotification } = useNotifications();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<Date>(new Date());
  const checkedNotificationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Carregar configurações de notificações
    const getSettings = (): NotificationSettings => {
      const stored = localStorage.getItem('notificationSettings');
      if (stored) {
        return JSON.parse(stored) as NotificationSettings;
      }
      return {
        emailTransacoes: true,
        emailLimites: true,
        pushNotifications: false,
      };
    };

    // Verificar novas transações
    const checkNewTransactions = async () => {
      try {
        const settings = getSettings();
        if (!settings.emailTransacoes) return;

        const response = await apiClient.getTransacoes({
          pageNumber: 1,
          pageSize: 5,
        });

        if (response.success && response.data?.data) {
          response.data.data.forEach((transacao: any) => {
            const transacaoDate = new Date(transacao.dataTransacao);
            const notificationKey = `transaction-${transacao.id}`;

            if (
              transacaoDate > lastCheckRef.current &&
              !checkedNotificationsRef.current.has(notificationKey)
            ) {
              addNotification({
                tipo: 'info',
                titulo: 'Nova transação registrada',
                descricao: `${transacao.descricao}: R$ ${transacao.valor.toFixed(2)}`,
                link: '/transacoes',
              });
              checkedNotificationsRef.current.add(notificationKey);
            }
          });
        }
      } catch (error) {
        console.error('Erro ao verificar transações:', error);
      }
    };

    // Verificar limites de orçamento
    const checkBudgetLimits = async () => {
      try {
        const settings = getSettings();
        if (!settings.emailLimites) return;

        const currentDate = new Date();
        const anoMes = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

        const response = await apiClient.getEstatisticasCategorias(anoMes);

        if (response.success && response.data) {
          const { categorias } = response.data;

          categorias?.forEach(cat => {
            const percentual = cat.percentualUtilizado;
            const notificationKey = `budget-${cat.categoriaId}-${Math.floor(percentual / 10)}`;

            if (
              percentual >= 80 &&
              percentual < 100 &&
              !checkedNotificationsRef.current.has(notificationKey)
            ) {
              addNotification({
                tipo: 'alerta',
                titulo: 'Orçamento atingindo limite',
                descricao: `${cat.nome}: ${percentual.toFixed(0)}% utilizado`,
                link: '/orcamento',
              });
              checkedNotificationsRef.current.add(notificationKey);
            } else if (
              percentual >= 100 &&
              !checkedNotificationsRef.current.has(notificationKey)
            ) {
              addNotification({
                tipo: 'erro',
                titulo: 'Orçamento excedido!',
                descricao: `${cat.nome}: ${percentual.toFixed(0)}% utilizado`,
                link: '/orcamento',
              });
              checkedNotificationsRef.current.add(notificationKey);
            }
          });
        }
      } catch (error) {
        console.error('Erro ao verificar orçamentos:', error);
      }
    };

    // Executar verificações
    const runChecks = () => {
      checkNewTransactions();
      checkBudgetLimits();
      lastCheckRef.current = new Date();
    };

    // Executar imediatamente
    runChecks();

    // Verificar a cada 2 minutos
    checkIntervalRef.current = setInterval(runChecks, 120000);

    // Limpar ao desmontar
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [addNotification]);
}
