const prisma = require('../lib/prisma');

class AvaliacaoService {
  async criar(dados) {
    const { perfilId, voluntarioId, agendamentoId, classificacao, comentario } = dados;

    if (!perfilId || !classificacao) {
      throw new Error('perfilId e classificacao são obrigatórios');
    }
    if (classificacao < 1 || classificacao > 5) {
      throw new Error('classificacao deve ser entre 1 e 5');
    }

    const perfil = await prisma.perfil.findUnique({ where: { id: parseInt(perfilId) } });
    if (!perfil) throw new Error('Perfil não encontrado');

    if (agendamentoId) {
      const existente = await prisma.avaliacao.findUnique({
        where: { perfilId_agendamentoId: { perfilId: parseInt(perfilId), agendamentoId: parseInt(agendamentoId) } },
      });
      if (existente) throw new Error('Já existe uma avaliação para este agendamento');
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        perfilId: parseInt(perfilId),
        voluntarioId: voluntarioId ? parseInt(voluntarioId) : null,
        agendamentoId: agendamentoId ? parseInt(agendamentoId) : null,
        classificacao: parseInt(classificacao),
        comentario: comentario || null,
      },
      include: {
        perfil: { select: { id: true, nome: true } },
        voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
      },
    });

    // Atualizar média do voluntário
    if (voluntarioId) {
      await this._atualizarMediaVoluntario(parseInt(voluntarioId));
    }

    return avaliacao;
  }

  async _atualizarMediaVoluntario(voluntarioId) {
    const { _avg } = await prisma.avaliacao.aggregate({
      where: { voluntarioId },
      _avg: { classificacao: true },
    });

    await prisma.voluntario.update({
      where: { id: voluntarioId },
      data: { avaliacaoMedia: _avg.classificacao || 0 },
    });
  }

  async listar(filtros = {}) {
    const { page = 1, limit = 20, voluntarioId, perfilId } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (voluntarioId) where.voluntarioId = parseInt(voluntarioId);
    if (perfilId) where.perfilId = parseInt(perfilId);

    const [avaliacoes, total] = await Promise.all([
      prisma.avaliacao.findMany({
        where,
        skip,
        take: limit,
        include: {
          perfil: { select: { id: true, nome: true } },
          voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.avaliacao.count({ where }),
    ]);

    return {
      avaliacoes,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async obterPorId(id) {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: parseInt(id) },
      include: {
        perfil: { select: { id: true, nome: true } },
        voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
      },
    });
    if (!avaliacao) throw new Error('Avaliação não encontrada');
    return avaliacao;
  }

  async deletar(id) {
    const avaliacao = await prisma.avaliacao.findUnique({ where: { id: parseInt(id) } });
    if (!avaliacao) throw new Error('Avaliação não encontrada');

    await prisma.avaliacao.delete({ where: { id: parseInt(id) } });

    // Recalcular média do voluntário
    if (avaliacao.voluntarioId) {
      await this._atualizarMediaVoluntario(avaliacao.voluntarioId);
    }

    return { mensagem: 'Avaliação removida com sucesso' };
  }
}

module.exports = new AvaliacaoService();
