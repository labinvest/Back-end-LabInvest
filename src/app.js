const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testando rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensagem: 'Servidor está rodando' });
});

module.exports = app;

