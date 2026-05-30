const contatoService = require('../services/contatoService');

const contatoController = {
  async criar(req, res) {
    try {
      const contato = await contatoService.criar(req.body);
      res.status(201).json({ sucesso: true, dados: contato, mensagem: 'Mensagem enviada com sucesso' });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { page, limit, lido } = req.query;
      const resultado = await contatoService.listar({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        lido,
      });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async marcarComoLido(req, res) {
    try {
      const contato = await contatoService.marcarComoLido(req.params.id);
      res.json({ sucesso: true, dados: contato });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const resultado = await contatoService.deletar(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = contatoController;
