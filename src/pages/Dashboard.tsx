
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Users, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Protege rota para apenas nutricionistas
  useProtectedRoute({ allowedRoles: ['nutritionist', 'admin'] });
  
  // Dados de exemplo - seriam buscados do banco de dados
  const metricas = {
    totalPacientes: 24,
    consultasHoje: 5,
    consultasSemana: 18,
    pacientesNovos: 3,
  };
  
  // Exemplo de pacientes com próximas consultas
  const proximasConsultas = [
    { id: 1, nome: 'Maria Silva', data: '11/04/2025', horario: '09:00' },
    { id: 2, nome: 'João Santos', data: '11/04/2025', horario: '10:30' },
    { id: 3, nome: 'Ana Oliveira', data: '12/04/2025', horario: '14:00' },
    { id: 4, nome: 'Carlos Souza', data: '14/04/2025', horario: '16:00' },
  ];
  
  // Exemplo de pacientes com consultas recentes
  const consultasRecentes = [
    { id: 1, nome: 'Pedro Almeida', data: '10/04/2025', evoluiu: true },
    { id: 2, nome: 'Julia Costa', data: '10/04/2025', evoluiu: false },
    { id: 3, nome: 'Lucas Ferreira', data: '09/04/2025', evoluiu: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle. Aqui você pode gerenciar seus pacientes e consultas.
        </p>
      </div>
      
      {/* Cards de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalPacientes}</div>
            <p className="text-xs text-muted-foreground">
              +{metricas.pacientesNovos} novos nesta semana
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.consultasHoje}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Consultas da Semana</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.consultasSemana}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Taxa de Evolução</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">
              dos pacientes melhoraram indicadores
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Próximas consultas e consultas recentes */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximasConsultas.map((consulta) => (
                <div key={consulta.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-nutri-100 flex items-center justify-center text-nutri-700">
                    {consulta.nome.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{consulta.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {consulta.data} às {consulta.horario}
                    </p>
                  </div>
                  <Button variant="outline" className="h-8">
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Consultas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consultasRecentes.map((consulta) => (
                <div key={consulta.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-nutri-100 flex items-center justify-center text-nutri-700">
                    {consulta.nome.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{consulta.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {consulta.data}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    consulta.evoluiu 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {consulta.evoluiu ? 'Evoluiu' : 'Estável'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
