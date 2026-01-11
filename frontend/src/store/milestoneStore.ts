import { create } from 'zustand';
import { apiClient, handleApiError } from '@/lib/api';
import { Milestone, CreateMilestoneForm } from '@/types';

interface MilestoneState {
  milestones: Milestone[];
  loading: boolean;
  error: string | null;
  fetchMilestones: (electionId?: number) => Promise<void>;
  createMilestone: (data: CreateMilestoneForm) => Promise<void>;
  updateMilestone: (id: number, data: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: number) => Promise<void>;
}

export const useMilestoneStore = create<MilestoneState>((set) => ({
  milestones: [],
  loading: false,
  error: null,
  
  fetchMilestones: async (electionId) => {
    set({ loading: true, error: null });
    try {
      const url = electionId ? `/elections/${electionId}/milestones` : '/milestones';
      const data = await apiClient.get<Milestone[]>(url);
      set({ milestones: data, loading: false });
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },
  
  createMilestone: async (data) => {
    set({ loading: true, error: null });
    try {
        // Assuming POST /milestones creates a milestone
        const milestone = await apiClient.post<Milestone>('/milestones', data);
        set((state) => ({
            milestones: [...state.milestones, milestone],
            loading: false
        }));
    } catch (error) {
        set({ error: handleApiError(error), loading: false });
    }
  },

  updateMilestone: async (id, data) => {
    set({ loading: true, error: null });
    try {
        const updatedMilestone = await apiClient.put<Milestone>(`/milestones/${id}`, data);
        set((state) => ({
            milestones: state.milestones.map((m) => (m.id === id ? updatedMilestone : m)),
            loading: false
        }));
    } catch (error) {
        set({ error: handleApiError(error), loading: false });
    }
  },

  deleteMilestone: async (id) => {
    set({ loading: true, error: null });
    try {
        await apiClient.delete(`/milestones/${id}`);
        set((state) => ({
            milestones: state.milestones.filter((m) => m.id !== id),
            loading: false
        }));
    } catch (error) {
        set({ error: handleApiError(error), loading: false });
    }
  },
}));
