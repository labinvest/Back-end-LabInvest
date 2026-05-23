const agendamentoService = require('../services/agendamentoService');

class AgendamentoController {
  async criarAgendamento(req, res) {
    try {
      const agendamento = await agendamentoService.criarAgendamento(req.body);
      res.status(201).json({ sucesso: true, dados: agendamento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  }

  async listarAgendamentos(req, res) {
    try {
      const { clientePerfilId, voluntarioPerfilId, status, page, limit } = req.query;
      const resultado = await agendamentoService.listarAgendamentos({
        clientePerfilId,
        voluntarioPerfilId,
        status,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  async obterPorId(req, res) {
    try {
      const agendamento = await agendamentoService.lerAgendamento(req.params.id);
      res.json({ sucesso: true, dados: agendamento });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  }

  async atualizarAgendamento(req, res) {
    try {
      const agendamento = await agendamentoService.atualizarAgendamento(req.params.id, req.body);
      res.json({ sucesso: true, dados: agendamento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  }

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body;
      const agendamento = await agendamentoService.atualizarStatus(req.params.id, status);
      res.json({ sucesso: true, dados: agendamento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  }

  async excluirAgendamento(req, res) {
    try {
      const resultado = await agendamentoService.excluirAgendamento(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  }
}

module.exports = new AgendamentoController();
