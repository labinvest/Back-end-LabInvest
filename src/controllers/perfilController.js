const perfilService = require('../services/perfilService');

const perfilController = {
  async obterMeuPerfil(req, res) {
    try {
      const perfil = await perfilService.obterPorUserId(req.userId);
      res.json({ sucesso: true, dados: perfil });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const perfil = await perfilService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: perfil });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { page, limit, search } = req.query;
      const resultado = await perfilService.listar({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        search,
      });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async atualizarMeuPerfil(req, res) {
    try {
      const perfil = await perfilService.atualizar(req.userId, req.body);
      res.json({ sucesso: true, mensagem: 'Perfil atualizado', dados: perfil });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = perfilController;
