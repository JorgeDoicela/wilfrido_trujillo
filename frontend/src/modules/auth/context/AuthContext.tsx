import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '@/shared/lib/api';
import type { User, AuthResponse } from '@/shared/types/auth.types';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'wt_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<User>('/auth/profile');
        setUser(response.data);
        setToken(storedToken);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  const login = async (identificationOrEmail: string, password: string): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      identificationOrEmail,
      password,
    });

    const { accessToken, user: loggedUser } = response.data;
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (data: {
    email: string;
    identification: string;
    fullName: string;
    password: string;
    roleKey?: string;
  }): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { accessToken, user: registeredUser } = response.data;
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  // Método auxiliar para testing y demostraciones en UI
  const setUserDirectlyForDemo = (mockUser: User | null) => {
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUserDirectlyForDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
