const disponibilidadeService = require('../services/disponibilidadeService');

const disponibilidadeController = {
  async criar(req, res) {
    try {
      const { voluntarioId } = req.params;
      const disponibilidade = await disponibilidadeService.criar(voluntarioId, req.body);
      res.status(201).json({ sucesso: true, dados: disponibilidade });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listarPorVoluntario(req, res) {
    try {
      const { voluntarioId } = req.params;
      const apenasAtivas = req.query.ativo === 'true';
      const disponibilidades = await disponibilidadeService.listarPorVoluntario(voluntarioId, apenasAtivas);
      res.json({ sucesso: true, dados: disponibilidades });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const disponibilidade = await disponibilidadeService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: disponibilidade });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const disponibilidade = await disponibilidadeService.atualizar(req.params.id, req.body);
      res.json({ sucesso: true, mensagem: 'Disponibilidade atualizada', dados: disponibilidade });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const resultado = await disponibilidadeService.deletar(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = disponibilidadeController;
