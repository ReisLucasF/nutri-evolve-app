
// This file provides a browser-friendly database interface
// It uses a client-side simulation for development and would use API calls in production

// Mock database functionality for browser environment
class BrowserDatabase {
  constructor(connectionString) {
    this.connectionString = connectionString;
    console.log('Database connection initialized with:', connectionString);
    
    // Log a warning about running in browser
    console.warn('Running PostgreSQL client in browser environment - for development only');
  }
  
  async query(text, params) {
    console.log('Query executed:', { text, params });
    
    // In production, this would make an API call to a server endpoint
    // that would execute the query on the database
    
    // For now, we'll return mock data based on query patterns
    if (text.includes('SELECT * FROM nutricionistas')) {
      return {
        rows: [
          {
            id: '1',
            nome: 'Dr. Ana Silva',
            email: 'ana.silva@example.com',
            crn: 'CRN-3 12345',
            telefone: '(11) 99999-8888',
            especialidade: 'Nutrição Esportiva',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            nome: 'Dr. Carlos Mendes',
            email: 'carlos.mendes@example.com',
            crn: 'CRN-3 67890',
            telefone: '(11) 98765-4321',
            especialidade: 'Nutrição Clínica',
            created_at: new Date().toISOString()
          }
        ]
      };
    } else if (text.includes('SELECT * FROM pacientes')) {
      return {
        rows: [
          {
            id: '1',
            nutricionista_id: '1',
            nome: 'João Silva',
            email: 'joao.silva@example.com',
            data_nascimento: '1990-01-15',
            sexo: 'Masculino',
            telefone: '(11) 12345-6789',
            created_at: new Date().toISOString()
          }
        ]
      };
    } else if (text.includes('INSERT INTO')) {
      return {
        rows: [{
          id: Math.floor(Math.random() * 1000).toString(),
          ...params.reduce((acc, val, idx) => {
            // Create object from params
            acc[`param${idx}`] = val;
            return acc;
          }, {}),
          created_at: new Date().toISOString()
        }]
      };
    } else if (text.includes('UPDATE')) {
      return {
        rows: [{
          id: params[params.length - 1], // Assuming ID is the last parameter
          ...params.slice(0, -1).reduce((acc, val, idx) => {
            acc[`param${idx}`] = val;
            return acc;
          }, {}),
          created_at: new Date().toISOString()
        }]
      };
    } else if (text.includes('DELETE')) {
      return { rows: [] };
    }
    
    return { rows: [] };
  }
}

// Create a singleton database connection
const connectionString = 'postgresql://nutriappdb_owner:npg_GSmYLI80pQMs@ep-green-fog-acl7wliu-pooler.sa-east-1.aws.neon.tech/nutriappdb?sslmode=require';
const browserDb = new BrowserDatabase(connectionString);

// Execute database queries
export const executeQuery = async (text, params) => {
  try {
    const result = await browserDb.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// No need for process.on('SIGINT') in the browser
