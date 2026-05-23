const voluntarioService = require('../services/voluntarioService');

const voluntarioController = {
  async criar(req, res) {
    try {
      const { perfilId, ...dados } = req.body;
      if (!perfilId) return res.status(400).json({ sucesso: false, erro: 'perfilId é obrigatório' });
      const voluntario = await voluntarioService.criar(perfilId, dados);
      res.status(201).json({ sucesso: true, dados: voluntario });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { page, limit, search, categoriaId, ativo } = req.query;
      const resultado = await voluntarioService.listar({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, search, categoriaId, ativo });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const voluntario = await voluntarioService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: voluntario });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async obterMeuPerfil(req, res) {
    try {
      // Busca o voluntário pelo perfilId do token (req.userId é o userId, precisamos do perfilId)
      const { perfilId } = req.query;
      if (!perfilId) return res.status(400).json({ sucesso: false, erro: 'perfilId é obrigatório' });
      const voluntario = await voluntarioService.obterPorPerfilId(perfilId);
      res.json({ sucesso: true, dados: voluntario });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const voluntario = await voluntarioService.atualizar(req.params.id, req.body);
      res.json({ sucesso: true, mensagem: 'Voluntário atualizado', dados: voluntario });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const resultado = await voluntarioService.deletar(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = voluntarioController;
