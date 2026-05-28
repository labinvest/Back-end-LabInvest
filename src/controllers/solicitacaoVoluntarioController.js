const solicitacaoVoluntarioService = require('../services/solicitacaoVoluntarioService');

const solicitacaoVoluntarioController = {
  async criar(req, res) {
    try {
      const resultado = await solicitacaoVoluntarioService.criar(req.userId, req.body || {});
      res.status(201).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async minhas(req, res) {
    try {
      const resultado = await solicitacaoVoluntarioService.minhasSolicitacoes(req.userId);
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { page, limit, status, search } = req.query;
      const resultado = await solicitacaoVoluntarioService.listar({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status,
        search,
      });
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async aprovar(req, res) {
    try {
      const resultado = await solicitacaoVoluntarioService.aprovar(parseInt(req.params.id), req.userId);
      res.status(200).json({ sucesso: true, mensagem: 'Solicitação aprovada', dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async rejeitar(req, res) {
    try {
      const { observacaoAdmin } = req.body || {};
      const resultado = await solicitacaoVoluntarioService.rejeitar(parseInt(req.params.id), req.userId, observacaoAdmin);
      res.status(200).json({ sucesso: true, mensagem: 'Solicitação rejeitada', dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = solicitacaoVoluntarioController;