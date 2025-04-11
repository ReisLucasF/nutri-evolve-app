
// Modelos de dados para o aplicativo

export interface Nutricionista {
  id: string;
  nome: string;
  email: string;
  crn: string;
  telefone?: string;
  especialidade?: string;
  foto?: string;
  createdAt: Date;
}

export interface Paciente {
  id: string;
  nutricionistaId: string;
  nome: string;
  email: string;
  dataNascimento: Date;
  sexo: 'masculino' | 'feminino' | 'outro';
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  foto?: string;
  createdAt: Date;
}

export interface DadoAntropometrico {
  id: string;
  pacienteId: string;
  data: Date;
  peso: number; // em kg
  altura: number; // em cm
  circunferenciaCintura?: number; // em cm
  circunferenciaQuadril?: number; // em cm
  circunferenciaBraco?: number; // em cm
  dobrasCutaneas?: {
    tricipital?: number;
    subescapular?: number;
    bicipital?: number;
    suprailiaca?: number;
    abdominal?: number;
    coxa?: number;
    panturrilha?: number;
  };
  percentualGordura?: number;
  imc: number; // calculado: peso / (altura em m)^2
  rcq?: number; // calculado: circunferenciaCintura / circunferenciaQuadril
  tmb?: number; // Taxa Metabólica Basal
  observacoes?: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  nutricionistaId: string;
  data: Date;
  horario: string;
  status: 'agendada' | 'concluida' | 'cancelada';
  tipo: 'primeira_consulta' | 'retorno' | 'avaliacao';
  observacoes?: string;
  dadosAntropometricosId?: string;
}

export interface PlanoAlimentar {
  id: string;
  pacienteId: string;
  nutricionistaId: string;
  titulo: string;
  dataInicio: Date;
  dataFim?: Date;
  objetivo: string;
  refeicoes: Refeicao[];
  observacoes?: string;
  ativo: boolean;
  createdAt: Date;
}

export interface Refeicao {
  id: string;
  planoAlimentarId: string;
  nome: string; // ex: "Café da manhã", "Almoço", etc.
  horario: string; // ex: "07:00", "12:00", etc.
  alimentos: AlimentoRefeicao[];
}

export interface AlimentoRefeicao {
  id: string;
  refeicaoId: string;
  alimento: string;
  quantidade: number;
  unidadeMedida: string; // ex: "g", "ml", "porção", etc.
  calorias?: number;
  proteinas?: number;
  carboidratos?: number;
  gorduras?: number;
  observacoes?: string;
}
