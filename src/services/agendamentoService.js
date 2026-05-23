const prisma = require('../lib/prisma');

const includeCompleto = {
  cliente: { select: { id: true, nome: true, telefone: true } },
  voluntario: { select: { id: true, nome: true } },
  servico: { select: { id: true, nome: true, preco: true, duracao: true } },
  servicos: {
    include: { servico: { select: { id: true, nome: true, preco: true } } },
  },
};

class AgendamentoService {
  async criarAgendamento(dados) {
    const {
      clientePerfilId,
      voluntarioPerfilId,
      servicoId,
      titulo,
      descricao,
      dataInicio,
      dataFim,
      local,
      notas,
    } = dados;

    if (!clientePerfilId || !voluntarioPerfilId || !dataInicio) {
      throw new Error('clientePerfilId, voluntarioPerfilId e dataInicio são obrigatórios');
    }

    return prisma.agendamento.create({
      data: {
        clientePerfilId: parseInt(clientePerfilId),
        voluntarioPerfilId: parseInt(voluntarioPerfilId),
        servicoId: servicoId ? parseInt(servicoId) : null,
        titulo: titulo || null,
        descricao: descricao || null,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        local: local || null,
        notas: notas || null,
        status: 'AGENDADO',
      },
      include: includeCompleto,
    });
  }

  async listarAgendamentos(filtros = {}) {
    const { clientePerfilId, voluntarioPerfilId, status, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (clientePerfilId) where.clientePerfilId = parseInt(clientePerfilId);
    if (voluntarioPerfilId) where.voluntarioPerfilId = parseInt(voluntarioPerfilId);
    if (status) where.status = status.toUpperCase();

    const [agendamentos, total] = await Promise.all([
      prisma.agendamento.findMany({
        where,
        skip,
        take: limit,
        include: includeCompleto,
        orderBy: { dataInicio: 'desc' },
      }),
      prisma.agendamento.count({ where }),
    ]);

    return {
      agendamentos,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async lerAgendamento(id) {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: parseInt(id) },
      include: includeCompleto,
    });

    if (!agendamento) throw new Error('Agendamento não encontrado');
    return agendamento;
  }

  async atualizarAgendamento(id, dados) {
    const agendamento = await prisma.agendamento.findUnique({ where: { id: parseInt(id) } });
    if (!agendamento) throw new Error('Agendamento não encontrado');

    const { titulo, descricao, dataInicio, dataFim, local, notas, status } = dados;

    return prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: {
        titulo: titulo !== undefined ? titulo : undefined,
        descricao: descricao !== undefined ? descricao : undefined,
        dataInicio: dataInicio ? new Date(dataInicio) : undefined,
        dataFim: dataFim !== undefined ? (dataFim ? new Date(dataFim) : null) : undefined,
        local: local !== undefined ? local : undefined,
        notas: notas !== undefined ? notas : undefined,
        status: status ? status.toUpperCase() : undefined,
      },
      include: includeCompleto,
    });
  }

  async atualizarStatus(id, status) {
    const statusValidos = ['AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO'];
    const statusUpper = status?.toUpperCase();

    if (!statusValidos.includes(statusUpper)) {
      throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
    }

    const agendamento = await prisma.agendamento.findUnique({ where: { id: parseInt(id) } });
    if (!agendamento) throw new Error('Agendamento não encontrado');

    return prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: { status: statusUpper },
      include: includeCompleto,
    });
  }

  async excluirAgendamento(id) {
    const agendamento = await prisma.agendamento.findUnique({ where: { id: parseInt(id) } });
    if (!agendamento) throw new Error('Agendamento não encontrado');

    await prisma.agendamento.delete({ where: { id: parseInt(id) } });
    return { mensagem: 'Agendamento excluído com sucesso' };
  }
}

module.exports = new AgendamentoService();
