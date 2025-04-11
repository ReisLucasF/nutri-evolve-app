
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
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Nutricionista } from '@/models';
import { nutritionistService } from '@/services/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface NutritionistFormData {
  nome: string;
  email: string;
  crn: string;
  telefone: string;
  especialidade: string;
  senha?: string;
  confirmarSenha?: string;
}

const NutritionistForm = () => {
  useProtectedRoute({ allowedRoles: ['admin'] });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<NutritionistFormData>();

  // Fetch nutritionist data if editing
  const { data: nutritionist, isLoading: isLoadingNutritionist } = useQuery({
    queryKey: ['nutritionist', id],
    queryFn: () => id ? nutritionistService.getById(id) : null,
    enabled: isEditing,
    meta: {
      onSuccess: (data: Nutricionista | null) => {
        if (data) {
          setValue('nome', data.nome);
          setValue('email', data.email);
          setValue('crn', data.crn);
          setValue('telefone', data.telefone || '');
          setValue('especialidade', data.especialidade || '');
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível carregar os dados do nutricionista',
        variant: 'destructive'
      });
      navigate('/admin/nutricionistas');
    }
  });

  // Create mutation
  const createNutritionist = useMutation({
    mutationFn: (data: Omit<Nutricionista, 'id' | 'createdAt'>) => 
      nutritionistService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionists'] });
      toast({
        title: 'Nutricionista cadastrado',
        description: 'O nutricionista foi cadastrado com sucesso.'
      });
      navigate('/admin/nutricionistas');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao cadastrar',
        description: error.message || 'Não foi possível cadastrar o nutricionista',
        variant: 'destructive'
      });
    }
  });

  // Update mutation
  const updateNutritionist = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Nutricionista> }) => 
      nutritionistService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionists'] });
      queryClient.invalidateQueries({ queryKey: ['nutritionist', id] });
      toast({
        title: 'Nutricionista atualizado',
        description: 'O nutricionista foi atualizado com sucesso.'
      });
      navigate('/admin/nutricionistas');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message || 'Não foi possível atualizar o nutricionista',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: NutritionistFormData) => {
    try {
      if (!isEditing && data.senha !== data.confirmarSenha) {
        throw new Error('As senhas não correspondem');
      }
      
      const nutritionistData = {
        nome: data.nome,
        email: data.email,
        crn: data.crn,
        telefone: data.telefone,
        especialidade: data.especialidade,
      };
      
      if (isEditing && id) {
        updateNutritionist.mutate({ id, data: nutritionistData });
      } else {
        createNutritionist.mutate(nutritionistData);
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar os dados',
        variant: 'destructive',
      });
    }
  };

  const senha = watch('senha');
  const isSubmitting = createNutritionist.isPending || updateNutritionist.isPending;
  const isLoading = isLoadingNutritionist || isSubmitting;

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
            {isLoadingNutritionist && isEditing ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Carregando dados...</span>
              </div>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/admin/nutricionistas')} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </div>
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
