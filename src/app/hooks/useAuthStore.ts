import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  hasBiometrics: boolean; // Flag de biometria
  login: () => void;
  logout: () => void;
  registerBiometrics: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      hasBiometrics: false,

      login: () => set({ 
        isAuthenticated: true, 
        user: { 
          id: 'usr_biometric_001',
          name: 'Admin User', 
          email: 'admin@imobhunter.com',
          role: 'CEO',
          plan: 'enterprise',
          avatar: 'https://github.com/shadcn.png'
        } 
      }),

      logout: () => set({ isAuthenticated: false, user: null }),

      registerBiometrics: () => set({ hasBiometrics: true }),
    }),
    {
      name: 'imob-auth-v3', // v3 para resetar
      storage: createJSONStorage(() => localStorage),
    }
  )
);
