
// This file provides a client-side interface to the server API

// Helper functions to work with the API server
const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your server URL

// Generic API request function
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'An error occurred with the API request');
    }

    return { rows: Array.isArray(responseData) ? responseData : [responseData] };
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Create a client for API requests
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    console.log('API client initialized with base URL:', baseUrl);
  }
  
  async query(text, params) {
    console.log('Query executed:', { text, params });
    
    // Map SQL queries to API endpoints
    if (text.includes('SELECT * FROM nutricionistas')) {
      if (params.length > 0) {
        return apiRequest(`/nutricionistas/${params[0]}`); // Get by ID
      }
      return apiRequest('/nutricionistas'); // Get all
    } 
    else if (text.includes('SELECT * FROM pacientes')) {
      if (params.length > 0) {
        return apiRequest(`/pacientes/${params[0]}`); // Get by ID
      }
      return apiRequest('/pacientes'); // Get all
    } 
    else if (text.includes('INSERT INTO nutricionistas')) {
      // Extract data from params based on position in the SQL query
      const nutritionistData = {
        nome: params[0],
        email: params[1],
        crn: params[2],
        telefone: params[3],
        especialidade: params[4],
        foto: params[5]
      };
      return apiRequest('/nutricionistas', 'POST', nutritionistData);
    } 
    else if (text.includes('INSERT INTO pacientes')) {
      // Extract data from params
      const patientData = {
        nutricionistaId: params[0],
        nome: params[1],
        email: params[2],
        dataNascimento: params[3],
        sexo: params[4],
        telefone: params[5],
        endereco: params[6],
        observacoes: params[7],
        foto: params[8]
      };
      return apiRequest('/pacientes', 'POST', patientData);
    } 
    else if (text.includes('UPDATE nutricionistas')) {
      // For update, the last param is the ID
      const id = params[params.length - 1];
      
      // Extract data fields from the SQL query and params
      // This is a simplification - in a real app you'd need to parse the SQL more carefully
      const updates = {};
      const columnMappings = {
        'nome': 'nome',
        'email': 'email',
        'crn': 'crn',
        'telefone': 'telefone',
        'especialidade': 'especialidade',
        'foto': 'foto'
      };
      
      // Attempt to extract column names from the query
      const sqlParts = text.split('SET ')[1].split(' WHERE')[0];
      const columnExpressions = sqlParts.split(', ');
      
      columnExpressions.forEach((expr, index) => {
        const column = expr.split(' = ')[0].trim();
        const sqlColumnName = Object.keys(columnMappings).find(key => column === key || column === column.toLowerCase());
        
        if (sqlColumnName) {
          updates[columnMappings[sqlColumnName]] = params[index];
        }
      });
      
      return apiRequest(`/nutricionistas/${id}`, 'PUT', updates);
    } 
    else if (text.includes('UPDATE pacientes')) {
      // Similar to nutritionists update
      const id = params[params.length - 1];
      // Implementation would be similar to nutritionists
      return apiRequest(`/pacientes/${id}`, 'PUT', { /* patient data */ });
    } 
    else if (text.includes('DELETE FROM nutricionistas')) {
      const id = params[0];
      return apiRequest(`/nutricionistas/${id}`, 'DELETE');
    } 
    else if (text.includes('DELETE FROM pacientes')) {
      const id = params[0];
      return apiRequest(`/pacientes/${id}`, 'DELETE');
    } 
    
    // Default fallback to mock data for unsupported queries
    console.warn('Unsupported query pattern, returning mock data:', text);
    return { rows: [] };
  }
}

// Create a singleton API client
const apiBaseUrl = API_BASE_URL;
const apiClient = new ApiClient(apiBaseUrl);

// Execute database queries via API
export const executeQuery = async (text, params) => {
  try {
    const result = await apiClient.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
