import { create } from 'zustand';
import { apiClient, handleApiError } from '@/lib/api';
import { PublicCalendarEntry } from '@/types';

interface PublicStore {
  entries: PublicCalendarEntry[];
  loading: boolean;
  error: string | null;
  fetchPublicCalendar: (lang?: string) => Promise<void>;
}

export const usePublicStore = create<PublicStore>((set) => ({
  entries: [],
  loading: false,
  error: null,
  
  fetchPublicCalendar: async (lang = 'en') => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.get<PublicCalendarEntry[]>(`/public/calendar?lang=${lang}`);
      set({ entries: data, loading: false });
    } catch (error) {
       set({ error: handleApiError(error), loading: false });
    }
  }
}));
