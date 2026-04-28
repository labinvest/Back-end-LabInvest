const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

let prisma;

try {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('Erro no pool:', err.message);
  });

  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ 
    adapter,
    log: ['error', 'warn'],
  });

  prisma.$connect()
    .then(() => console.log('Conectado ao banco de dados'))
    .catch((err) => {
      console.error('Erro ao conectar:', err.message);
      process.exit(1);
    });
} catch (error) {
  console.error('Erro ao inicializar Prisma:', error.message);
  process.exit(1);
}

module.exports = prisma;
