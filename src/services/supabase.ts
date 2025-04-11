
import { Nutricionista, Paciente } from '@/models';

// Base URL for your API - replace with your actual API endpoint
const API_BASE_URL = 'https://your-api-endpoint.com/api';

// Utility function for making API requests
const fetchAPI = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API call failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('API request failed:', error);
    throw error;
  }
};

// TEMPORARY SOLUTION FOR DEVELOPMENT
// This allows us to simulate API calls in the browser without a real backend
// Replace this with actual API calls when you have a backend
const mockDatabase = {
  nutritionists: JSON.parse(localStorage.getItem('nutritionists') || '[]'),
  patients: JSON.parse(localStorage.getItem('patients') || '[]'),
  
  saveNutritionists() {
    localStorage.setItem('nutritionists', JSON.stringify(this.nutritionists));
  },
  
  savePatients() {
    localStorage.setItem('patients', JSON.stringify(this.patients));
  }
};

// Initial data population if empty
if (mockDatabase.nutritionists.length === 0) {
  mockDatabase.nutritionists = [
    {
      id: '1',
      nome: 'Nutricionista Exemplo',
      email: 'nutri@example.com',
      crn: 'CRN-5 12345',
      telefone: '(71) 98765-4321',
      especialidade: 'Nutrição Esportiva',
      foto: null,
      createdAt: new Date().toISOString()
    }
  ];
  mockDatabase.saveNutritionists();
}

// Nutritionist Services
export const nutritionistService = {
  async getAll(): Promise<Nutricionista[]> {
    try {
      // In production, this would be a fetch call:
      // const data = await fetchAPI('/nutritionists');
      
      // For development, use the mock implementation:
      return mockDatabase.nutritionists.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    } catch (error: any) {
      console.error('Error fetching nutritionists:', error);
      throw new Error(error.message);
    }
  },
  
  async getById(id: string): Promise<Nutricionista | null> {
    try {
      // In production:
      // const data = await fetchAPI(`/nutritionists/${id}`);
      
      // For development:
      const item = mockDatabase.nutritionists.find(n => n.id === id);
      if (!item) return null;
      
      return {
        ...item,
        createdAt: new Date(item.createdAt)
      };
    } catch (error: any) {
      console.error(`Error fetching nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
  },
  
  async create(nutritionist: Omit<Nutricionista, 'id' | 'createdAt'>): Promise<Nutricionista> {
    try {
      // In production:
      // const data = await fetchAPI('/nutritionists', {
      //   method: 'POST',
      //   body: JSON.stringify(nutritionist)
      // });
      
      // For development:
      const newNutritionist = {
        ...nutritionist,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      mockDatabase.nutritionists.push(newNutritionist);
      mockDatabase.saveNutritionists();
      
      return {
        ...newNutritionist,
        createdAt: new Date(newNutritionist.createdAt)
      };
    } catch (error: any) {
      console.error('Error creating nutritionist:', error);
      throw new Error(error.message);
    }
  },
  
  async update(id: string, nutritionist: Partial<Nutricionista>): Promise<Nutricionista> {
    try {
      // In production:
      // const data = await fetchAPI(`/nutritionists/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(nutritionist)
      // });
      
      // For development:
      const index = mockDatabase.nutritionists.findIndex(n => n.id === id);
      if (index === -1) throw new Error(`Nutritionist with id ${id} not found`);
      
      mockDatabase.nutritionists[index] = {
        ...mockDatabase.nutritionists[index],
        ...nutritionist
      };
      
      mockDatabase.saveNutritionists();
      
      return {
        ...mockDatabase.nutritionists[index],
        createdAt: new Date(mockDatabase.nutritionists[index].createdAt)
      };
    } catch (error: any) {
      console.error(`Error updating nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      // In production:
      // await fetchAPI(`/nutritionists/${id}`, {
      //   method: 'DELETE'
      // });
      
      // For development:
      const index = mockDatabase.nutritionists.findIndex(n => n.id === id);
      if (index !== -1) {
        mockDatabase.nutritionists.splice(index, 1);
        mockDatabase.saveNutritionists();
      }
    } catch (error: any) {
      console.error(`Error deleting nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
  }
};

// Patient Services - Implementation similar to nutritionist service
export const patientService = {
  async getAll(): Promise<Paciente[]> {
    try {
      // For development:
      return mockDatabase.patients.map(item => ({
        ...item,
        dataNascimento: new Date(item.dataNascimento),
        createdAt: new Date(item.createdAt)
      }));
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      throw new Error(error.message);
    }
  },
  
  async getById(id: string): Promise<Paciente | null> {
    try {
      const item = mockDatabase.patients.find(p => p.id === id);
      if (!item) return null;
      
      return {
        ...item,
        dataNascimento: new Date(item.dataNascimento),
        createdAt: new Date(item.createdAt)
      };
    } catch (error: any) {
      console.error(`Error fetching patient with id ${id}:`, error);
      throw new Error(error.message);
    }
  },
  
  async create(patient: Omit<Paciente, 'id' | 'createdAt'>): Promise<Paciente> {
    try {
      const newPatient = {
        ...patient,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        dataNascimento: patient.dataNascimento.toISOString()
      };
      
      mockDatabase.patients.push(newPatient);
      mockDatabase.savePatients();
      
      return {
        ...newPatient,
        dataNascimento: new Date(newPatient.dataNascimento),
        createdAt: new Date(newPatient.createdAt)
      };
    } catch (error: any) {
      console.error('Error creating patient:', error);
      throw new Error(error.message);
    }
  },
  
  async update(id: string, patient: Partial<Paciente>): Promise<Paciente> {
    try {
      const index = mockDatabase.patients.findIndex(p => p.id === id);
      if (index === -1) throw new Error(`Patient with id ${id} not found`);
      
      // Handle date conversion for storage
      const updatedPatient = { ...patient };
      if (updatedPatient.dataNascimento) {
        updatedPatient.dataNascimento = updatedPatient.dataNascimento.toISOString();
      }
      
      mockDatabase.patients[index] = {
        ...mockDatabase.patients[index],
        ...updatedPatient
      };
      
      mockDatabase.savePatients();
      
      return {
        ...mockDatabase.patients[index],
        dataNascimento: new Date(mockDatabase.patients[index].dataNascimento),
        createdAt: new Date(mockDatabase.patients[index].createdAt)
      };
    } catch (error: any) {
      console.error(`Error updating patient with id ${id}:`, error);
      throw new Error(error.message);
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const index = mockDatabase.patients.findIndex(p => p.id === id);
      if (index !== -1) {
        mockDatabase.patients.splice(index, 1);
        mockDatabase.savePatients();
      }
    } catch (error: any) {
      console.error(`Error deleting patient with id ${id}:`, error);
      throw new Error(error.message);
    }
  }
};
