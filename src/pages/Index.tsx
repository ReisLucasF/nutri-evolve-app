
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (user) {
      // Redireciona com base no tipo de usuário
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'nutritionist') {
        navigate('/dashboard');
      } else if (user.role === 'patient') {
        navigate('/meu-perfil');
      }
    } else {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Exibe um loader enquanto verifica o status de autenticação
  return (
    <div className="min-h-screen flex items-center justify-center bg-nutri-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-nutri-700 mb-4">NutriEvolve</h1>
        <div className="animate-pulse text-nutri-600">Carregando...</div>
      </div>
    </div>
  );
};

export default Index;
