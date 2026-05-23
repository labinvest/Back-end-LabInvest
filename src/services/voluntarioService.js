const prisma = require('../lib/prisma');

class VoluntarioService {
  async criar(perfilId, dados) {
    const { categoriaId, formacao, bio, experiencia } = dados;

    const perfil = await prisma.perfil.findUnique({ where: { id: parseInt(perfilId) } });
    if (!perfil) throw new Error('Perfil não encontrado');

    const existente = await prisma.voluntario.findUnique({ where: { perfilId: parseInt(perfilId) } });
    if (existente) throw new Error('Voluntário já cadastrado para este perfil');

    return prisma.voluntario.create({
      data: {
        perfilId: parseInt(perfilId),
        categoriaId: categoriaId ? parseInt(categoriaId) : null,
        formacao: formacao || null,
        bio: bio || null,
        experiencia: experiencia ? parseInt(experiencia) : null,
        ativo: true,
      },
      include: {
        perfil: { select: { id: true, nome: true, telefone: true } },
        categoria: true,
      },
    });
  }

  async listar(filtros = {}) {
    const { page = 1, limit = 20, search, categoriaId, ativo } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (ativo !== undefined) where.ativo = ativo === 'true' || ativo === true;
    if (categoriaId) where.categoriaId = parseInt(categoriaId);
    if (search) {
      where.perfil = { nome: { contains: search, mode: 'insensitive' } };
    }

    const [voluntarios, total] = await Promise.all([
      prisma.voluntario.findMany({
        where,
        skip,
        take: limit,
        include: {
          perfil: { select: { id: true, nome: true, telefone: true, endereco: true } },
          categoria: { select: { id: true, nome: true } },
          _count: { select: { servicos: true, disponibilidades: true } },
        },
        orderBy: { avaliacaoMedia: 'desc' },
      }),
      prisma.voluntario.count({ where }),
    ]);

    return {
      voluntarios,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async obterPorId(id) {
    const voluntario = await prisma.voluntario.findUnique({
      where: { id: parseInt(id) },
      include: {
        perfil: { select: { id: true, nome: true, telefone: true, endereco: true } },
        categoria: true,
        disponibilidades: { where: { ativo: true }, orderBy: { diaSemana: 'asc' } },
        servicos: { include: { servico: { select: { id: true, nome: true, preco: true } } } },
        _count: { select: { avaliacoesRecebidas: true, postagens: true } },
      },
    });

    if (!voluntario) throw new Error('Voluntário não encontrado');
    return voluntario;
  }

  async obterPorPerfilId(perfilId) {
    const voluntario = await prisma.voluntario.findUnique({
      where: { perfilId: parseInt(perfilId) },
      include: {
        perfil: { select: { id: true, nome: true, telefone: true } },
        categoria: true,
        disponibilidades: { where: { ativo: true } },
      },
    });

    if (!voluntario) throw new Error('Voluntário não encontrado');
    return voluntario;
  }

  async atualizar(id, dados) {
    const { categoriaId, formacao, bio, experiencia, ativo } = dados;

    const voluntario = await prisma.voluntario.findUnique({ where: { id: parseInt(id) } });
    if (!voluntario) throw new Error('Voluntário não encontrado');

    return prisma.voluntario.update({
      where: { id: parseInt(id) },
      data: {
        categoriaId: categoriaId !== undefined ? (categoriaId ? parseInt(categoriaId) : null) : undefined,
        formacao: formacao !== undefined ? formacao : undefined,
        bio: bio !== undefined ? bio : undefined,
        experiencia: experiencia !== undefined ? (experiencia ? parseInt(experiencia) : null) : undefined,
        ativo: ativo !== undefined ? ativo : undefined,
      },
      include: {
        perfil: { select: { id: true, nome: true } },
        categoria: true,
      },
    });
  }

  async deletar(id) {
    const voluntario = await prisma.voluntario.findUnique({ where: { id: parseInt(id) } });
    if (!voluntario) throw new Error('Voluntário não encontrado');

    await prisma.voluntario.update({ where: { id: parseInt(id) }, data: { ativo: false } });
    return { mensagem: 'Voluntário desativado com sucesso' };
  }
}

module.exports = new VoluntarioService();
