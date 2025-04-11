
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { toast } from '../hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import Button from '@/components/Button';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Calendar, 
  FileText, 
  LineChart, 
  Plus, 
  CalendarPlus,
  Download
} from 'lucide-react';
import { Paciente, DadoAntropometrico, Consulta, PlanoAlimentar } from '@/models';

const PatientDetails = () => {
  useProtectedRoute({ allowedRoles: ['nutritionist', 'admin'] });
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Paciente | null>(null);
  const [anthropometricData, setAnthropometricData] = useState<DadoAntropometrico[]>([]);
  const [consultations, setConsultations] = useState<Consulta[]>([]);
  const [mealPlans, setMealPlans] = useState<PlanoAlimentar[]>([]);

  // Dados de exemplo - seriam buscados do banco de dados
  useEffect(() => {
    setIsLoading(true);
    
    // Simulando busca do paciente pelo ID
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Paciente de exemplo
        const patientData: Paciente = {
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
        };
        
        // Dados antropométricos de exemplo
        const anthropometricDataExample: DadoAntropometrico[] = [
          {
            id: '1',
            pacienteId: '1',
            data: new Date('2023-01-15'),
            peso: 68.5,
            altura: 165,
            circunferenciaCintura: 76,
            circunferenciaQuadril: 98,
            imc: 25.2,
            percentualGordura: 28.5,
            rcq: 0.78
          },
          {
            id: '2',
            pacienteId: '1',
            data: new Date('2023-02-15'),
            peso: 67.2,
            altura: 165,
            circunferenciaCintura: 74,
            circunferenciaQuadril: 97,
            imc: 24.7,
            percentualGordura: 27.8,
            rcq: 0.76
          },
          {
            id: '3',
            pacienteId: '1',
            data: new Date('2023-03-15'),
            peso: 65.8,
            altura: 165,
            circunferenciaCintura: 72,
            circunferenciaQuadril: 96,
            imc: 24.2,
            percentualGordura: 26.9,
            rcq: 0.75
          }
        ];
        
        // Consultas de exemplo
        const consultationsExample: Consulta[] = [
          {
            id: '1',
            pacienteId: '1',
            nutricionistaId: '1',
            data: new Date('2023-01-15'),
            horario: '14:00',
            status: 'concluida',
            tipo: 'primeira_consulta',
            observacoes: 'Primeira avaliação. Paciente relatou problemas digestivos com laticínios.',
            dadosAntropometricosId: '1'
          },
          {
            id: '2',
            pacienteId: '1',
            nutricionistaId: '1',
            data: new Date('2023-02-15'),
            horario: '14:30',
            status: 'concluida',
            tipo: 'retorno',
            observacoes: 'Paciente relatou melhora nos sintomas após restrição de laticínios.',
            dadosAntropometricosId: '2'
          },
          {
            id: '3',
            pacienteId: '1',
            nutricionistaId: '1',
            data: new Date('2023-03-15'),
            horario: '14:00',
            status: 'concluida',
            tipo: 'retorno',
            observacoes: 'Paciente seguindo bem o plano alimentar.',
            dadosAntropometricosId: '3'
          },
          {
            id: '4',
            pacienteId: '1',
            nutricionistaId: '1',
            data: new Date('2023-04-15'),
            horario: '15:00',
            status: 'agendada',
            tipo: 'retorno'
          }
        ];
        
        // Planos alimentares de exemplo
        const mealPlansExample: PlanoAlimentar[] = [
          {
            id: '1',
            pacienteId: '1',
            nutricionistaId: '1',
            titulo: 'Plano Inicial - Restrição de Laticínios',
            dataInicio: new Date('2023-01-15'),
            dataFim: new Date('2023-02-15'),
            objetivo: 'Perda de peso e adaptação para dieta sem laticínios',
            refeicoes: [],
            ativo: false,
            createdAt: new Date('2023-01-15')
          },
          {
            id: '2',
            pacienteId: '1',
            nutricionistaId: '1',
            titulo: 'Plano de Manutenção',
            dataInicio: new Date('2023-02-15'),
            objetivo: 'Manutenção de peso e hábitos saudáveis',
            refeicoes: [],
            ativo: true,
            createdAt: new Date('2023-02-15')
          }
        ];
        
        setPatient(patientData);
        setAnthropometricData(anthropometricDataExample);
        setConsultations(consultationsExample);
        setMealPlans(mealPlansExample);
        
      } catch (error) {
        console.error('Erro ao carregar dados do paciente:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do paciente',
          variant: 'destructive',
        });
        navigate('/pacientes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">Paciente não encontrado</h2>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate('/pacientes')}
        >
          Voltar para lista de pacientes
        </Button>
      </div>
    );
  }

  // Calcular idade
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Último dado antropométrico
  const lastAnthropometricData = anthropometricData.length > 0 
    ? anthropometricData.sort((a, b) => b.data.getTime() - a.data.getTime())[0] 
    : null;

  // Próxima consulta
  const nextConsultation = consultations
    .filter(c => c.status === 'agendada')
    .sort((a, b) => a.data.getTime() - b.data.getTime())[0];

  // Plano alimentar ativo
  const activeMealPlan = mealPlans.find(plan => plan.ativo);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/pacientes')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {patient.nome}
          </h1>
          <p className="text-muted-foreground">
            {calculateAge(patient.dataNascimento)} anos • {patient.sexo === 'masculino' ? 'Masculino' : patient.sexo === 'feminino' ? 'Feminino' : 'Outro'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/pacientes/${patient.id}/editar`)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">IMC Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastAnthropometricData ? lastAnthropometricData.imc.toFixed(1) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastAnthropometricData ? new Date(lastAnthropometricData.data).toLocaleDateString('pt-BR') : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastAnthropometricData ? `${lastAnthropometricData.peso.toFixed(1)} kg` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastAnthropometricData ? new Date(lastAnthropometricData.data).toLocaleDateString('pt-BR') : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextConsultation ? new Date(nextConsultation.data).toLocaleDateString('pt-BR') : 'Não agendada'}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextConsultation ? `às ${nextConsultation.horario}` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">
            <User className="h-4 w-4 mr-2" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="consultations">
            <Calendar className="h-4 w-4 mr-2" />
            Consultas
          </TabsTrigger>
          <TabsTrigger value="nutrition-plans">
            <FileText className="h-4 w-4 mr-2" />
            Planos Alimentares
          </TabsTrigger>
          <TabsTrigger value="evolution">
            <LineChart className="h-4 w-4 mr-2" />
            Evolução
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Informações de contato e observações</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>{patient.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Telefone</h3>
                  <p>{patient.telefone || 'Não informado'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Data de Nascimento</h3>
                  <p>{patient.dataNascimento.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Endereço</h3>
                  <p>{patient.endereco || 'Não informado'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Observações</h3>
                <p className="mt-1">{patient.observacoes || 'Nenhuma observação registrada'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dados Antropométricos</CardTitle>
                <CardDescription>
                  Última avaliação: {lastAnthropometricData 
                    ? new Date(lastAnthropometricData.data).toLocaleDateString('pt-BR') 
                    : 'Não disponível'}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Medição
              </Button>
            </CardHeader>
            <CardContent>
              {lastAnthropometricData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Altura</h3>
                    <p className="text-lg font-semibold">{lastAnthropometricData.altura} cm</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Peso</h3>
                    <p className="text-lg font-semibold">{lastAnthropometricData.peso.toFixed(1)} kg</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">IMC</h3>
                    <p className="text-lg font-semibold">{lastAnthropometricData.imc.toFixed(1)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">% Gordura</h3>
                    <p className="text-lg font-semibold">
                      {lastAnthropometricData.percentualGordura 
                        ? `${lastAnthropometricData.percentualGordura.toFixed(1)}%` 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Circ. Cintura</h3>
                    <p className="text-lg font-semibold">
                      {lastAnthropometricData.circunferenciaCintura 
                        ? `${lastAnthropometricData.circunferenciaCintura} cm` 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Circ. Quadril</h3>
                    <p className="text-lg font-semibold">
                      {lastAnthropometricData.circunferenciaQuadril 
                        ? `${lastAnthropometricData.circunferenciaQuadril} cm` 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">RCQ</h3>
                    <p className="text-lg font-semibold">
                      {lastAnthropometricData.rcq 
                        ? lastAnthropometricData.rcq.toFixed(2) 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">TMB</h3>
                    <p className="text-lg font-semibold">
                      {lastAnthropometricData.tmb 
                        ? `${lastAnthropometricData.tmb} kcal` 
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Nenhum dado antropométrico registrado ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consultations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Histórico de Consultas</CardTitle>
                <CardDescription>
                  {consultations.length} consulta{consultations.length !== 1 ? 's' : ''} registrada{consultations.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Button variant="primary" size="sm">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Agendar Consulta
              </Button>
            </CardHeader>
            <CardContent>
              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations
                    .sort((a, b) => b.data.getTime() - a.data.getTime())
                    .map((consultation) => (
                      <div 
                        key={consultation.id} 
                        className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                              consultation.status === 'agendada' 
                                ? 'bg-blue-500' 
                                : consultation.status === 'concluida' 
                                ? 'bg-green-500' 
                                : 'bg-gray-500'
                            }`}></span>
                            <h3 className="font-medium">
                              {consultation.tipo === 'primeira_consulta' 
                                ? 'Primeira Consulta' 
                                : consultation.tipo === 'retorno' 
                                ? 'Consulta de Retorno' 
                                : 'Avaliação'}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(consultation.data).toLocaleDateString('pt-BR')} às {consultation.horario}
                          </p>
                          {consultation.observacoes && (
                            <p className="text-sm mt-2">{consultation.observacoes}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {consultation.status === 'agendada' && (
                            <>
                              <Button variant="outline" size="sm">
                                Reagendar
                              </Button>
                              <Button variant="outline" size="sm">
                                Cancelar
                              </Button>
                            </>
                          )}
                          {consultation.status === 'concluida' && (
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>Nenhuma consulta registrada ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition-plans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Planos Alimentares</CardTitle>
                <CardDescription>
                  {mealPlans.length} plano{mealPlans.length !== 1 ? 's' : ''} alimentar{mealPlans.length !== 1 ? 'es' : ''}
                </CardDescription>
              </div>
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </CardHeader>
            <CardContent>
              {mealPlans.length > 0 ? (
                <div className="space-y-4">
                  {mealPlans
                    .sort((a, b) => b.dataInicio.getTime() - a.dataInicio.getTime())
                    .map((plan) => (
                      <div 
                        key={plan.id} 
                        className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center">
                            {plan.ativo && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-2">
                                Ativo
                              </span>
                            )}
                            <h3 className="font-medium">{plan.titulo}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Início: {plan.dataInicio.toLocaleDateString('pt-BR')}
                            {plan.dataFim && ` • Fim: ${plan.dataFim.toLocaleDateString('pt-BR')}`}
                          </p>
                          {plan.objetivo && (
                            <p className="text-sm mt-1">Objetivo: {plan.objetivo}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>Nenhum plano alimentar registrado ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Paciente</CardTitle>
              <CardDescription>
                Acompanhamento da evolução ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {anthropometricData.length > 1 ? (
                <div className="h-80">
                  <p className="text-center text-muted-foreground py-8">
                    Aqui seriam exibidos os gráficos de evolução de peso, IMC e outras medidas.
                  </p>
                </div>
              ) : (
                <p>São necessárias pelo menos duas medições para mostrar a evolução.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetails;
