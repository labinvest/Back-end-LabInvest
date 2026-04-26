const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const prisma = require('./lib/prisma');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensagem: 'Servidor está rodando' });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        endereco: true,
        role: true,
        ativo: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar usuarios', detalhe: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco, role, ativo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'nome, email e senha sao obrigatorios' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: { nome, email, senha: senhaHash, telefone, endereco, role, ativo },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        endereco: true,
        role: true,
        ativo: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ erro: 'email ja cadastrado' });
    }

    res.status(500).json({ erro: 'Erro ao criar usuario', detalhe: error.message });
  }
});

const agendamentoRoutes = require('./routes/agendamentoRoutes');
app.use('/api', agendamentoRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api', chatRoutes);

const servicoRoutes = require('./routes/servicoRoutes');
app.use('/api', servicoRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api', postRoutes);

module.exports = app;

