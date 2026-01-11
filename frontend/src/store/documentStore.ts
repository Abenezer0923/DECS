import { create } from 'zustand';
import { apiClient, handleApiError } from '@/lib/api';
import { Document } from '@/types';

interface DocumentState {
  documents: Record<number, Document[]>; // grouped by milestoneId
  loading: boolean;
  error: string | null;
  fetchDocuments: (milestoneId: number) => Promise<void>;
  uploadDocument: (milestoneId: number, file: File) => Promise<void>;
  deleteDocument: (id: number, milestoneId: number) => Promise<void>;
  downloadDocument: (id: number, filename: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: {},
  loading: false,
  error: null,

  fetchDocuments: async (milestoneId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.get<Document[]>(`/documents/milestone/${milestoneId}`);
      set((state) => ({
        documents: {
          ...state.documents,
          [milestoneId]: data
        },
        loading: false
      }));
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
    }
  },

  uploadDocument: async (milestoneId, file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('milestoneId', milestoneId.toString());
      formData.append('file', file);

      const newDoc = await apiClient.upload<Document>('/documents/upload', formData);
      
      set((state) => {
        const existing = state.documents[milestoneId] || [];
        return {
          documents: {
            ...state.documents,
            [milestoneId]: [newDoc, ...existing]
          },
          loading: false
        };
      });
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
      throw error;
    }
  },

  deleteDocument: async (id, milestoneId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/documents/${id}`);
      set((state) => ({
        documents: {
          ...state.documents,
          [milestoneId]: state.documents[milestoneId]?.filter(d => d.id !== id) || []
        },
        loading: false
      }));
    } catch (error) {
      set({ error: handleApiError(error), loading: false });
      throw error;
    }
  },

  downloadDocument: async (id, filename) => {
      try {
          await apiClient.download(`/documents/download/${id}`, filename);
      } catch (error) {
          console.error('Download failed', error);
      }
  }
}));
