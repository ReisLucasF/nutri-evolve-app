
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from './use-toast';

interface UseProtectedRouteOptions {
  allowedRoles?: Array<'admin' | 'nutritionist' | 'patient'>;
  redirectTo?: string;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { allowedRoles = ['admin', 'nutritionist', 'patient'], redirectTo = '/login' } = options;

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'Acesso restrito',
        description: 'Você precisa estar logado para acessar esta página.',
        variant: 'destructive',
      });
      navigate(redirectTo);
    } else if (!loading && user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        toast({
          title: 'Acesso negado',
          description: 'Você não tem permissão para acessar esta página.',
          variant: 'destructive',
        });
        
        // Redireciona para a página apropriada com base na função do usuário
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'nutritionist') {
          navigate('/dashboard');
        } else if (user.role === 'patient') {
          navigate('/meu-perfil');
        } else {
          navigate('/');
        }
      }
    }
  }, [loading, user, allowedRoles, navigate, redirectTo]);

  return { isAuthenticated: !!user, user, loading };
};
