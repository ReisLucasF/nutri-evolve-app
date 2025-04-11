
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut, 
  Home, 
  User, 
  BookOpen,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';

type SidebarProps = {
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout, isAdmin, isNutritionist, isPatient } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-border w-64">
      {/* Logo e botão de fechar (em mobile) */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="font-bold text-xl text-primary">NutriEvolve</div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        )}
      </div>

      {/* Links de navegação */}
      <nav className="flex-1 p-4 space-y-1">
        {isAdmin() && (
          <>
            <NavLink 
              to="/admin" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/admin/nutricionistas" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <Users size={20} />
              <span>Nutricionistas</span>
            </NavLink>
          </>
        )}

        {isNutritionist() && (
          <>
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/pacientes" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <Users size={20} />
              <span>Pacientes</span>
            </NavLink>
            <NavLink 
              to="/agendamentos" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <Calendar size={20} />
              <span>Agendamentos</span>
            </NavLink>
            <NavLink 
              to="/planos-alimentares" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <FileText size={20} />
              <span>Planos Alimentares</span>
            </NavLink>
          </>
        )}

        {isPatient() && (
          <>
            <NavLink 
              to="/meu-perfil" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <User size={20} />
              <span>Meu Perfil</span>
            </NavLink>
            <NavLink 
              to="/minha-evolucao" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <BarChart3 size={20} />
              <span>Minha Evolução</span>
            </NavLink>
            <NavLink 
              to="/meus-planos" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <BookOpen size={20} />
              <span>Planos Alimentares</span>
            </NavLink>
            <NavLink 
              to="/minhas-consultas" 
              className={({isActive}) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <Calendar size={20} />
              <span>Consultas</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Rodapé da Sidebar */}
      <div className="p-4 border-t border-border">
        <NavLink 
          to="/configuracoes" 
          className={({isActive}) => 
            `sidebar-link ${isActive ? 'active' : ''}`
          }
          onClick={isMobile ? onClose : undefined}
        >
          <Settings size={20} />
          <span>Configurações</span>
        </NavLink>
        <button 
          onClick={() => {
            logout();
            if (isMobile) onClose();
          }} 
          className="sidebar-link w-full text-left mt-2"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
