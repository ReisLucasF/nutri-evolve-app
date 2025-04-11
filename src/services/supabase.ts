import { Nutricionista, Paciente } from '@/models';
import { executeQuery } from './database.js';

// Nutritionist Services
export const nutritionistService = {
  async getAll(): Promise<Nutricionista[]> {
    try {
      const result = await executeQuery('SELECT * FROM nutritionists', []);
      
      return result.rows.map((item: any) => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        crn: item.crn,
        telefone: item.telefone,
        especialidade: item.especialidade,
        foto: item.foto,
        createdAt: new Date(item.created_at)
      }));
    } catch (error: any) {
      console.error('Error fetching nutritionists:', error);
      throw new Error(error.message);
    }
  },
  
  async getById(id: string): Promise<Nutricionista | null> {
    try {
      const result = await executeQuery('SELECT * FROM nutritionists WHERE id = $1', [id]);
      
      if (result.rows.length === 0) return null;
      
      const item = result.rows[0];
      return {
        id: item.id,
        nome: item.nome,
        email: item.email,
        crn: item.crn,
        telefone: item.telefone,
        especialidade: item.especialidade,
        foto: item.foto,
        createdAt: new Date(item.created_at)
      };
    } catch (error: any) {
      console.error(`Error fetching nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
  },
  
  async create(nutritionist: Omit<Nutricionista, 'id' | 'createdAt'>): Promise<Nutricionista> {
    try {
      const result = await executeQuery(
        `INSERT INTO nutritionists (nome, email, crn, telefone, especialidade, foto)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          nutritionist.nome,
          nutritionist.email,
          nutritionist.crn,
          nutritionist.telefone || null,
          nutritionist.especialidade || null,
          nutritionist.foto || null
        ]
      );
      
      const item = result.rows[0];
      return {
        id: item.id,
        nome: item.nome,
        email: item.email,
        crn: item.crn,
        telefone: item.telefone,
        especialidade: item.especialidade,
        foto: item.foto,
        createdAt: new Date(item.created_at)
      };
    } catch (error: any) {
      console.error('Error creating nutritionist:', error);
      throw new Error(error.message);
    }
  },
  
  async update(id: string, nutritionist: Partial<Nutricionista>): Promise<Nutricionista> {
    try {
      const result = await executeQuery(
        `UPDATE nutritionists
         SET nome = $1, email = $2, crn = $3, telefone = $4, especialidade = $5, foto = $6
         WHERE id = $7
         RETURNING *`,
        [
          nutritionist.nome,
          nutritionist.email,
          nutritionist.crn,
          nutritionist.telefone || null,
          nutritionist.especialidade || null,
          nutritionist.foto || null,
          id
        ]
      );
      
      const item = result.rows[0];
      return {
        id: item.id,
        nome: item.nome,
        email: item.email,
        crn: item.crn,
        telefone: item.telefone,
        especialidade: item.especialidade,
        foto: item.foto,
        createdAt: new Date(item.created_at)
      };
    } catch (error: any) {
      console.error(`Error updating nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      await executeQuery('DELETE FROM nutritionists WHERE id = $1', [id]);
    } catch (error: any) {
      console.error(`Error deleting nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
  }
};

// Patient Services
export const patientService = {
  async getAll(): Promise<Paciente[]> {
    try {
      const result = await executeQuery('SELECT * FROM patients', []);
      
      return result.rows.map((item: any) => ({
        id: item.id,
        nutricionistaId: item.nutricionista_id,
        nome: item.nome,
        email: item.email,
        dataNascimento: new Date(item.data_nascimento),
        sexo: item.sexo,
        telefone: item.telefone,
        endereco: item.endereco,
        observacoes: item.observacoes,
        foto: item.foto,
        createdAt: new Date(item.created_at)
      }));
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      throw new Error(error.message);
    }
  },
  
  async getById(id: string): Promise<Paciente | null> {
    try {
      const result = await executeQuery('SELECT * FROM patients WHERE id = $1', [id]);
      
      if (result.rows.length === 0) return null;
      
      const item = result.rows[0];
      return {
        id: item.id,
        nutricionistaId: item.nutricionista_id,
        nome: item.nome,
        email: item.email,
        dataNascimento: new Date(item.data_nascimento),
        sexo: item.sexo,
        telefone: item.telefone,
        endereco: item.endereco,
        observacoes: item.observacoes,
        foto: item.foto,
        createdAt: new Date(item.created_at)
      };
    } catch (error: any) {
      console.error(`Error fetching patient with id ${id}:`, error);
      throw new Error(error.message);
    }
  },
  
  async create(patient: Omit<Paciente, 'id' | 'createdAt'>): Promise<Paciente> {
    try {
      const result = await executeQuery(
        `INSERT INTO patients (
          nutricionista_id, nome, email, data_nascimento, sexo, 
          telefone, endereco, observacoes, foto
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          patient.nutricionistaId,
          patient.nome,
          patient.email,
          patient.dataNascimento.toISOString(),
          patient.sexo,
          patient.telefone || null,
          patient.endereco || null,
          patient.observacoes || null,
          patient.foto || null
        ]
      );
      
      const item = result.rows[0];
      return {
        id: item.id,
        nutricionistaId: item.nutricionista_id,
        nome: item.nome,
        email: item.email,
        dataNascimento: new Date(item.data_nascimento),
        sexo: item.sexo,
        telefone: item.telefone,
        endereco: item.endereco,
        observacoes: item.observacoes,
        foto: item.foto,
        createdAt: new Date(item.created_at)
      };
    } catch (error: any) {
      console.error('Error creating patient:', error);
      throw new Error(error.message);
    }
  },
  
  async update(id: string, patient: Partial<Paciente>): Promise<Paciente> {
    try {
      const result = await executeQuery(
        `UPDATE patients
         SET nutricionista_id = $1, nome = $2, email = $3, data_nascimento = $4,
             sexo = $5, telefone = $6, endereco = $7, observacoes = $8, foto = $9
         WHERE id = $10
         RETURNING *`,
        [
          patient.nutricionistaId,
          patient.nome,
          patient.email,
          patient.dataNascimento?.toISOString(),
          patient.sexo,
          patient.telefone || null,
          patient.endereco || null,
          patient.observacoes || null,
          patient.foto || null,
          id
        ]
      );
      
      const item = result.rows[0];
      return {
        id: item.id,
        nutricionistaId: item.nutricionista_id,
        nome: item.nome,
        email: item.email,
        dataNascimento: new Date(item.data_nascimento),
        sexo: item.sexo,
        telefone: item.telefone,
        endereco: item.endereco,
        observacoes: item.observacoes,
        foto: item.foto,
        createdAt: new Date(item.created_at)
      };
    } catch (error: any) {
      console.error(`Error updating patient with id ${id}:`, error);
      throw new Error(error.message);
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      await executeQuery('DELETE FROM patients WHERE id = $1', [id]);
    } catch (error: any) {
      console.error(`Error deleting patient with id ${id}:`, error);
      throw new Error(error.message);
    }
  }
};
