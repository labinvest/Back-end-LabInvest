const notificacaoService = require('../services/notificacaoService');

const notificacaoController = {
  async criar(req, res) {
    try {
      const notificacao = await notificacaoService.criar(req.body);
      res.status(201).json({ sucesso: true, dados: notificacao });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listarMinhas(req, res) {
    try {
      // perfilId deve vir do token (future improvement: salvar perfilId no token)
      const { perfilId } = req.query;
      if (!perfilId) return res.status(400).json({ sucesso: false, erro: 'perfilId é obrigatório' });

      const { page, limit, apenasNaoLidas } = req.query;
      const resultado = await notificacaoService.listarPorPerfil(perfilId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        apenasNaoLidas,
      });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async marcarComoLida(req, res) {
    try {
      const { perfilId } = req.body;
      if (!perfilId) return res.status(400).json({ sucesso: false, erro: 'perfilId é obrigatório' });

      const notificacao = await notificacaoService.marcarComoLida(req.params.id, perfilId);
      res.json({ sucesso: true, dados: notificacao });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async marcarTodasComoLidas(req, res) {
    try {
      const { perfilId } = req.body;
      if (!perfilId) return res.status(400).json({ sucesso: false, erro: 'perfilId é obrigatório' });

      const resultado = await notificacaoService.marcarTodasComoLidas(perfilId);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { perfilId } = req.body;
      if (!perfilId) return res.status(400).json({ sucesso: false, erro: 'perfilId é obrigatório' });

      const resultado = await notificacaoService.deletar(req.params.id, perfilId);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = notificacaoController;
