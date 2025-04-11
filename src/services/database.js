
import pkg from 'pg';
const { Pool } = pkg;

// Configuração direta da conexão com o PostgreSQL usando a URI
const connectionString = 'postgresql://nutriappdb_owner:npg_GSmYLI80pQMs@ep-green-fog-acl7wliu-pooler.sa-east-1.aws.neon.tech/nutriappdb?sslmode=require';

const pool = new Pool({ connectionString });

// Teste de conexão ao inicializar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados estabelecida com sucesso!', res.rows[0]);
  }
});

// Wrapper para execução de queries
const executeQuery = async (text, params) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  }
};

export {
  executeQuery,
  pool
};
