require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensagem: 'Servidor está rodando', timestamp: new Date().toISOString() });
});

// ============================================
// ROTAS
// ============================================

// Autenticação
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Perfil
const perfilRoutes = require('./routes/perfilRoutes');
app.use('/api', perfilRoutes);

// Voluntários
const voluntarioRoutes = require('./routes/voluntarioRoutes');
app.use('/api', voluntarioRoutes);

// Categorias
const categoriaRoutes = require('./routes/categoriaRoutes');
app.use('/api', categoriaRoutes);

// Disponibilidades
const disponibilidadeRoutes = require('./routes/disponibilidadeRoutes');
app.use('/api', disponibilidadeRoutes);

// Serviços
const servicoRoutes = require('./routes/servicoRoutes');
app.use('/api', servicoRoutes);

// Agendamentos
const agendamentoRoutes = require('./routes/agendamentoRoutes');
app.use('/api', agendamentoRoutes);

// Avaliações
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
app.use('/api', avaliacaoRoutes);

// Documentos e Tipos de Documento
const documentoRoutes = require('./routes/documentoRoutes');
app.use('/api', documentoRoutes);

// Postagens
const postRoutes = require('./routes/postRoutes');
app.use('/api', postRoutes);

// Notificações
const notificacaoRoutes = require('./routes/notificacaoRoutes');
app.use('/api', notificacaoRoutes);

// Voluntário-Serviço (associação N:N)
const voluntarioServicoRoutes = require('./routes/voluntarioServicoRoutes');
app.use('/api/voluntario-servico', voluntarioServicoRoutes);

// Solicitação de voluntariado
const solicitacaoVoluntarioRoutes = require('./routes/solicitacaoVoluntarioRoutes');
app.use('/api', solicitacaoVoluntarioRoutes);

// Agendamento-Serviço (associação N:N)
const agendamentoServicoRoutes = require('./routes/agendamentoServicoRoutes');
app.use('/api/agendamento-servico', agendamentoServicoRoutes);

// Admin
const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);

// FAQs
const faqRoutes = require('./routes/faqRoutes');
app.use('/api', faqRoutes);

// Contato
const contatoRoutes = require('./routes/contatoRoutes');
app.use('/api', contatoRoutes);

// ============================================
// SWAGGER
// ============================================

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LabInvest API',
      version: '2.0.0',
      description: 'API do sistema LabInvest — plataforma de voluntariado',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desenvolvimento',
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


app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
});

module.exports = app;
