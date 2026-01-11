import { create } from 'zustand';
import { apiClient, handleApiError } from '@/lib/api';
import { AuditLog } from '@/types';

interface AuditState {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
  fetchLogs: (filters?: { entityTable?: string; userId?: string; limit?: number }) => Promise<void>;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  loading: false,
  error: null,

  fetchLogs: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const { entityTable, userId, limit } = filters;
      const params = new URLSearchParams();
      if (entityTable) params.append('entityTable', entityTable);
      if (userId) params.append('userId', userId);
      if (limit) params.append('limit', limit.toString());

      const data = await apiClient.get<AuditLog[]>(`/audit-logs?${params.toString()}`);
      set({ logs: data, loading: false });
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },
}));
