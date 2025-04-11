
import React, { useState, useEffect } from 'react';
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
import { toast } from '@/hooks/use-toast';
import Button from '@/components/Button';
import { 
  UserPlus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Info
} from 'lucide-react';
import { Paciente } from '@/models';

// Função auxiliar para carregar pacientes do localStorage
const loadPatientsFromStorage = (): Paciente[] => {
  const storedPatients = localStorage.getItem('patients');
  if (storedPatients) {
    try {
      // Convertendo datas de string para objeto Date
      const patients = JSON.parse(storedPatients);
      return patients.map((p: any) => ({
        ...p,
        dataNascimento: new Date(p.dataNascimento),
        createdAt: new Date(p.createdAt)
      }));
    } catch (error) {
      console.error('Erro ao carregar pacientes do localStorage:', error);
      return [];
    }
  }
  return [];
};

// Função auxiliar para salvar pacientes no localStorage
const savePatientsToStorage = (patients: Paciente[]) => {
  localStorage.setItem('patients', JSON.stringify(patients));
};

const Patients = () => {
  useProtectedRoute({ allowedRoles: ['nutritionist', 'admin'] });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Paciente[]>([]);

  useEffect(() => {
    // Carrega os pacientes do localStorage ao montar o componente
    const loadedPatients = loadPatientsFromStorage();
    setPatients(loadedPatients);
  }, []);

  const filteredPatients = patients.filter(patient => 
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      const updatedPatients = patients.filter(patient => patient.id !== id);
      setPatients(updatedPatients);
      savePatientsToStorage(updatedPatients);
      
      toast({
        title: 'Paciente excluído',
        description: 'O paciente foi removido com sucesso.'
      });
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
          <UserPlus size={18} className="mr-2" />
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
                <TableHead>Sexo</TableHead>
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
                      {patient.sexo === 'masculino' ? 'Masculino' : 
                       patient.sexo === 'feminino' ? 'Feminino' : 'Outro'}
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
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Info className="h-8 w-8 mb-2" />
                      <p>Nenhum paciente encontrado</p>
                      {patients.length === 0 && (
                        <Button 
                          variant="link" 
                          onClick={() => navigate('/pacientes/novo')}
                          className="mt-2"
                        >
                          Cadastrar o primeiro paciente
                        </Button>
                      )}
                    </div>
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
