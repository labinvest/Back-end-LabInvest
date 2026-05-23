const prisma = require('../lib/prisma');

class AgendamentoServicoService {
  async criar(agendamentoId, servicoId) {
    if (!agendamentoId || !servicoId) {
      throw new Error('agendamentoId e servicoId são obrigatórios');
    }

    const agendamento = await prisma.agendamento.findUnique({ where: { id: parseInt(agendamentoId) } });
    if (!agendamento) throw new Error('Agendamento não encontrado');

    const servico = await prisma.servico.findUnique({ where: { id: parseInt(servicoId) } });
    if (!servico) throw new Error('Serviço não encontrado');

    const existente = await prisma.agendamentoServico.findUnique({
      where: {
        agendamentoId_servicoId: {
          agendamentoId: parseInt(agendamentoId),
          servicoId: parseInt(servicoId),
        },
      },
    });
    if (existente) throw new Error('Este serviço já está associado a este agendamento');

    return prisma.agendamentoServico.create({
      data: {
        agendamentoId: parseInt(agendamentoId),
        servicoId: parseInt(servicoId),
      },
      include: {
        agendamento: { select: { id: true, titulo: true, dataInicio: true, status: true } },
        servico: { select: { id: true, nome: true, preco: true, duracao: true } },
      },
    });
  }

  async listarServicosAgendamento(agendamentoId, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    const [servicos, total] = await Promise.all([
      prisma.agendamentoServico.findMany({
        where: { agendamentoId: parseInt(agendamentoId) },
        include: { servico: { select: { id: true, nome: true, descricao: true, preco: true, duracao: true, ativo: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limite,
      }),
      prisma.agendamentoServico.count({ where: { agendamentoId: parseInt(agendamentoId) } }),
    ]);

    return { servicos, paginacao: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async listarAgendamentosServico(servicoId, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    const [agendamentos, total] = await Promise.all([
      prisma.agendamentoServico.findMany({
        where: { servicoId: parseInt(servicoId) },
        include: {
          agendamento: {
            select: {
              id: true,
              titulo: true,
              descricao: true,
              dataInicio: true,
              status: true,
              cliente: { select: { id: true, nome: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limite,
      }),
      prisma.agendamentoServico.count({ where: { servicoId: parseInt(servicoId) } }),
    ]);

    return { agendamentos, paginacao: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async deletar(agendamentoId, servicoId) {
    const existente = await prisma.agendamentoServico.findUnique({
      where: {
        agendamentoId_servicoId: {
          agendamentoId: parseInt(agendamentoId),
          servicoId: parseInt(servicoId),
        },
      },
    });
    if (!existente) throw new Error('Associação não encontrada');

    await prisma.agendamentoServico.delete({
      where: {
        agendamentoId_servicoId: {
          agendamentoId: parseInt(agendamentoId),
          servicoId: parseInt(servicoId),
        },
      },
    });

    return { mensagem: 'Serviço removido do agendamento com sucesso' };
  }

  async obter(agendamentoId, servicoId) {
    const associacao = await prisma.agendamentoServico.findUnique({
      where: {
        agendamentoId_servicoId: {
          agendamentoId: parseInt(agendamentoId),
          servicoId: parseInt(servicoId),
        },
      },
      include: {
        agendamento: { select: { id: true, titulo: true, dataInicio: true, status: true } },
        servico: { select: { id: true, nome: true, descricao: true, preco: true, duracao: true } },
      },
    });

    if (!associacao) throw new Error('Associação não encontrada');
    return associacao;
  }

  async calcularPrecoTotal(agendamentoId) {
    const servicos = await prisma.agendamentoServico.findMany({
      where: { agendamentoId: parseInt(agendamentoId) },
      include: { servico: { select: { preco: true } } },
    });

    return servicos.reduce((sum, item) => sum + (item.servico?.preco || 0), 0);
  }

  async contarServicosAgendamento(agendamentoId) {
    return prisma.agendamentoServico.count({ where: { agendamentoId: parseInt(agendamentoId) } });
  }

  async contarAgendamentosServico(servicoId) {
    return prisma.agendamentoServico.count({ where: { servicoId: parseInt(servicoId) } });
  }

  async listarTodas(pagina = 1, limite = 50) {
    const skip = (pagina - 1) * limite;

    const [associacoes, total] = await Promise.all([
      prisma.agendamentoServico.findMany({
        include: {
          agendamento: { select: { id: true, titulo: true, dataInicio: true, status: true } },
          servico: { select: { id: true, nome: true, preco: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limite,
      }),
      prisma.agendamentoServico.count(),
    ]);

    return { associacoes, paginacao: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }
}

module.exports = new AgendamentoServicoService();
