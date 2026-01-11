import { create } from 'zustand';
import { apiClient, handleApiError } from '@/lib/api';
import { ProgressReport } from '@/types';

interface ReportState {
  report: ProgressReport | null;
  loading: boolean;
  error: string | null;
  fetchReport: () => Promise<void>;
  downloadReport: (format: 'excel' | 'pdf') => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  report: null,
  loading: false,
  error: null,

  fetchReport: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.get<ProgressReport>('/reports/progress');
      set({ report: data, loading: false });
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },

  downloadReport: async (format) => {
    try {
       const url = `/reports/progress?format=${format}`;
       const filename = `progress_report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
       await apiClient.download(url, filename);
    } catch (error) {
      console.error('Download failed', error);
    }
  }
}));
