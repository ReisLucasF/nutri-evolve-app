
-- Database schema for NutritionistApp

-- Nutricionistas table
CREATE TABLE IF NOT EXISTS nutricionistas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  crn VARCHAR(50) NOT NULL,
  telefone VARCHAR(20),
  especialidade VARCHAR(100),
  foto TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pacientes table
CREATE TABLE IF NOT EXISTS pacientes (
  id SERIAL PRIMARY KEY,
  nutricionista_id INTEGER NOT NULL REFERENCES nutricionistas(id),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  data_nascimento DATE NOT NULL,
  sexo VARCHAR(20) NOT NULL,
  telefone VARCHAR(20),
  endereco TEXT,
  observacoes TEXT,
  foto TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- You can add more tables for other entities as needed
-- Such as consultas, dados_antropometricos, planos_alimentares, etc.
