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
      const microserviceUrl = process.env.MICROSERVICO_VOLUNTARIO_URL;
      if (!microserviceUrl) {
        return res.status(500).json({ sucesso: false, erro: 'MICROSERVICO_VOLUNTARIO_URL não configurado' });
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`${microserviceUrl}/api/voluntario/aprovar/${req.params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminUserId: req.userId }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      const resultado = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ sucesso: false, erro: resultado.erro || 'Erro no microserviço de aprovação' });
      }

      res.status(200).json({ sucesso: true, mensagem: 'Solicitação aprovada', dados: resultado });
    } catch (error) {
      const mensagem = error.name === 'AbortError' ? 'Microserviço não respondeu a tempo' : error.message;
      res.status(500).json({ sucesso: false, erro: mensagem });
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