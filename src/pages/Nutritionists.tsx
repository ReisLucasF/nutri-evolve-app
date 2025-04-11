
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
  Trash2
} from 'lucide-react';
import { Nutricionista } from '@/models';

const Nutritionists = () => {
  useProtectedRoute({ allowedRoles: ['admin'] });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados de exemplo - seriam buscados do banco de dados
  const [nutritionists, setNutritionists] = useState<Nutricionista[]>([
    {
      id: '1',
      nome: 'Dr. Carlos Oliveira',
      email: 'carlos@nutrievolve.app',
      crn: 'CRN-3 12345',
      telefone: '(11) 98765-4321',
      especialidade: 'Nutrição Esportiva',
      createdAt: new Date('2022-01-10')
    },
    {
      id: '2',
      nome: 'Dra. Juliana Santos',
      email: 'juliana@nutrievolve.app',
      crn: 'CRN-3 23456',
      telefone: '(11) 91234-5678',
      especialidade: 'Nutrição Clínica',
      createdAt: new Date('2022-03-15')
    },
    {
      id: '3',
      nome: 'Dr. Rafael Mendes',
      email: 'rafael@nutrievolve.app',
      crn: 'CRN-3 34567',
      telefone: '(11) 99876-5432',
      especialidade: 'Nutrição Funcional',
      createdAt: new Date('2022-06-20')
    }
  ]);

  const filteredNutritionists = nutritionists.filter(nutritionist => 
    nutritionist.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nutritionist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nutritionist.crn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    // Confirmação antes de excluir
    if (window.confirm('Tem certeza que deseja excluir este nutricionista?')) {
      // Aqui seria a chamada para a API
      setNutritionists(nutritionists.filter(nutritionist => nutritionist.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nutricionistas</h1>
          <p className="text-muted-foreground">
            Gerencie os nutricionistas cadastrados no sistema
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/nutricionistas/novo')}>
          <UserPlus size={18} />
          Novo Nutricionista
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Nutricionistas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nutricionistas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Total de {filteredNutritionists.length} nutricionistas encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CRN</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNutritionists.length > 0 ? (
                filteredNutritionists.map((nutritionist) => (
                  <TableRow key={nutritionist.id}>
                    <TableCell className="font-medium">{nutritionist.nome}</TableCell>
                    <TableCell>{nutritionist.crn}</TableCell>
                    <TableCell>{nutritionist.email}</TableCell>
                    <TableCell>{nutritionist.especialidade || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => navigate(`/admin/nutricionistas/${nutritionist.id}/editar`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(nutritionist.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum nutricionista encontrado
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

export default Nutritionists;
