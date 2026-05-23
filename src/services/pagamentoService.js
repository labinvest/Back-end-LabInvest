const prisma = require('../lib/prisma');

class PagamentoService {
  async criar(dados) {
    const { agendamentoId, valor, metodo } = dados;

    if (!agendamentoId || !valor || !metodo) {
      throw new Error('agendamentoId, valor e metodo são obrigatórios');
    }

    const agendamento = await prisma.agendamento.findUnique({ where: { id: parseInt(agendamentoId) } });
    if (!agendamento) throw new Error('Agendamento não encontrado');

    const existente = await prisma.pagamento.findUnique({ where: { agendamentoId: parseInt(agendamentoId) } });
    if (existente) throw new Error('Já existe um pagamento para este agendamento');

    return prisma.pagamento.create({
      data: {
        agendamentoId: parseInt(agendamentoId),
        valor: parseFloat(valor),
        metodo,
        status: 'PENDENTE',
      },
      include: {
        agendamento: { select: { id: true, titulo: true, dataInicio: true, status: true } },
      },
    });
  }

  async listar(filtros = {}) {
    const { page = 1, limit = 20, status } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status.toUpperCase();

    const [pagamentos, total] = await Promise.all([
      prisma.pagamento.findMany({
        where,
        skip,
        take: limit,
        include: {
          agendamento: {
            include: {
              cliente: { select: { id: true, nome: true } },
              voluntario: { select: { id: true, nome: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pagamento.count({ where }),
    ]);

    return {
      pagamentos,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async obterPorId(id) {
    const pagamento = await prisma.pagamento.findUnique({
      where: { id: parseInt(id) },
      include: {
        agendamento: {
          include: {
            cliente: { select: { id: true, nome: true } },
            voluntario: { select: { id: true, nome: true } },
          },
        },
      },
    });
    if (!pagamento) throw new Error('Pagamento não encontrado');
    return pagamento;
  }

  async obterPorAgendamento(agendamentoId) {
    const pagamento = await prisma.pagamento.findUnique({
      where: { agendamentoId: parseInt(agendamentoId) },
      include: { agendamento: { select: { id: true, titulo: true, dataInicio: true } } },
    });
    if (!pagamento) throw new Error('Pagamento não encontrado');
    return pagamento;
  }

  async atualizarStatus(id, status) {
    const statusValidos = ['PENDENTE', 'PAGO', 'CANCELADO'];
    const statusUpper = status?.toUpperCase();

    if (!statusValidos.includes(statusUpper)) {
      throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
    }

    const pagamento = await prisma.pagamento.findUnique({ where: { id: parseInt(id) } });
    if (!pagamento) throw new Error('Pagamento não encontrado');

    const pago = statusUpper === 'PAGO';

    const [pagamentoAtualizado] = await prisma.$transaction([
      prisma.pagamento.update({
        where: { id: parseInt(id) },
        data: { status: statusUpper },
      }),
      prisma.agendamento.update({
        where: { id: pagamento.agendamentoId },
        data: { pago },
      }),
    ]);

    return pagamentoAtualizado;
  }
}

module.exports = new PagamentoService();
