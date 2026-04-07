const {Squelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,          // Nome do banco de dados
    process.env.DB_USER,          // Usuário do banco de dados
    process.env.DB_PASSWORD,      // Senha do banco de dados
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    }
);

sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch((err) => {
    console.error('Não foi possível conectar ao banco de dados:', err);
});

module.exports = sequelize;