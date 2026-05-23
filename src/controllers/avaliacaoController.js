const avaliacaoService = require('../services/avaliacaoService');

const avaliacaoController = {
  async criar(req, res) {
    try {
      const avaliacao = await avaliacaoService.criar(req.body);
      res.status(201).json({ sucesso: true, dados: avaliacao });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { page, limit, voluntarioId, perfilId } = req.query;
      const resultado = await avaliacaoService.listar({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, voluntarioId, perfilId });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const avaliacao = await avaliacaoService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: avaliacao });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const resultado = await avaliacaoService.deletar(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = avaliacaoController;
