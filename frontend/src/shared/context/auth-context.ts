import { createContext } from 'react';
import type { User } from '@/shared/types/auth.types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identificationOrEmail: string, password: string) => Promise<User>;
  register: (data: {
    email: string;
    identification: string;
    fullName: string;
    password: string;
    roleKey?: string;
  }) => Promise<User>;
  logout: () => void;
  setUserDirectlyForDemo: (mockUser: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
