import { create } from 'zustand';
import { apiClient, handleApiError } from '@/lib/api';
import { RiskResponse, RiskResponseType } from '@/types';

interface CreateRiskResponseForm {
  milestoneId: number;
  content: string;
  type: RiskResponseType;
}

interface RiskState {
  riskResponses: Record<number, RiskResponse[]>; // grouped by milestoneId
  loading: boolean;
  error: string | null;
  fetchRiskResponses: (milestoneId: number) => Promise<void>;
  createRiskResponse: (data: CreateRiskResponseForm) => Promise<void>;
  deleteRiskResponse: (id: number, milestoneId: number) => Promise<void>;
}

export const useRiskStore = create<RiskState>((set, get) => ({
  riskResponses: {},
  loading: false,
  error: null,

  fetchRiskResponses: async (milestoneId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.get<RiskResponse[]>(`/risk-responses/milestone/${milestoneId}`);
      set((state) => ({
        riskResponses: {
          ...state.riskResponses,
          [milestoneId]: data
        },
        loading: false
      }));
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },

  createRiskResponse: async (data) => {
    set({ loading: true, error: null });
    try {
      const newResponse = await apiClient.post<RiskResponse>('/risk-responses', data);
      set((state) => {
        const existing = state.riskResponses[data.milestoneId] || [];
        return {
          riskResponses: {
            ...state.riskResponses,
            [data.milestoneId]: [newResponse, ...existing]
          },
          loading: false
        };
      });
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
      throw error;
    }
  },

  deleteRiskResponse: async (id, milestoneId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/risk-responses/${id}`);
      set((state) => ({
        riskResponses: {
            ...state.riskResponses,
            [milestoneId]: state.riskResponses[milestoneId]?.filter(r => r.id !== id) || []
        },
        loading: false
      }));
    } catch (error) {
       set({ error: handleApiError(error), loading: false });
    }
  }
}));
