
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '../hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'nutritionist' | 'patient';
  crn?: string;
  createdAt: Date;
  nutritionistId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isNutritionist: () => boolean;
  isPatient: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de usuário admin padrão
const DEFAULT_ADMIN = {
  id: '1',
  name: 'Admin',
  email: 'admin@nutrievolve.app',
  role: 'admin' as const,
  createdAt: new Date(),
};

// Senha padrão: 123456

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está armazenado localmente
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao analisar usuário armazenado:', error);
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulação de login - Futuramente integrar com Neon Postgres
      if (email === DEFAULT_ADMIN.email && password === '123456') {
        setUser(DEFAULT_ADMIN);
        localStorage.setItem('user', JSON.stringify(DEFAULT_ADMIN));
        toast({
          title: 'Login realizado com sucesso',
          description: `Bem-vindo(a), ${DEFAULT_ADMIN.name}!`,
        });
        return;
      }
      
      // Futuramente, aqui será implementada a autenticação com o banco de dados
      
      throw new Error('Credenciais inválidas');
    } catch (error) {
      let message = 'Falha na autenticação';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: 'Erro de login',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
  };

  const isAdmin = () => user?.role === 'admin';
  const isNutritionist = () => user?.role === 'nutritionist';
  const isPatient = () => user?.role === 'patient';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isNutritionist,
        isPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
