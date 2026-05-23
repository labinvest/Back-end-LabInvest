const adminService = require('../services/adminService');

const adminController = {
  // ============================================
  // USUÁRIOS
  // ============================================

  async listarUsuarios(req, res) {
    try {
      const { page, limit, role, ativo, search } = req.query;
      const resultado = await adminService.listarUsuarios({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, role, ativo, search });
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async obterUsuario(req, res) {
    try {
      const usuario = await adminService.obterUsuario(parseInt(req.params.id));
      res.status(200).json({ sucesso: true, dados: usuario });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },

  async editarUsuario(req, res) {
    try {
      const usuario = await adminService.editarUsuario(parseInt(req.params.id), req.body);
      res.status(200).json({ sucesso: true, mensagem: 'Usuário atualizado', dados: usuario });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async mudarRole(req, res) {
    try {
      const { role } = req.body;
      const usuario = await adminService.mudarRole(parseInt(req.params.id), role);
      res.status(200).json({ sucesso: true, mensagem: 'Role atualizada', dados: usuario });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletarUsuario(req, res) {
    try {
      const resultado = await adminService.deletarUsuario(parseInt(req.params.id));
      res.status(200).json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async resetarSenha(req, res) {
    try {
      const { novaSenha } = req.body;
      const resultado = await adminService.resetarSenha(parseInt(req.params.id), novaSenha);
      res.status(200).json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  // ============================================
  // VOLUNTÁRIOS
  // ============================================

  async listarVoluntarios(req, res) {
    try {
      const { page, limit, search, categoriaId, ativo } = req.query;
      const resultado = await adminService.listarVoluntarios({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, search, categoriaId, ativo });
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  // ============================================
  // SERVIÇOS
  // ============================================

  async listarServicos(req, res) {
    try {
      const { page, limit, ativo, search } = req.query;
      const resultado = await adminService.listarServicos({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, ativo, search });
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async criarServico(req, res) {
    try {
      const servico = await adminService.criarServico(req.body);
      res.status(201).json({ sucesso: true, mensagem: 'Serviço criado', dados: servico });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async editarServico(req, res) {
    try {
      const servico = await adminService.editarServico(parseInt(req.params.id), req.body);
      res.status(200).json({ sucesso: true, mensagem: 'Serviço atualizado', dados: servico });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletarServico(req, res) {
    try {
      const resultado = await adminService.deletarServico(parseInt(req.params.id));
      res.status(200).json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  // ============================================
  // AGENDAMENTOS
  // ============================================

  async listarAgendamentos(req, res) {
    try {
      const { page, limit, status } = req.query;
      const resultado = await adminService.listarAgendamentos({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, status });
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async cancelarAgendamento(req, res) {
    try {
      const agendamento = await adminService.cancelarAgendamento(parseInt(req.params.id));
      res.status(200).json({ sucesso: true, mensagem: 'Agendamento cancelado', dados: agendamento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  // ============================================
  // POSTAGENS
  // ============================================

  async listarPostagens(req, res) {
    try {
      const { page, limit } = req.query;
      const resultado = await adminService.listarPostagens({ page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletarPostagem(req, res) {
    try {
      const resultado = await adminService.deletarPostagem(parseInt(req.params.id));
      res.status(200).json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  // ============================================
  // DASHBOARD E RELATÓRIOS
  // ============================================

  async obterDashboard(req, res) {
    try {
      const { dataInicio, dataFim, tipo } = req.query;
      const dashboard = await adminService.obterDashboard({ dataInicio, dataFim, tipo: tipo || 'resumido' });
      res.status(200).json({ sucesso: true, dados: dashboard });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async relatorioAgendamentos(req, res) {
    try {
      const { dataInicio, dataFim } = req.query;
      const resultado = await adminService.relatorioAgendamentos({ dataInicio, dataFim });
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async relatorioVoluntarios(req, res) {
    try {
      const resultado = await adminService.relatorioVoluntarios();
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async horariosComMaisDemanda(req, res) {
    try {
      const resultado = await adminService.horariosComMaisDemanda();
      res.status(200).json({ sucesso: true, dados: resultado });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = adminController;
