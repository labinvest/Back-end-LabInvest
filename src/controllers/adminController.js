const adminService = require('../services/adminService');

const adminController = {
  // ============================================
  // USUÁRIOS
  // ============================================

  async listarUsuarios(req, res) {
    try {
      const { page, limit, role, ativo, search } = req.query;
      const resultado = await adminService.listarUsuarios({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        role,
        ativo,
        search
      });

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async obterUsuario(req, res) {
    try {
      const { id } = req.params;
      const usuario = await adminService.obterUsuario(parseInt(id));

      res.status(200).json({
        sucesso: true,
        dados: usuario
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async editarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, endereco, ativo } = req.body;

      const usuario = await adminService.editarUsuario(parseInt(id), {
        nome,
        email,
        telefone,
        endereco,
        ativo
      });

      res.status(200).json({
        sucesso: true,
        mensagem: 'Usuário atualizado com sucesso',
        dados: usuario
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async mudarRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const usuario = await adminService.mudarRole(parseInt(id), role);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Role atualizada com sucesso',
        dados: usuario
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletarUsuario(req, res) {
    try {
      const { id } = req.params;
      const resultado = await adminService.deletarUsuario(parseInt(id));

      res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async resetarSenha(req, res) {
    try {
      const { id } = req.params;
      const { novaSenha } = req.body;

      const resultado = await adminService.resetarSenha(parseInt(id), novaSenha);

      res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  // ============================================
  // ESPECIALISTAS
  // ============================================

  async listarEspecialistas(req, res) {
    try {
      const { page, limit, search } = req.query;
      const resultado = await adminService.listarEspecialistas({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        search
      });

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
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
      const resultado = await adminService.listarServicos({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        ativo,
        search
      });

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async criarServico(req, res) {
    try {
      const { nome, descricao, preco } = req.body;

      const servico = await adminService.criarServico({
        nome,
        descricao,
        preco
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Serviço criado com sucesso',
        dados: servico
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async editarServico(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, ativo } = req.body;

      const servico = await adminService.editarServico(parseInt(id), {
        nome,
        descricao,
        preco,
        ativo
      });

      res.status(200).json({
        sucesso: true,
        mensagem: 'Serviço atualizado com sucesso',
        dados: servico
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletarServico(req, res) {
    try {
      const { id } = req.params;
      const resultado = await adminService.deletarServico(parseInt(id));

      res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
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
      const resultado = await adminService.listarAgendamentos({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status
      });

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async cancelarAgendamento(req, res) {
    try {
      const { id } = req.params;
      const agendamento = await adminService.cancelarAgendamento(parseInt(id));

      res.status(200).json({
        sucesso: true,
        mensagem: 'Agendamento cancelado com sucesso',
        dados: agendamento
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  // ============================================
  // CHATS
  // ============================================

  async listarChats(req, res) {
    try {
      const { page, limit, status } = req.query;
      const resultado = await adminService.listarChats({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status
      });

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async fecharChat(req, res) {
    try {
      const { id } = req.params;
      const chat = await adminService.fecharChat(parseInt(id));

      res.status(200).json({
        sucesso: true,
        mensagem: 'Chat fechado com sucesso',
        dados: chat
      });
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
      const resultado = await adminService.listarPostagens({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async deletarPostagem(req, res) {
    try {
      const { id } = req.params;
      const resultado = await adminService.deletarPostagem(parseInt(id));

      res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  // ============================================
  // DASHBOARD E RELATÓRIOS
  // ============================================

  async obterDashboard(req, res) {
    try {
      const { dataInicio, dataFim, especialista, tipo } = req.query;
      const dashboard = await adminService.obterDashboard({
        dataInicio,
        dataFim,
        especialista: especialista ? parseInt(especialista) : null,
        tipo: tipo || 'resumido'
      });

      res.status(200).json({
        sucesso: true,
        dados: dashboard
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async relatorioAgendamentos(req, res) {
    try {
      const { dataInicio, dataFim } = req.query;
      const resultado = await adminService.relatorioAgendamentos({
        dataInicio,
        dataFim
      });

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async relatorioEspecialistas(req, res) {
    try {
      const resultado = await adminService.relatorioEspecialistas();

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async usuariosMaisAtivos(req, res) {
    try {
      const { limite } = req.query;
      const resultado = await adminService.usuariosMaisAtivos(
        parseInt(limite) || 10
      );

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async horariosComMaisDemanda(req, res) {
    try {
      const resultado = await adminService.horariosComMaisDemanda();

      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  }
};

module.exports = adminController;
