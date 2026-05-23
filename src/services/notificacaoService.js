const prisma = require('../lib/prisma');

class NotificacaoService {
  async criar(dados) {
    const { perfilId, titulo, mensagem, tipo } = dados;

    if (!perfilId || !titulo || !mensagem || !tipo) {
      throw new Error('perfilId, titulo, mensagem e tipo são obrigatórios');
    }

    const tiposValidos = ['AGENDAMENTO', 'PAGAMENTO', 'CHAT', 'AVALIACAO', 'SISTEMA'];
    if (!tiposValidos.includes(tipo.toUpperCase())) {
      throw new Error(`Tipo inválido. Use: ${tiposValidos.join(', ')}`);
    }

    return prisma.notificacao.create({
      data: {
        perfilId: parseInt(perfilId),
        titulo,
        mensagem,
        tipo: tipo.toUpperCase(),
        lido: false,
      },
    });
  }

  async listarPorPerfil(perfilId, filtros = {}) {
    const { page = 1, limit = 20, apenasNaoLidas } = filtros;
    const skip = (page - 1) * limit;

    const where = { perfilId: parseInt(perfilId) };
    if (apenasNaoLidas === 'true' || apenasNaoLidas === true) where.lido = false;

    const [notificacoes, total, totalNaoLidas] = await Promise.all([
      prisma.notificacao.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notificacao.count({ where }),
      prisma.notificacao.count({ where: { perfilId: parseInt(perfilId), lido: false } }),
    ]);

    return {
      notificacoes,
      totalNaoLidas,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async marcarComoLida(id, perfilId) {
    const notificacao = await prisma.notificacao.findUnique({ where: { id: parseInt(id) } });
    if (!notificacao) throw new Error('Notificação não encontrada');
    if (notificacao.perfilId !== parseInt(perfilId)) throw new Error('Sem permissão para esta notificação');

    return prisma.notificacao.update({
      where: { id: parseInt(id) },
      data: { lido: true },
    });
  }

  async marcarTodasComoLidas(perfilId) {
    const { count } = await prisma.notificacao.updateMany({
      where: { perfilId: parseInt(perfilId), lido: false },
      data: { lido: true },
    });

    return { mensagem: `${count} notificação(ões) marcada(s) como lida(s)` };
  }

  async deletar(id, perfilId) {
    const notificacao = await prisma.notificacao.findUnique({ where: { id: parseInt(id) } });
    if (!notificacao) throw new Error('Notificação não encontrada');
    if (notificacao.perfilId !== parseInt(perfilId)) throw new Error('Sem permissão para esta notificação');

    await prisma.notificacao.delete({ where: { id: parseInt(id) } });
    return { mensagem: 'Notificação deletada com sucesso' };
  }
}

module.exports = new NotificacaoService();
