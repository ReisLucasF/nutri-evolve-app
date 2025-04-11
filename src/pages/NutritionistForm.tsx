import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from '../hooks/use-toast';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { Nutricionista } from '@/models';

interface NutritionistFormData {
  nome: string;
  email: string;
  crn: string;
  telefone: string;
  especialidade: string;
  senha?: string;
  confirmarSenha?: string;
}

const loadNutritionistsFromStorage = (): Nutricionista[] => {
  const storedNutritionists = localStorage.getItem('nutritionists');
  if (storedNutritionists) {
    try {
      const nutritionists = JSON.parse(storedNutritionists);
      return nutritionists.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt)
      }));
    } catch (error) {
      console.error('Erro ao carregar nutricionistas do localStorage:', error);
      return [];
    }
  }
  
  const sampleNutritionists: Nutricionista[] = [
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
    }
  ];
  
  localStorage.setItem('nutritionists', JSON.stringify(sampleNutritionists));
  return sampleNutritionists;
};

const saveNutritionistsToStorage = (nutritionists: Nutricionista[]) => {
  localStorage.setItem('nutritionists', JSON.stringify(nutritionists));
};

const NutritionistForm = () => {
  useProtectedRoute({ allowedRoles: ['admin'] });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<NutritionistFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionists, setNutritionists] = useState<Nutricionista[]>([]);

  useEffect(() => {
    const loadedNutritionists = loadNutritionistsFromStorage();
    setNutritionists(loadedNutritionists);
    
    if (isEditing) {
      setIsLoading(true);
      
      const nutritionist = loadedNutritionists.find(n => n.id === id);
      
      if (nutritionist) {
        setValue('nome', nutritionist.nome);
        setValue('email', nutritionist.email);
        setValue('crn', nutritionist.crn);
        setValue('telefone', nutritionist.telefone || '');
        setValue('especialidade', nutritionist.especialidade || '');
      } else {
        toast({
          title: 'Erro',
          description: 'Nutricionista não encontrado',
          variant: 'destructive',
        });
        navigate('/admin/nutricionistas');
      }
      
      setIsLoading(false);
    }
  }, [id, isEditing, setValue, navigate]);

  const onSubmit = async (data: NutritionistFormData) => {
    setIsLoading(true);
    
    try {
      if (!isEditing && data.senha !== data.confirmarSenha) {
        throw new Error('As senhas não correspondem');
      }
      
      console.log('Submetendo dados:', data);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isEditing && id) {
        const updatedNutritionists = nutritionists.map(n => 
          n.id === id 
            ? {
                ...n,
                nome: data.nome,
                email: data.email,
                crn: data.crn,
                telefone: data.telefone,
                especialidade: data.especialidade
              } 
            : n
        );
        
        setNutritionists(updatedNutritionists);
        saveNutritionistsToStorage(updatedNutritionists);
      } else {
        const newNutritionist: Nutricionista = {
          id: Date.now().toString(),
          nome: data.nome,
          email: data.email,
          crn: data.crn,
          telefone: data.telefone,
          especialidade: data.especialidade,
          createdAt: new Date()
        };
        
        const newNutritionists = [...nutritionists, newNutritionist];
        setNutritionists(newNutritionists);
        saveNutritionistsToStorage(newNutritionists);
      }
      
      toast({
        title: `Nutricionista ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso`,
        description: `Os dados de ${data.nome} foram ${isEditing ? 'atualizados' : 'cadastrados'} no sistema.`,
      });
      
      navigate('/admin/nutricionistas');
    } catch (error) {
      console.error('Erro ao salvar nutricionista:', error);
      let message = 'Não foi possível salvar os dados. Tente novamente.';
      
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const senha = watch('senha');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/nutricionistas')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Editar Nutricionista' : 'Novo Nutricionista'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize os dados do nutricionista' : 'Cadastre um novo nutricionista no sistema'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Nutricionista</CardTitle>
            <CardDescription>
              Preencha as informações do profissional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo*</Label>
                <Input 
                  id="nome" 
                  {...register('nome', { required: true })}
                  className={errors.nome ? "border-destructive" : ""}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">Nome é obrigatório</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register('email', { 
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                  })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">Email válido é obrigatório</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crn">CRN (Registro Profissional)*</Label>
                <Input 
                  id="crn" 
                  {...register('crn', { required: true })}
                  className={errors.crn ? "border-destructive" : ""}
                />
                {errors.crn && (
                  <p className="text-sm text-destructive">CRN é obrigatório</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone" 
                  {...register('telefone')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input 
                  id="especialidade" 
                  {...register('especialidade')}
                />
              </div>
            </div>
            
            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha*</Label>
                  <Input 
                    id="senha" 
                    type="password" 
                    {...register('senha', { required: !isEditing })}
                    className={errors.senha ? "border-destructive" : ""}
                  />
                  {errors.senha && (
                    <p className="text-sm text-destructive">Senha é obrigatória</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha*</Label>
                  <Input 
                    id="confirmarSenha" 
                    type="password" 
                    {...register('confirmarSenha', { 
                      required: !isEditing,
                      validate: value => !value || !senha || value === senha || 'As senhas não correspondem'
                    })}
                    className={errors.confirmarSenha ? "border-destructive" : ""}
                  />
                  {errors.confirmarSenha && (
                    <p className="text-sm text-destructive">
                      {errors.confirmarSenha.message || 'Confirmação de senha é obrigatória'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/admin/nutricionistas')}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Atualizar Nutricionista' : 'Cadastrar Nutricionista'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NutritionistForm;
