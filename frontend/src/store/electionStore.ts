import { create } from 'zustand';
import { apiClient, handleApiError } from '@/lib/api';
import { ElectionCycle, CreateElectionForm } from '@/types';

interface ElectionState {
  elections: ElectionCycle[];
  currentElection: ElectionCycle | null;
  loading: boolean;
  error: string | null;
  fetchElections: () => Promise<void>;
  createElection: (data: CreateElectionForm) => Promise<void>;
  updateElection: (id: number, data: Partial<ElectionCycle>) => Promise<void>;
  deleteElection: (id: number) => Promise<void>;
  setCurrentElection: (election: ElectionCycle | null) => void;
}

export const useElectionStore = create<ElectionState>((set, get) => ({
  elections: [],
  currentElection: null,
  loading: false,
  error: null,
  
  fetchElections: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.get<ElectionCycle[]>('/elections');
      set({ elections: data, loading: false });
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },
  
  createElection: async (data) => {
    set({ loading: true, error: null });
    try {
      const election = await apiClient.post<ElectionCycle>('/elections', data);
      set((state) => ({
        elections: [...state.elections, election],
        loading: false
      }));
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },

  updateElection: async (id, data) => {
    set({ loading: true, error: null });
    try {
        const updatedElection = await apiClient.put<ElectionCycle>(`/elections/${id}`, data);
        set((state) => ({
            elections: state.elections.map((e) => (e.id === id ? updatedElection : e)),
            currentElection: state.currentElection?.id === id ? updatedElection : state.currentElection,
            loading: false
        }));
    } catch (error) {
        set({ error: handleApiError(error), loading: false });
    }
  },

  deleteElection: async (id) => {
    set({ loading: true, error: null });
    try {
        await apiClient.delete(`/elections/${id}`);
        set((state) => ({
            elections: state.elections.filter((e) => e.id !== id),
            currentElection: state.currentElection?.id === id ? null : state.currentElection,
            loading: false
        }));
    } catch (error) {
        set({ error: handleApiError(error), loading: false });
    }
  },
  
  setCurrentElection: (election) => set({ currentElection: election }),
}));
