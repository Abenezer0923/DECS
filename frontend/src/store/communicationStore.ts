import { create } from 'zustand';
import { apiClient, handleApiError } from '@/lib/api';
import { CommunicationAction, CreateCommunicationForm } from '@/types';

interface CommunicationState {
  communications: CommunicationAction[];
  loading: boolean;
  error: string | null;
  fetchCommunications: (milestoneId?: number) => Promise<void>;
  createCommunication: (data: CreateCommunicationForm) => Promise<void>;
  updateCommunication: (id: number, data: Partial<CommunicationAction>) => Promise<void>;
  deleteCommunication: (id: number) => Promise<void>;
}

export const useCommunicationStore = create<CommunicationState>((set) => ({
  communications: [],
  loading: false,
  error: null,
  
  fetchCommunications: async (milestoneId) => {
    set({ loading: true, error: null });
    try {
      const params = milestoneId ? { params: { milestoneId } } : {};
      const data = await apiClient.get<CommunicationAction[]>('/communications', params);
      set({ communications: data, loading: false });
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },
  
  createCommunication: async (data) => {
    set({ loading: true, error: null });
    try {
      const comm = await apiClient.post<CommunicationAction>('/communications', data);
      set((state) => ({
        communications: [...state.communications, comm],
        loading: false
      }));
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
      throw error;
    }
  },

  updateCommunication: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedComm = await apiClient.put<CommunicationAction>(`/communications/${id}`, data);
      set((state) => ({
        communications: state.communications.map((c) => 
          c.id === id ? updatedComm : c
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
      throw error;
    }
  },

  deleteCommunication: async (id) => {
    set({ loading: true, error: null });
    try {
        await apiClient.delete(`/communications/${id}`);
        set((state) => ({
            communications: state.communications.filter((c) => c.id !== id),
            loading: false
        }));
    } catch (error) {
        set({ error: handleApiError(error), loading: false });
    }
  },
}));
