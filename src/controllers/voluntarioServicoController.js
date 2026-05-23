const voluntarioServicoService = require('../services/voluntarioServicoService');

class VoluntarioServicoController {
  async criar(req, res) {
    try {
      const { voluntarioId, servicoId } = req.body;
      if (!voluntarioId || !servicoId) {
        return res.status(400).json({ sucesso: false, erro: 'voluntarioId e servicoId são obrigatórios' });
      }
      const associacao = await voluntarioServicoService.criar(voluntarioId, servicoId);
      res.status(201).json({ sucesso: true, dados: associacao });
    } catch (erro) {
      res.status(400).json({ sucesso: false, erro: erro.message });
    }
  }

  async listarServicosVoluntario(req, res) {
    try {
      const { voluntarioId } = req.params;
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 20;
      const resultado = await voluntarioServicoService.listarServicosVoluntario(voluntarioId, pagina, limite);
      res.json({ sucesso: true, dados: resultado.servicos, paginacao: resultado.paginacao });
    } catch (erro) {
      res.status(500).json({ sucesso: false, erro: erro.message });
    }
  }

  async listarVoluntariosServico(req, res) {
    try {
      const { servicoId } = req.params;
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 20;
      const resultado = await voluntarioServicoService.listarVoluntariosServico(servicoId, pagina, limite);
      res.json({ sucesso: true, dados: resultado.voluntarios, paginacao: resultado.paginacao });
    } catch (erro) {
      res.status(500).json({ sucesso: false, erro: erro.message });
    }
  }

  async listarTodas(req, res) {
    try {
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 50;
      const resultado = await voluntarioServicoService.listarTodas(pagina, limite);
      res.json({ sucesso: true, dados: resultado.associacoes, paginacao: resultado.paginacao });
    } catch (erro) {
      res.status(500).json({ sucesso: false, erro: erro.message });
    }
  }

  async obter(req, res) {
    try {
      const { voluntarioId, servicoId } = req.params;
      const associacao = await voluntarioServicoService.obter(voluntarioId, servicoId);
      res.json({ sucesso: true, dados: associacao });
    } catch (erro) {
      res.status(404).json({ sucesso: false, erro: erro.message });
    }
  }

  async deletar(req, res) {
    try {
      const { voluntarioId, servicoId } = req.params;
      const resultado = await voluntarioServicoService.deletar(voluntarioId, servicoId);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (erro) {
      res.status(400).json({ sucesso: false, erro: erro.message });
    }
  }
}

module.exports = new VoluntarioServicoController();
