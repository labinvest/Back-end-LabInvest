const tipoDocumentoService = require('../services/tipoDocumentoService');

const tipoDocumentoController = {
  async criar(req, res) {
    try {
      const tipo = await tipoDocumentoService.criar(req.body);
      res.status(201).json({ sucesso: true, dados: tipo });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { ativo } = req.query;
      const tipos = await tipoDocumentoService.listar({ ativo });
      res.json({ sucesso: true, dados: tipos });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const tipo = await tipoDocumentoService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: tipo });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const tipo = await tipoDocumentoService.atualizar(req.params.id, req.body);
      res.json({ sucesso: true, mensagem: 'Tipo atualizado', dados: tipo });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const resultado = await tipoDocumentoService.deletar(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = tipoDocumentoController;
