const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const prisma = require('./lib/prisma');

const app = express();
  const swaggerUi = require('swagger-ui-express');
   const swaggerJSDoc = require('swagger-jsdoc');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mensagem: 'Servidor está rodando'
  });
});

// ROTAS
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const debugRoutes = require('./routes/debugRoutes');
app.use('/api', debugRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);

const agendamentoRoutes = require('./routes/agendamentoRoutes');
app.use('/api', agendamentoRoutes);

const servicoRoutes = require('./routes/servicoRoutes');
app.use('/api', servicoRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api', postRoutes);


const especialistaServicoRoutes = require('./routes/especialistaServicoRoutes');
app.use('/api/especialista-servico', especialistaServicoRoutes);

const agendamentoServicoRoutes = require('./routes/agendamentoServicoRoutes');
app.use('/api/agendamento-servico', agendamentoServicoRoutes);

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lab Invest API',
      version: '1.0.0',
      description: 'API documentation for Lab Invest',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;