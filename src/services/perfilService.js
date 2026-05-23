const prisma = require('../lib/prisma');

class PerfilService {
  async obterPorUserId(userId) {
    const perfil = await prisma.perfil.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        voluntario: {
          include: { categoria: true },
        },
      },
    });
    if (!perfil) throw new Error('Perfil não encontrado');
    return perfil;
  }

  async obterPorId(id) {
    const perfil = await prisma.perfil.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { id: true, email: true, role: true, ativo: true } },
        voluntario: { include: { categoria: true } },
      },
    });
    if (!perfil) throw new Error('Perfil não encontrado');
    return perfil;
  }

  async listar(filtros = {}) {
    const { page = 1, limit = 20, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } },
      ];
    }

    const [perfis, total] = await Promise.all([
      prisma.perfil.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { id: true, email: true, role: true } } },
        orderBy: { nome: 'asc' },
      }),
      prisma.perfil.count({ where }),
    ]);

    return {
      perfis,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async atualizar(userId, dados) {
    const { nome, telefone, endereco, cpf } = dados;

    const perfil = await prisma.perfil.findUnique({ where: { userId: parseInt(userId) } });
    if (!perfil) throw new Error('Perfil não encontrado');

    if (cpf && cpf !== perfil.cpf) {
      const cpfExistente = await prisma.perfil.findUnique({ where: { cpf } });
      if (cpfExistente) throw new Error('CPF já cadastrado');
    }

    return prisma.perfil.update({
      where: { userId: parseInt(userId) },
      data: {
        nome: nome || undefined,
        telefone: telefone !== undefined ? telefone : undefined,
        endereco: endereco !== undefined ? endereco : undefined,
        cpf: cpf !== undefined ? cpf : undefined,
      },
    });
  }
}

module.exports = new PerfilService();
