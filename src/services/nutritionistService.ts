
import { Nutricionista } from '@/models';
import { executeQuery } from './database';
import { formatDate, handleDatabaseError } from './api';

export const nutritionistService = {
  async getAll(): Promise<Nutricionista[]> {
    try {
      const result = await executeQuery('SELECT * FROM nutricionistas ORDER BY nome', []);
      
      return result.rows.map(row => ({
        ...row,
        createdAt: formatDate(row.created_at)
      }));
    } catch (error) {
      return handleDatabaseError(error, 'fetching nutritionists');
    }
  },
  
  async getById(id: string): Promise<Nutricionista | null> {
    try {
      const result = await executeQuery('SELECT * FROM nutricionistas WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        ...row,
        createdAt: formatDate(row.created_at)
      };
    } catch (error) {
      return handleDatabaseError(error, `fetching nutritionist with id ${id}`);
    }
  },
  
  async create(nutritionist: Omit<Nutricionista, 'id' | 'createdAt'>): Promise<Nutricionista> {
    try {
      const { nome, email, crn, telefone, especialidade, foto } = nutritionist;
      
      const result = await executeQuery(
        'INSERT INTO nutricionistas (nome, email, crn, telefone, especialidade, foto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nome, email, crn, telefone || null, especialidade || null, foto || null]
      );
      
      const row = result.rows[0];
      return {
        ...row,
        createdAt: formatDate(row.created_at)
      };
    } catch (error) {
      return handleDatabaseError(error, 'creating nutritionist');
    }
  },
  
  async update(id: string, nutritionist: Partial<Nutricionista>): Promise<Nutricionista> {
    try {
      // Build update query dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      Object.entries(nutritionist).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          // Convert camelCase to snake_case for database column names
          const column = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          updates.push(`${column} = $${paramCounter}`);
          values.push(value);
          paramCounter++;
        }
      });
      
      values.push(id); // Add ID as the last parameter
      
      const result = await executeQuery(
        `UPDATE nutricionistas SET ${updates.join(', ')} WHERE id = $${paramCounter} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        throw new Error(`Nutritionist with id ${id} not found`);
      }
      
      const row = result.rows[0];
      return {
        ...row,
        createdAt: formatDate(row.created_at)
      };
    } catch (error) {
      return handleDatabaseError(error, `updating nutritionist with id ${id}`);
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const result = await executeQuery('DELETE FROM nutricionistas WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        throw new Error(`Nutritionist with id ${id} not found`);
      }
    } catch (error) {
      handleDatabaseError(error, `deleting nutritionist with id ${id}`);
    }
  }
};
