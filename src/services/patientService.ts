
import { Paciente } from '@/models';
import { executeQuery } from './database';
import { formatDate, handleDatabaseError } from './api';

export const patientService = {
  async getAll(): Promise<Paciente[]> {
    try {
      const result = await executeQuery('SELECT * FROM pacientes ORDER BY nome', []);
      
      return result.rows.map(row => ({
        ...row,
        dataNascimento: formatDate(row.data_nascimento),
        createdAt: formatDate(row.created_at)
      }));
    } catch (error) {
      return handleDatabaseError(error, 'fetching patients');
    }
  },
  
  async getById(id: string): Promise<Paciente | null> {
    try {
      const result = await executeQuery('SELECT * FROM pacientes WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        ...row,
        dataNascimento: formatDate(row.data_nascimento),
        createdAt: formatDate(row.created_at)
      };
    } catch (error) {
      return handleDatabaseError(error, `fetching patient with id ${id}`);
    }
  },
  
  async create(patient: Omit<Paciente, 'id' | 'createdAt'>): Promise<Paciente> {
    try {
      const { 
        nutricionistaId, 
        nome, 
        email, 
        dataNascimento, 
        sexo, 
        telefone, 
        endereco, 
        observacoes, 
        foto 
      } = patient;
      
      const result = await executeQuery(
        `INSERT INTO pacientes 
         (nutricionista_id, nome, email, data_nascimento, sexo, telefone, endereco, observacoes, foto) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [
          nutricionistaId, 
          nome, 
          email, 
          dataNascimento, 
          sexo, 
          telefone || null, 
          endereco || null, 
          observacoes || null, 
          foto || null
        ]
      );
      
      const row = result.rows[0];
      return {
        ...row,
        dataNascimento: formatDate(row.data_nascimento),
        createdAt: formatDate(row.created_at)
      };
    } catch (error) {
      return handleDatabaseError(error, 'creating patient');
    }
  },
  
  async update(id: string, patient: Partial<Paciente>): Promise<Paciente> {
    try {
      // Build update query dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      Object.entries(patient).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          // Handle special case for dataNascimento
          if (key === 'dataNascimento') {
            updates.push(`data_nascimento = $${paramCounter}`);
            values.push(value);
            paramCounter++;
            return;
          }
          
          // Convert camelCase to snake_case for database column names
          const column = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          updates.push(`${column} = $${paramCounter}`);
          values.push(value);
          paramCounter++;
        }
      });
      
      values.push(id); // Add ID as the last parameter
      
      const result = await executeQuery(
        `UPDATE pacientes SET ${updates.join(', ')} WHERE id = $${paramCounter} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        throw new Error(`Patient with id ${id} not found`);
      }
      
      const row = result.rows[0];
      return {
        ...row,
        dataNascimento: formatDate(row.data_nascimento),
        createdAt: formatDate(row.created_at)
      };
    } catch (error) {
      return handleDatabaseError(error, `updating patient with id ${id}`);
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const result = await executeQuery('DELETE FROM pacientes WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        throw new Error(`Patient with id ${id} not found`);
      }
    } catch (error) {
      handleDatabaseError(error, `deleting patient with id ${id}`);
    }
  }
};
