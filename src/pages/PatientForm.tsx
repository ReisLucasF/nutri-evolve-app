
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Button from '@/components/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { Paciente } from '@/models';

interface PatientFormData {
  nome: string;
  email: string;
  dataNascimento: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  telefone: string;
  endereco: string;
  observacoes: string;
}

const PatientForm = () => {
  useProtectedRoute({ allowedRoles: ['nutritionist', 'admin'] });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PatientFormData>();
  const [isLoading, setIsLoading] = useState(false);

  // Dados de exemplo - seriam buscados do banco de dados
  const samplePatients: Paciente[] = [
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
    }
  ];

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      
      // Simulando busca do paciente pelo ID
      const patient = samplePatients.find(p => p.id === id);
      
      if (patient) {
        setValue('nome', patient.nome);
        setValue('email', patient.email);
        setValue('dataNascimento', patient.dataNascimento.toISOString().split('T')[0]);
        setValue('sexo', patient.sexo);
        setValue('telefone', patient.telefone || '');
        setValue('endereco', patient.endereco || '');
        setValue('observacoes', patient.observacoes || '');
      } else {
        toast({
          title: 'Erro',
          description: 'Paciente não encontrado',
          variant: 'destructive',
        });
        navigate('/pacientes');
      }
      
      setIsLoading(false);
    }
  }, [id, isEditing, setValue, navigate]);

  const onSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    
    try {
      // Aqui seria feita a chamada para a API
      console.log('Submetendo dados:', data);
      
      // Simulando a chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: `Paciente ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso`,
        description: `Os dados de ${data.nome} foram ${isEditing ? 'atualizados' : 'cadastrados'} no sistema.`,
      });
      
      navigate('/pacientes');
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${isEditing ? 'atualizar' : 'cadastrar'} o paciente. Tente novamente.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/pacientes')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize os dados do paciente' : 'Cadastre um novo paciente no sistema'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>
              Preencha as informações básicas do paciente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo*</Label>
                <Input 
                  id="nome" 
                  {...register('nome', { required: true })}
                  error={errors.nome ? 'Nome é obrigatório' : undefined}
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
                />
                {errors.email && (
                  <p className="text-sm text-destructive">Email válido é obrigatório</p>
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
                <Label htmlFor="dataNascimento">Data de Nascimento*</Label>
                <Input 
                  id="dataNascimento" 
                  type="date" 
                  {...register('dataNascimento', { required: true })}
                />
                {errors.dataNascimento && (
                  <p className="text-sm text-destructive">Data de nascimento é obrigatória</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo*</Label>
                <Select 
                  defaultValue={isEditing ? undefined : 'masculino'}
                  onValueChange={(value) => setValue('sexo', value as any)}
                >
                  <SelectTrigger id="sexo">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input 
                  id="endereco" 
                  {...register('endereco')}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                className="min-h-[100px]" 
                {...register('observacoes')}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/pacientes')}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Atualizar Paciente' : 'Cadastrar Paciente'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default PatientForm;
