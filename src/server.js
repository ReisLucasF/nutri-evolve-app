
// Express server to connect to PostgreSQL database
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://nutriappdb_owner:npg_GSmYLI80pQMs@ep-green-fog-acl7wliu-pooler.sa-east-1.aws.neon.tech/nutriappdb?sslmode=require',
  ssl: {
    rejectUnauthorized: false // Important for connecting to some cloud databases
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to database:', err);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// API Routes

// Nutritionists
app.get('/api/nutricionistas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nutricionistas ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching nutritionists:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nutricionistas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM nutricionistas WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nutritionist not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching nutritionist:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/nutricionistas', async (req, res) => {
  try {
    const { nome, email, crn, telefone, especialidade, foto } = req.body;
    
    const result = await pool.query(
      'INSERT INTO nutricionistas (nome, email, crn, telefone, especialidade, foto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, email, crn, telefone || null, especialidade || null, foto || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating nutritionist:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/nutricionistas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, crn, telefone, especialidade, foto } = req.body;
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramCounter = 1;
    
    if (nome !== undefined) {
      updates.push(`nome = $${paramCounter}`);
      values.push(nome);
      paramCounter++;
    }
    
    if (email !== undefined) {
      updates.push(`email = $${paramCounter}`);
      values.push(email);
      paramCounter++;
    }
    
    if (crn !== undefined) {
      updates.push(`crn = $${paramCounter}`);
      values.push(crn);
      paramCounter++;
    }
    
    if (telefone !== undefined) {
      updates.push(`telefone = $${paramCounter}`);
      values.push(telefone);
      paramCounter++;
    }
    
    if (especialidade !== undefined) {
      updates.push(`especialidade = $${paramCounter}`);
      values.push(especialidade);
      paramCounter++;
    }
    
    if (foto !== undefined) {
      updates.push(`foto = $${paramCounter}`);
      values.push(foto);
      paramCounter++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    
    const result = await pool.query(
      `UPDATE nutricionistas SET ${updates.join(', ')} WHERE id = $${paramCounter} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nutritionist not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating nutritionist:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/nutricionistas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM nutricionistas WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nutritionist not found' });
    }
    
    res.json({ message: 'Nutritionist deleted successfully' });
  } catch (error) {
    console.error('Error deleting nutritionist:', error);
    res.status(500).json({ error: error.message });
  }
});

// Patients
app.get('/api/pacientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pacientes ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pacientes', async (req, res) => {
  try {
    const { nutricionistaId, nome, email, dataNascimento, sexo, telefone, endereco, observacoes, foto } = req.body;
    
    const result = await pool.query(
      `INSERT INTO pacientes 
       (nutricionista_id, nome, email, data_nascimento, sexo, telefone, endereco, observacoes, foto) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [nutricionistaId, nome, email, dataNascimento, sexo, telefone || null, endereco || null, observacoes || null, foto || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nutricionistaId, nome, email, dataNascimento, sexo, telefone, endereco, observacoes, foto } = req.body;
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCounter = 1;
    
    if (nutricionistaId !== undefined) {
      updates.push(`nutricionista_id = $${paramCounter}`);
      values.push(nutricionistaId);
      paramCounter++;
    }
    
    if (nome !== undefined) {
      updates.push(`nome = $${paramCounter}`);
      values.push(nome);
      paramCounter++;
    }
    
    if (email !== undefined) {
      updates.push(`email = $${paramCounter}`);
      values.push(email);
      paramCounter++;
    }
    
    if (dataNascimento !== undefined) {
      updates.push(`data_nascimento = $${paramCounter}`);
      values.push(dataNascimento);
      paramCounter++;
    }
    
    if (sexo !== undefined) {
      updates.push(`sexo = $${paramCounter}`);
      values.push(sexo);
      paramCounter++;
    }
    
    if (telefone !== undefined) {
      updates.push(`telefone = $${paramCounter}`);
      values.push(telefone);
      paramCounter++;
    }
    
    if (endereco !== undefined) {
      updates.push(`endereco = $${paramCounter}`);
      values.push(endereco);
      paramCounter++;
    }
    
    if (observacoes !== undefined) {
      updates.push(`observacoes = $${paramCounter}`);
      values.push(observacoes);
      paramCounter++;
    }
    
    if (foto !== undefined) {
      updates.push(`foto = $${paramCounter}`);
      values.push(foto);
      paramCounter++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    
    const result = await pool.query(
      `UPDATE pacientes SET ${updates.join(', ')} WHERE id = $${paramCounter} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM pacientes WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// For development purposes only
if (process.env.NODE_ENV !== 'production') {
  console.log('Server running in development mode');
  console.log('Available endpoints:');
  console.log('GET    /api/nutricionistas');
  console.log('GET    /api/nutricionistas/:id');
  console.log('POST   /api/nutricionistas');
  console.log('PUT    /api/nutricionistas/:id');
  console.log('DELETE /api/nutricionistas/:id');
  console.log('GET    /api/pacientes');
  console.log('GET    /api/pacientes/:id');
  console.log('POST   /api/pacientes');
  console.log('PUT    /api/pacientes/:id');
  console.log('DELETE /api/pacientes/:id');
}

// Process termination handling
process.on('SIGINT', () => {
  pool.end();
  console.log('Database connection closed');
  process.exit(0);
});
