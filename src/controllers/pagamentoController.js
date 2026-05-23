const pagamentoService = require('../services/pagamentoService');

const pagamentoController = {
  async criar(req, res) {
    try {
      const pagamento = await pagamentoService.criar(req.body);
      res.status(201).json({ sucesso: true, dados: pagamento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { page, limit, status } = req.query;
      const resultado = await pagamentoService.listar({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, status });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const pagamento = await pagamentoService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: pagamento });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async obterPorAgendamento(req, res) {
    try {
      const pagamento = await pagamentoService.obterPorAgendamento(req.params.agendamentoId);
      res.json({ sucesso: true, dados: pagamento });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body;
      const pagamento = await pagamentoService.atualizarStatus(req.params.id, status);
      res.json({ sucesso: true, mensagem: 'Status atualizado', dados: pagamento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = pagamentoController;
