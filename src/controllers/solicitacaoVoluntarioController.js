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
      const microserviceUrl = process.env.MICROSERVICO_VOLUNTARIO_URL || 'http://localhost:3001';
      const response = await fetch(`${microserviceUrl}/api/voluntario/aprovar/${req.params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUserId: req.userId }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ sucesso: false, erro: resultado.erro || 'Erro no microserviço de aprovação' });
      }

      res.status(200).json({ sucesso: true, mensagem: 'Solicitação aprovada', dados: resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
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