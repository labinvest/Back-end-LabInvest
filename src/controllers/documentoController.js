const documentoService = require('../services/documentoService');

const documentoController = {
  async criar(req, res) {
    try {
      const documento = await documentoService.criar(req.body);
      res.status(201).json({ sucesso: true, dados: documento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { page, limit, voluntarioId, status } = req.query;
      const resultado = await documentoService.listar({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, voluntarioId, status });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const documento = await documentoService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: documento });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async listarPorVoluntario(req, res) {
    try {
      const documentos = await documentoService.listarPorVoluntario(req.params.voluntarioId);
      res.json({ sucesso: true, dados: documentos });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { statusValidacao } = req.body;
      const documento = await documentoService.atualizarStatus(req.params.id, statusValidacao);
      res.json({ sucesso: true, mensagem: 'Status atualizado', dados: documento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const resultado = await documentoService.deletar(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = documentoController;
