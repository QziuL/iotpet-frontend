import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockGetAlerts } from '@/mocks/alerts.mock';
import type { Alert } from '@/types/alert.types';

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: mockGetAlerts,
    refetchInterval: 30000, // Refresh every 30s to simulate new alerts
  });
}

// Emulação de marcar como lido
export function useMarkAlertAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: string) => {
      // Em uma API real: axios.put(`/alerts/${alertId}/read`)
      await new Promise(r => setTimeout(r, 300));
      return alertId;
    },
    onMutate: async (alertId) => {
      await qc.cancelQueries({ queryKey: ['alerts'] });
      const previousAlerts = qc.getQueryData<Alert[]>(['alerts']);
      
      if (previousAlerts) {
        qc.setQueryData<Alert[]>(
          ['alerts'],
          previousAlerts.map(a => a.id === alertId ? { ...a, read: true } : a)
        );
      }
      return { previousAlerts };
    },
    onError: (err, alertId, context) => {
      if (context?.previousAlerts) {
        qc.setQueryData(['alerts'], context.previousAlerts);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
