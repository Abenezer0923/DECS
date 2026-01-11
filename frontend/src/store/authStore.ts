import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';
import { User, LoginCredentials, AuthResponse } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (credentials) => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        localStorage.setItem('token', response.token);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
