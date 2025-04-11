
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
  Edit, 
  Trash2,
  Info,
  Loader2
} from 'lucide-react';
import { Nutricionista } from '@/models';
import { nutritionistService } from '@/services/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Nutritionists = () => {
  useProtectedRoute({ allowedRoles: ['admin'] });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  // Fetch nutritionists with React Query
  const { 
    data: nutritionists = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['nutritionists'],
    queryFn: nutritionistService.getAll
  });

  // Delete mutation
  const deleteNutritionist = useMutation({
    mutationFn: (id: string) => nutritionistService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionists'] });
      toast({
        title: 'Nutricionista excluído',
        description: 'O nutricionista foi removido com sucesso.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir',
        description: error.message || 'Não foi possível excluir o nutricionista.',
        variant: 'destructive'
      });
    }
  });

  const handleDelete = (id: string) => {
    // Confirmation before deleting
    if (window.confirm('Tem certeza que deseja excluir este nutricionista?')) {
      deleteNutritionist.mutate(id);
    }
  };

  const filteredNutritionists = nutritionists.filter(nutritionist => 
    nutritionist.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nutritionist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nutritionist.crn.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <UserPlus size={18} className="mr-2" />
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
            {isLoading ? 'Carregando...' : `Total de ${filteredNutritionists.length} nutricionistas encontrados`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando nutricionistas...</span>
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-destructive">
              <p>Erro ao carregar nutricionistas. Tente novamente mais tarde.</p>
              <Button 
                variant="outline" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['nutritionists'] })}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
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
                          disabled={deleteNutritionist.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDelete(nutritionist.id)}
                          disabled={deleteNutritionist.isPending}
                        >
                          {deleteNutritionist.isPending && deleteNutritionist.variables === nutritionist.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Info className="h-8 w-8 mb-2" />
                        <p>Nenhum nutricionista encontrado</p>
                        {nutritionists.length === 0 && (
                          <Button 
                            variant="link" 
                            onClick={() => navigate('/admin/nutricionistas/novo')}
                            className="mt-2"
                          >
                            Cadastrar o primeiro nutricionista
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Nutritionists;
