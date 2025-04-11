
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '../hooks/use-toast';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Button from '@/components/Button';
import { 
  User, 
  Lock, 
  Building, 
  Save, 
  Upload, 
  AlertTriangle
} from 'lucide-react';

interface ProfileFormData {
  nome: string;
  email: string;
  telefone: string;
  crn?: string;
  especialidade?: string;
  bio?: string;
}

interface PasswordFormData {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}

interface ClinicFormData {
  nomeClinica: string;
  endereco: string;
  telefone: string;
  website: string;
  logo?: File;
  corPrimaria: string;
  corSecundaria: string;
}

const Settings = () => {
  useProtectedRoute();
  const { user } = useAuth();
  
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      nome: user?.name || '',
      email: user?.email || '',
      telefone: '',
      crn: user?.crn || '',
      especialidade: '',
      bio: ''
    }
  });
  
  const passwordForm = useForm<PasswordFormData>();
  const clinicForm = useForm<ClinicFormData>({
    defaultValues: {
      nomeClinica: 'NutriEvolve',
      endereco: 'Av. Paulista, 1000, São Paulo - SP',
      telefone: '(11) 3456-7890',
      website: 'www.nutrievolve.com.br',
      corPrimaria: '#22c55e',
      corSecundaria: '#4ade80'
    }
  });
  
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isClinicLoading, setIsClinicLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsProfileLoading(true);
    
    try {
      // Aqui seria feita a chamada para a API
      console.log('Submetendo dados de perfil:', data);
      
      // Simulando a chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsPasswordLoading(true);
    
    try {
      // Verificar se as senhas correspondem
      if (data.novaSenha !== data.confirmarNovaSenha) {
        throw new Error('As senhas não correspondem');
      }
      
      // Aqui seria feita a chamada para a API
      console.log('Submetendo dados de senha:', data);
      
      // Simulando a chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi alterada com sucesso.',
      });
      
      passwordForm.reset();
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      let message = 'Não foi possível atualizar a senha. Tente novamente.';
      
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const onClinicSubmit = async (data: ClinicFormData) => {
    setIsClinicLoading(true);
    
    try {
      // Aqui seria feita a chamada para a API
      console.log('Submetendo dados da clínica:', data);
      
      // Simulando a chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Configurações da clínica atualizadas',
        description: 'As informações da clínica foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar dados da clínica:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as configurações da clínica. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsClinicLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      clinicForm.setValue('logo', file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4 mr-2" />
            Senha
          </TabsTrigger>
          {(user?.role === 'admin' || user?.role === 'nutritionist') && (
            <TabsTrigger value="clinic">
              <Building className="h-4 w-4 mr-2" />
              Clínica
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile">
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e profissionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input 
                      id="nome" 
                      {...profileForm.register('nome', { required: true })}
                    />
                    {profileForm.formState.errors.nome && (
                      <p className="text-sm text-destructive">Nome é obrigatório</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...profileForm.register('email', { 
                        required: true,
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                      })}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-destructive">Email válido é obrigatório</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input 
                      id="telefone" 
                      {...profileForm.register('telefone')}
                    />
                  </div>
                  
                  {(user?.role === 'admin' || user?.role === 'nutritionist') && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="crn">CRN (Registro Profissional)</Label>
                        <Input 
                          id="crn" 
                          {...profileForm.register('crn')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="especialidade">Especialidade</Label>
                        <Input 
                          id="especialidade" 
                          {...profileForm.register('especialidade')}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea 
                    id="bio" 
                    className="min-h-[100px]" 
                    placeholder="Conte um pouco sobre você..."
                    {...profileForm.register('bio')}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="primary" type="submit" disabled={isProfileLoading}>
                  {isProfileLoading ? (
                    'Salvando...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="password">
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha de acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <Input 
                    id="senhaAtual" 
                    type="password" 
                    {...passwordForm.register('senhaAtual', { required: true })}
                  />
                  {passwordForm.formState.errors.senhaAtual && (
                    <p className="text-sm text-destructive">Senha atual é obrigatória</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <Input 
                      id="novaSenha" 
                      type="password" 
                      {...passwordForm.register('novaSenha', { 
                        required: true,
                        minLength: {
                          value: 6,
                          message: 'A senha deve ter pelo menos 6 caracteres'
                        }
                      })}
                    />
                    {passwordForm.formState.errors.novaSenha && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.novaSenha.message || 'Nova senha é obrigatória'}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmarNovaSenha">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirmarNovaSenha" 
                      type="password" 
                      {...passwordForm.register('confirmarNovaSenha', { 
                        required: true,
                        validate: value => 
                          value === passwordForm.watch('novaSenha') || 
                          'As senhas não correspondem'
                      })}
                    />
                    {passwordForm.formState.errors.confirmarNovaSenha && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmarNovaSenha.message || 'Confirmação de senha é obrigatória'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-md">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    Lembre-se de usar uma senha forte com pelo menos 8 caracteres, incluindo letras, números e símbolos.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="primary" type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? (
                    'Atualizando...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Atualizar Senha
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        {(user?.role === 'admin' || user?.role === 'nutritionist') && (
          <TabsContent value="clinic">
            <form onSubmit={clinicForm.handleSubmit(onClinicSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Clínica</CardTitle>
                  <CardDescription>
                    Personalize as informações da sua clínica
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeClinica">Nome da Clínica</Label>
                      <Input 
                        id="nomeClinica" 
                        {...clinicForm.register('nomeClinica', { required: true })}
                      />
                      {clinicForm.formState.errors.nomeClinica && (
                        <p className="text-sm text-destructive">Nome da clínica é obrigatório</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input 
                        id="telefone" 
                        {...clinicForm.register('telefone')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input 
                        id="endereco" 
                        {...clinicForm.register('endereco')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        {...clinicForm.register('website')}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="corPrimaria">Cor Primária</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="corPrimaria" 
                          type="text"
                          {...clinicForm.register('corPrimaria')}
                        />
                        <Input 
                          type="color"
                          className="w-10 h-10 p-1"
                          value={clinicForm.watch('corPrimaria')}
                          onChange={(e) => clinicForm.setValue('corPrimaria', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="corSecundaria">Cor Secundária</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="corSecundaria" 
                          type="text"
                          {...clinicForm.register('corSecundaria')}
                        />
                        <Input 
                          type="color"
                          className="w-10 h-10 p-1"
                          value={clinicForm.watch('corSecundaria')}
                          onChange={(e) => clinicForm.setValue('corSecundaria', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo da Clínica</Label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                          <img 
                            src={logoPreview} 
                            alt="Logo Preview" 
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              setLogoPreview(null);
                              clinicForm.setValue('logo', undefined);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center text-muted-foreground">
                          <span className="text-xs">Sem logo</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <Input 
                          id="logo" 
                          type="file" 
                          accept="image/*"
                          className="cursor-pointer"
                          onChange={handleLogoChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Tamanho recomendado: 512x512px. Apenas JPG, PNG ou SVG.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="primary" type="submit" disabled={isClinicLoading}>
                    {isClinicLoading ? (
                      'Salvando...'
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
