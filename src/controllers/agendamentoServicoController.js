const agendamentoServicoService = require('../services/agendamentoServicoService');

class AgendamentoServicoController {
  // POST /api/agendamento-servico - Criar associação
  async criar(req, res) {
    try {
      const { agendamentoId, servicoId } = req.body;

      if (!agendamentoId || !servicoId) {
        return res.status(400).json({
          sucesso: false,
          erro: 'agendamentoId e servicoId são obrigatórios',
        });
      }

      const associacao = await agendamentoServicoService.criar(
        agendamentoId,
        servicoId
      );

      res.status(201).json({
        sucesso: true,
        dados: associacao,
      });
    } catch (erro) {
      console.error('Erro ao criar associação:', erro);
      res.status(400).json({
        sucesso: false,
        erro: erro.message || 'Erro ao criar associação',
      });
    }
  }

  // GET /api/agendamento-servico/agendamento/:agendamentoId - Listar serviços
  async listarServicosAgendamento(req, res) {
    try {
      const { agendamentoId } = req.params;
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 20;

      const resultado = await agendamentoServicoService.listarServicosAgendamento(
        agendamentoId,
        pagina,
        limite
      );

      res.json({
        sucesso: true,
        dados: resultado.servicos,
        paginacao: resultado.paginacao,
      });
    } catch (erro) {
      console.error('Erro ao listar serviços:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao listar serviços',
      });
    }
  }

  // GET /api/agendamento-servico/servico/:servicoId - Listar agendamentos
  async listarAgendamentosServico(req, res) {
    try {
      const { servicoId } = req.params;
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 20;

      const resultado = await agendamentoServicoService.listarAgendamentosServico(
        servicoId,
        pagina,
        limite
      );

      res.json({
        sucesso: true,
        dados: resultado.agendamentos,
        paginacao: resultado.paginacao,
      });
    } catch (erro) {
      console.error('Erro ao listar agendamentos:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao listar agendamentos',
      });
    }
  }

  // GET /api/agendamento-servico - Listar todas as associações
  async listarTodas(req, res) {
    try {
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 50;

      const resultado = await agendamentoServicoService.listarTodas(pagina, limite);

      res.json({
        sucesso: true,
        dados: resultado.associacoes,
        paginacao: resultado.paginacao,
      });
    } catch (erro) {
      console.error('Erro ao listar associações:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao listar associações',
      });
    }
  }

  // GET /api/agendamento-servico/:agendamentoId/:servicoId - Obter associação
  async obter(req, res) {
    try {
      const { agendamentoId, servicoId } = req.params;

      const associacao = await agendamentoServicoService.obter(
        agendamentoId,
        servicoId
      );

      res.json({
        sucesso: true,
        dados: associacao,
      });
    } catch (erro) {
      console.error('Erro ao obter associação:', erro);
      res.status(404).json({
        sucesso: false,
        erro: erro.message || 'Associação não encontrada',
      });
    }
  }

  // DELETE /api/agendamento-servico/:agendamentoId/:servicoId - Deletar
  async deletar(req, res) {
    try {
      const { agendamentoId, servicoId } = req.params;

      const resultado = await agendamentoServicoService.deletar(
        agendamentoId,
        servicoId
      );

      res.json({
        sucesso: true,
        dados: resultado,
      });
    } catch (erro) {
      console.error('Erro ao deletar associação:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao deletar associação',
      });
    }
  }

  // GET /api/agendamento-servico/contar/agendamento/:agendamentoId
  async contarServicosAgendamento(req, res) {
    try {
      const { agendamentoId } = req.params;

      const total = await agendamentoServicoService.contarServicosAgendamento(
        agendamentoId
      );

      res.json({
        sucesso: true,
        dados: { total },
      });
    } catch (erro) {
      console.error('Erro ao contar serviços:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao contar serviços',
      });
    }
  }

  // GET /api/agendamento-servico/contar/servico/:servicoId
  async contarAgendamentosServico(req, res) {
    try {
      const { servicoId } = req.params;

      const total = await agendamentoServicoService.contarAgendamentosServico(
        servicoId
      );

      res.json({
        sucesso: true,
        dados: { total },
      });
    } catch (erro) {
      console.error('Erro ao contar agendamentos:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao contar agendamentos',
      });
    }
  }

  // GET /api/agendamento-servico/:agendamentoId/preco - Calcular preço total
  async calcularPrecoTotal(req, res) {
    try {
      const { agendamentoId } = req.params;

      const total = await agendamentoServicoService.calcularPrecoTotal(agendamentoId);

      res.json({
        sucesso: true,
        dados: { precoTotal: total },
      });
    } catch (erro) {
      console.error('Erro ao calcular preço:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao calcular preço',
      });
    }
  }
}

module.exports = new AgendamentoServicoController();
