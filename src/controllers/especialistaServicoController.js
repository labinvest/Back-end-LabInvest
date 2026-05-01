const especialistaServicoService = require('../services/especialistaServicoService');

class EspecialistaServicoController {
  // POST /api/especialista-servico - Criar associação
  async criar(req, res) {
    try {
      const { especialistaId, servicoId } = req.body;

      if (!especialistaId || !servicoId) {
        return res.status(400).json({
          sucesso: false,
          erro: 'especialistaId e servicoId são obrigatórios',
        });
      }

      const associacao = await especialistaServicoService.criar(
        especialistaId,
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

  // GET /api/especialista-servico/especialista/:especialistaId - Listar serviços
  async listarServicosEspecialista(req, res) {
    try {
      const { especialistaId } = req.params;
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 20;

      const resultado = await especialistaServicoService.listarServicosEspecialista(
        especialistaId,
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

  // GET /api/especialista-servico/servico/:servicoId - Listar especialistas
  async listarEspecialistasServico(req, res) {
    try {
      const { servicoId } = req.params;
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 20;

      const resultado = await especialistaServicoService.listarEspecialistasServico(
        servicoId,
        pagina,
        limite
      );

      res.json({
        sucesso: true,
        dados: resultado.especialistas,
        paginacao: resultado.paginacao,
      });
    } catch (erro) {
      console.error('Erro ao listar especialistas:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao listar especialistas',
      });
    }
  }

  // GET /api/especialista-servico - Listar todas as associações
  async listarTodas(req, res) {
    try {
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 50;

      const resultado = await especialistaServicoService.listarTodas(pagina, limite);

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

  // GET /api/especialista-servico/:especialistaId/:servicoId - Obter associação
  async obter(req, res) {
    try {
      const { especialistaId, servicoId } = req.params;

      const associacao = await especialistaServicoService.obter(
        especialistaId,
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

  // DELETE /api/especialista-servico/:especialistaId/:servicoId - Deletar
  async deletar(req, res) {
    try {
      const { especialistaId, servicoId } = req.params;

      const resultado = await especialistaServicoService.deletar(
        especialistaId,
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

  // GET /api/especialista-servico/contar/especialista/:especialistaId
  async contarServicosEspecialista(req, res) {
    try {
      const { especialistaId } = req.params;

      const total = await especialistaServicoService.contarServicosEspecialista(
        especialistaId
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

  // GET /api/especialista-servico/contar/servico/:servicoId
  async contarEspecialistasServico(req, res) {
    try {
      const { servicoId } = req.params;

      const total = await especialistaServicoService.contarEspecialistasServico(
        servicoId
      );

      res.json({
        sucesso: true,
        dados: { total },
      });
    } catch (erro) {
      console.error('Erro ao contar especialistas:', erro);
      res.status(500).json({
        sucesso: false,
        erro: erro.message || 'Erro ao contar especialistas',
      });
    }
  }
}

module.exports = new EspecialistaServicoController();
