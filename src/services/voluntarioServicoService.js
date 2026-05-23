const prisma = require('../lib/prisma');

class VoluntarioServicoService {
  async criar(voluntarioId, servicoId) {
    if (!voluntarioId || !servicoId) {
      throw new Error('voluntarioId e servicoId são obrigatórios');
    }

    const voluntario = await prisma.voluntario.findUnique({ where: { id: parseInt(voluntarioId) } });
    if (!voluntario) throw new Error('Voluntário não encontrado');

    const servico = await prisma.servico.findUnique({ where: { id: parseInt(servicoId) } });
    if (!servico) throw new Error('Serviço não encontrado');

    const existente = await prisma.voluntarioServico.findUnique({
      where: {
        voluntarioId_servicoId: {
          voluntarioId: parseInt(voluntarioId),
          servicoId: parseInt(servicoId),
        },
      },
    });
    if (existente) throw new Error('Associação já existe');

    return prisma.voluntarioServico.create({
      data: {
        voluntarioId: parseInt(voluntarioId),
        servicoId: parseInt(servicoId),
      },
      include: {
        voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
        servico: { select: { id: true, nome: true, descricao: true, preco: true } },
      },
    });
  }

  async listarServicosVoluntario(voluntarioId, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    const [servicos, total] = await Promise.all([
      prisma.voluntarioServico.findMany({
        where: { voluntarioId: parseInt(voluntarioId) },
        include: { servico: { select: { id: true, nome: true, descricao: true, preco: true, duracao: true, ativo: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limite,
      }),
      prisma.voluntarioServico.count({ where: { voluntarioId: parseInt(voluntarioId) } }),
    ]);

    return { servicos, paginacao: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async listarVoluntariosServico(servicoId, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    const [voluntarios, total] = await Promise.all([
      prisma.voluntarioServico.findMany({
        where: { servicoId: parseInt(servicoId) },
        include: {
          voluntario: {
            include: {
              perfil: { select: { id: true, nome: true, telefone: true } },
              categoria: { select: { id: true, nome: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limite,
      }),
      prisma.voluntarioServico.count({ where: { servicoId: parseInt(servicoId) } }),
    ]);

    return { voluntarios, paginacao: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }

  async deletar(voluntarioId, servicoId) {
    const existente = await prisma.voluntarioServico.findUnique({
      where: {
        voluntarioId_servicoId: {
          voluntarioId: parseInt(voluntarioId),
          servicoId: parseInt(servicoId),
        },
      },
    });
    if (!existente) throw new Error('Associação não encontrada');

    await prisma.voluntarioServico.delete({
      where: {
        voluntarioId_servicoId: {
          voluntarioId: parseInt(voluntarioId),
          servicoId: parseInt(servicoId),
        },
      },
    });

    return { mensagem: 'Associação removida com sucesso' };
  }

  async obter(voluntarioId, servicoId) {
    const associacao = await prisma.voluntarioServico.findUnique({
      where: {
        voluntarioId_servicoId: {
          voluntarioId: parseInt(voluntarioId),
          servicoId: parseInt(servicoId),
        },
      },
      include: {
        voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
        servico: { select: { id: true, nome: true, descricao: true, preco: true, duracao: true } },
      },
    });

    if (!associacao) throw new Error('Associação não encontrada');
    return associacao;
  }

  async listarTodas(pagina = 1, limite = 50) {
    const skip = (pagina - 1) * limite;

    const [associacoes, total] = await Promise.all([
      prisma.voluntarioServico.findMany({
        include: {
          voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
          servico: { select: { id: true, nome: true, preco: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limite,
      }),
      prisma.voluntarioServico.count(),
    ]);

    return { associacoes, paginacao: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) } };
  }
}

module.exports = new VoluntarioServicoService();
