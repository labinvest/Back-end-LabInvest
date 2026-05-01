const prisma = require('../lib/prisma');

class AgendamentoServicoService {
  // Criar associação entre agendamento e serviço
  async criar(agendamentoId, servicoId) {
    if (!agendamentoId || !servicoId) {
      throw new Error('agendamentoId e servicoId são obrigatórios');
    }

    // Verificar se agendamento existe
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: parseInt(agendamentoId) },
    });

    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    // Verificar se serviço existe
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(servicoId) },
    });

    if (!servico) {
      throw new Error('Serviço não encontrado');
    }

    // Verificar se já existe
    const existente = await prisma.agendamentoServico.findUnique({
      where: {
        agendamentoId_servicoId: {
          agendamentoId: parseInt(agendamentoId),
          servicoId: parseInt(servicoId),
        },
      },
    });

    if (existente) {
      throw new Error('Este serviço já está associado a este agendamento');
    }

    const associacao = await prisma.agendamentoServico.create({
      data: {
        agendamentoId: parseInt(agendamentoId),
        servicoId: parseInt(servicoId),
      },
      include: {
        agendamento: {
          select: {
            id: true,
            titulo: true,
            data: true,
            status: true,
          },
        },
        servico: {
          select: {
            id: true,
            nome: true,
            preco: true,
            duracao: true,
          },
        },
      },
    });

    return associacao;
  }

  // Listar serviços de um agendamento
  async listarServicosAgendamento(agendamentoId, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    const servicos = await prisma.agendamentoServico.findMany({
      where: { agendamentoId: parseInt(agendamentoId) },
      include: {
        servico: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            duracao: true,
            ativo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limite,
    });

    const total = await prisma.agendamentoServico.count({
      where: { agendamentoId: parseInt(agendamentoId) },
    });

    return {
      servicos,
      paginacao: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  // Listar agendamentos de um serviço
  async listarAgendamentosServico(servicoId, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    const agendamentos = await prisma.agendamentoServico.findMany({
      where: { servicoId: parseInt(servicoId) },
      include: {
        agendamento: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
            data: true,
            status: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limite,
    });

    const total = await prisma.agendamentoServico.count({
      where: { servicoId: parseInt(servicoId) },
    });

    return {
      agendamentos,
      paginacao: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  // Deletar associação
  async deletar(agendamentoId, servicoId) {
    const associacao = await prisma.agendamentoServico.delete({
      where: {
        agendamentoId_servicoId: {
          agendamentoId: parseInt(agendamentoId),
          servicoId: parseInt(servicoId),
        },
      },
    });

    return { mensagem: 'Serviço removido do agendamento com sucesso' };
  }

  // Obter detalhes de uma associação
  async obter(agendamentoId, servicoId) {
    const associacao = await prisma.agendamentoServico.findUnique({
      where: {
        agendamentoId_servicoId: {
          agendamentoId: parseInt(agendamentoId),
          servicoId: parseInt(servicoId),
        },
      },
      include: {
        agendamento: {
          select: {
            id: true,
            titulo: true,
            data: true,
            status: true,
          },
        },
        servico: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            duracao: true,
          },
        },
      },
    });

    if (!associacao) {
      throw new Error('Associação não encontrada');
    }

    return associacao;
  }

  // Contar serviços de um agendamento
  async contarServicosAgendamento(agendamentoId) {
    const total = await prisma.agendamentoServico.count({
      where: { agendamentoId: parseInt(agendamentoId) },
    });

    return total;
  }

  // Contar agendamentos de um serviço
  async contarAgendamentosServico(servicoId) {
    const total = await prisma.agendamentoServico.count({
      where: { servicoId: parseInt(servicoId) },
    });

    return total;
  }

  // Listar todas as associações
  async listarTodas(pagina = 1, limite = 50) {
    const skip = (pagina - 1) * limite;

    const associacoes = await prisma.agendamentoServico.findMany({
      include: {
        agendamento: {
          select: {
            id: true,
            titulo: true,
            data: true,
            status: true,
          },
        },
        servico: {
          select: {
            id: true,
            nome: true,
            preco: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limite,
    });

    const total = await prisma.agendamentoServico.count();

    return {
      associacoes,
      paginacao: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  // Calcular preço total de um agendamento (soma dos serviços)
  async calcularPrecoTotal(agendamentoId) {
    const resultado = await prisma.agendamentoServico.aggregate({
      where: { agendamentoId: parseInt(agendamentoId) },
      _sum: {
        servico: {
          select: {
            preco: true,
          },
        },
      },
    });

    // Calcular manualmente via busca
    const servicos = await prisma.agendamentoServico.findMany({
      where: { agendamentoId: parseInt(agendamentoId) },
      include: {
        servico: {
          select: {
            preco: true,
          },
        },
      },
    });

    const total = servicos.reduce((sum, item) => sum + (item.servico.preco || 0), 0);

    return total;
  }
}

module.exports = new AgendamentoServicoService();
