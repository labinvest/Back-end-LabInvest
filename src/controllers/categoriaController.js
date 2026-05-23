const categoriaService = require('../services/categoriaService');

const categoriaController = {
  async criar(req, res) {
    try {
      const categoria = await categoriaService.criar(req.body);
      res.status(201).json({ sucesso: true, dados: categoria });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { page, limit, ativo, search } = req.query;
      const resultado = await categoriaService.listar({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, ativo, search });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const categoria = await categoriaService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: categoria });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const categoria = await categoriaService.atualizar(req.params.id, req.body);
      res.json({ sucesso: true, mensagem: 'Categoria atualizada', dados: categoria });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const resultado = await categoriaService.deletar(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = categoriaController;
