'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, LoginRequest, RegisterRequest } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Verificar se há token no localStorage ao carregar a página
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          apiClient.setToken(storedToken);

          // Buscar dados do usuário
          try {
            const response = await apiClient.getProfile();
            if (response.success && response.data) {
              setUser(response.data);
            } else {
              // Token inválido, limpar
              localStorage.removeItem('token');
              setToken(null);
              apiClient.setToken(null);
            }
          } catch (error) {
            console.error('Erro ao buscar perfil do usuário:', error);
            localStorage.removeItem('token');
            setToken(null);
            apiClient.setToken(null);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [mounted]);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(
        credentials.email,
        credentials.senha
      );

      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;

        setToken(newToken);
        setUser(userData);
        apiClient.setToken(newToken);

        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo, ${userData.nome}!`,
        });

        return true;
      } else {
        toast({
          title: 'Erro no login',
          description: response.message || 'Credenciais inválidas',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro no login',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(
        userData.nome,
        userData.email,
        userData.senha,
        userData.confirmarSenha
      );

      if (response.success && response.data) {
        const { token: newToken, user: newUser } = response.data;

        setToken(newToken);
        setUser(newUser);
        apiClient.setToken(newToken);

        toast({
          title: 'Conta criada com sucesso!',
          description: `Bem-vindo ao SpendWise, ${newUser.nome}!`,
        });

        return true;
      } else {
        toast({
          title: 'Erro ao criar conta',
          description: response.message || 'Erro ao criar conta',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      toast({
        title: 'Erro ao criar conta',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.setToken(null);
    localStorage.removeItem('token');

    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
