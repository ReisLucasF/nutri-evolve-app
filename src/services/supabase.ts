
import { createClient } from '@supabase/supabase-js';
import { Nutricionista, Paciente } from '@/models';

// Supabase connection
const supabaseUrl = 'https://supabase-public-url.supabase.co';
const supabaseKey = 'your-public-anon-key';

// Database connection string (for reference only, not used directly in frontend)
// const connectionString = 'postgresql://nutriappdb_owner:npg_GSmYLI80pQMs@ep-green-fog-acl7wliu-pooler.sa-east-1.aws.neon.tech/nutriappdb?sslmode=require';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Nutritionist Services
export const nutritionistService = {
  async getAll(): Promise<Nutricionista[]> {
    const { data, error } = await supabase
      .from('nutritionists')
      .select('*');
    
    if (error) {
      console.error('Error fetching nutritionists:', error);
      throw new Error(error.message);
    }
    
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.created_at)
    }));
  },
  
  async getById(id: string): Promise<Nutricionista | null> {
    const { data, error } = await supabase
      .from('nutritionists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    if (!data) return null;
    
    return {
      ...data,
      createdAt: new Date(data.created_at)
    };
  },
  
  async create(nutritionist: Omit<Nutricionista, 'id' | 'createdAt'>): Promise<Nutricionista> {
    const { data, error } = await supabase
      .from('nutritionists')
      .insert([{
        nome: nutritionist.nome,
        email: nutritionist.email,
        crn: nutritionist.crn,
        telefone: nutritionist.telefone || null,
        especialidade: nutritionist.especialidade || null,
        foto: nutritionist.foto || null,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating nutritionist:', error);
      throw new Error(error.message);
    }
    
    return {
      ...data,
      createdAt: new Date(data.created_at)
    };
  },
  
  async update(id: string, nutritionist: Partial<Nutricionista>): Promise<Nutricionista> {
    const { data, error } = await supabase
      .from('nutritionists')
      .update({
        nome: nutritionist.nome,
        email: nutritionist.email,
        crn: nutritionist.crn,
        telefone: nutritionist.telefone || null,
        especialidade: nutritionist.especialidade || null,
        foto: nutritionist.foto || null,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return {
      ...data,
      createdAt: new Date(data.created_at)
    };
  },
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('nutritionists')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting nutritionist with id ${id}:`, error);
      throw new Error(error.message);
    }
  }
};

// Patient Services
export const patientService = {
  async getAll(): Promise<Paciente[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
    
    if (error) {
      console.error('Error fetching patients:', error);
      throw new Error(error.message);
    }
    
    return data.map((item: any) => ({
      ...item,
      dataNascimento: new Date(item.data_nascimento),
      createdAt: new Date(item.created_at)
    }));
  },
  
  async getById(id: string): Promise<Paciente | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching patient with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    if (!data) return null;
    
    return {
      ...data,
      dataNascimento: new Date(data.data_nascimento),
      createdAt: new Date(data.created_at)
    };
  },
  
  async create(patient: Omit<Paciente, 'id' | 'createdAt'>): Promise<Paciente> {
    const { data, error } = await supabase
      .from('patients')
      .insert([{
        nutricionista_id: patient.nutricionistaId,
        nome: patient.nome,
        email: patient.email,
        data_nascimento: patient.dataNascimento.toISOString(),
        sexo: patient.sexo,
        telefone: patient.telefone || null,
        endereco: patient.endereco || null,
        observacoes: patient.observacoes || null,
        foto: patient.foto || null,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating patient:', error);
      throw new Error(error.message);
    }
    
    return {
      ...data,
      nutricionistaId: data.nutricionista_id,
      dataNascimento: new Date(data.data_nascimento),
      createdAt: new Date(data.created_at)
    };
  },
  
  async update(id: string, patient: Partial<Paciente>): Promise<Paciente> {
    const { data, error } = await supabase
      .from('patients')
      .update({
        nutricionista_id: patient.nutricionistaId,
        nome: patient.nome,
        email: patient.email,
        data_nascimento: patient.dataNascimento?.toISOString(),
        sexo: patient.sexo,
        telefone: patient.telefone || null,
        endereco: patient.endereco || null,
        observacoes: patient.observacoes || null,
        foto: patient.foto || null,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating patient with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return {
      ...data,
      nutricionistaId: data.nutricionista_id,
      dataNascimento: new Date(data.data_nascimento),
      createdAt: new Date(data.created_at)
    };
  },
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting patient with id ${id}:`, error);
      throw new Error(error.message);
    }
  }
};
