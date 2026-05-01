const prisma = require('../lib/prisma');

class EspecialistaServicoService {
  // Criar associação entre especialista e serviço
  async criar(especialistaId, servicoId) {
    if (!especialistaId || !servicoId) {
      throw new Error('especialistaId e servicoId são obrigatórios');
    }

    // Verificar se especialista existe
    const especialista = await prisma.especialista.findUnique({
      where: { id: parseInt(especialistaId) },
    });

    if (!especialista) {
      throw new Error('Especialista não encontrado');
    }

    // Verificar se serviço existe
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(servicoId) },
    });

    if (!servico) {
      throw new Error('Serviço não encontrado');
    }

    // Verificar se já existe
    const existente = await prisma.especialistaServico.findUnique({
      where: {
        especialistaId_servicoId: {
          especialistaId: parseInt(especialistaId),
          servicoId: parseInt(servicoId),
        },
      },
    });

    if (existente) {
      throw new Error('Esta associação já existe');
    }

    const associacao = await prisma.especialistaServico.create({
      data: {
        especialistaId: parseInt(especialistaId),
        servicoId: parseInt(servicoId),
      },
      include: {
        especialista: {
          select: {
            id: true,
            nome: true,
            email: true,
            formacao: true,
          },
        },
        servico: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
          },
        },
      },
    });

    return associacao;
  }

  // Listar serviços de um especialista
  async listarServicosEspecialista(especialistaId, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    const servicos = await prisma.especialistaServico.findMany({
      where: { especialistaId: parseInt(especialistaId) },
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

    const total = await prisma.especialistaServico.count({
      where: { especialistaId: parseInt(especialistaId) },
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

  // Listar especialistas de um serviço
  async listarEspecialistasServico(servicoId, pagina = 1, limite = 20) {
    const skip = (pagina - 1) * limite;

    const especialistas = await prisma.especialistaServico.findMany({
      where: { servicoId: parseInt(servicoId) },
      include: {
        especialista: {
          select: {
            id: true,
            nome: true,
            email: true,
            formacao: true,
            avaliacaoMedia: true,
            experiencia: true,
            ativo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limite,
    });

    const total = await prisma.especialistaServico.count({
      where: { servicoId: parseInt(servicoId) },
    });

    return {
      especialistas,
      paginacao: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  // Deletar associação
  async deletar(especialistaId, servicoId) {
    const associacao = await prisma.especialistaServico.delete({
      where: {
        especialistaId_servicoId: {
          especialistaId: parseInt(especialistaId),
          servicoId: parseInt(servicoId),
        },
      },
    });

    return { mensagem: 'Associação removida com sucesso' };
  }

  // Obter detalhes de uma associação
  async obter(especialistaId, servicoId) {
    const associacao = await prisma.especialistaServico.findUnique({
      where: {
        especialistaId_servicoId: {
          especialistaId: parseInt(especialistaId),
          servicoId: parseInt(servicoId),
        },
      },
      include: {
        especialista: {
          select: {
            id: true,
            nome: true,
            email: true,
            formacao: true,
            avaliacaoMedia: true,
            experiencia: true,
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

  // Contar serviços de um especialista
  async contarServicosEspecialista(especialistaId) {
    const total = await prisma.especialistaServico.count({
      where: { especialistaId: parseInt(especialistaId) },
    });

    return total;
  }

  // Contar especialistas de um serviço
  async contarEspecialistasServico(servicoId) {
    const total = await prisma.especialistaServico.count({
      where: { servicoId: parseInt(servicoId) },
    });

    return total;
  }

  // Listar todas as associações
  async listarTodas(pagina = 1, limite = 50) {
    const skip = (pagina - 1) * limite;

    const associacoes = await prisma.especialistaServico.findMany({
      include: {
        especialista: {
          select: {
            id: true,
            nome: true,
            email: true,
            formacao: true,
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

    const total = await prisma.especialistaServico.count();

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
}

module.exports = new EspecialistaServicoService();
