
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  CalendarPlus 
} from 'lucide-react';
import { Paciente } from '@/models';

const Patients = () => {
  useProtectedRoute({ allowedRoles: ['nutritionist', 'admin'] });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados de exemplo - seriam buscados do banco de dados
  const [patients, setPatients] = useState<Paciente[]>([
    {
      id: '1',
      nutricionistaId: '1',
      nome: 'Maria Silva',
      email: 'maria@exemplo.com',
      dataNascimento: new Date('1990-05-15'),
      sexo: 'feminino',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123',
      observacoes: 'Paciente com intolerância à lactose',
      createdAt: new Date('2023-01-10')
    },
    {
      id: '2',
      nutricionistaId: '1',
      nome: 'João Santos',
      email: 'joao@exemplo.com',
      dataNascimento: new Date('1985-08-22'),
      sexo: 'masculino',
      telefone: '(11) 91234-5678',
      endereco: 'Av. Paulista, 1000',
      observacoes: 'Atleta, foco em ganho de massa muscular',
      createdAt: new Date('2023-02-05')
    },
    {
      id: '3',
      nutricionistaId: '1',
      nome: 'Ana Oliveira',
      email: 'ana@exemplo.com',
      dataNascimento: new Date('1995-03-18'),
      sexo: 'feminino',
      telefone: '(11) 99876-5432',
      createdAt: new Date('2023-03-20')
    }
  ]);

  const filteredPatients = patients.filter(patient => 
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    // Confirmação antes de excluir
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      // Aqui seria a chamada para a API
      setPatients(patients.filter(patient => patient.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus pacientes e seus dados
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/pacientes/novo')}>
          <UserPlus size={18} />
          Novo Paciente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Pacientes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pacientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Total de {filteredPatients.length} pacientes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.nome}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.telefone || '-'}</TableCell>
                    <TableCell>
                      {patient.dataNascimento.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => navigate(`/pacientes/${patient.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => navigate(`/pacientes/${patient.id}/editar`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => navigate(`/agendamentos/novo?pacienteId=${patient.id}`)}
                      >
                        <CalendarPlus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(patient.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum paciente encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;
