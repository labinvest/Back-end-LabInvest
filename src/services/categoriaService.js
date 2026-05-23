const prisma = require('../lib/prisma');

class CategoriaService {
  async criar(dados) {
    const { nome, descricao } = dados;
    if (!nome) throw new Error('Nome é obrigatório');

    const existente = await prisma.categoria.findUnique({ where: { nome } });
    if (existente) throw new Error('Categoria com este nome já existe');

    return prisma.categoria.create({ data: { nome, descricao: descricao || null, ativo: true } });
  }

  async listar(filtros = {}) {
    const { page = 1, limit = 20, ativo, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (ativo !== undefined) where.ativo = ativo === 'true' || ativo === true;
    if (search) where.nome = { contains: search, mode: 'insensitive' };

    const [categorias, total] = await Promise.all([
      prisma.categoria.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { voluntarios: true } } },
        orderBy: { nome: 'asc' },
      }),
      prisma.categoria.count({ where }),
    ]);

    return {
      categorias,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async obterPorId(id) {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { voluntarios: true } } },
    });
    if (!categoria) throw new Error('Categoria não encontrada');
    return categoria;
  }

  async atualizar(id, dados) {
    const { nome, descricao, ativo } = dados;

    const categoria = await prisma.categoria.findUnique({ where: { id: parseInt(id) } });
    if (!categoria) throw new Error('Categoria não encontrada');

    if (nome && nome !== categoria.nome) {
      const duplicada = await prisma.categoria.findUnique({ where: { nome } });
      if (duplicada) throw new Error('Nome já utilizado por outra categoria');
    }

    return prisma.categoria.update({
      where: { id: parseInt(id) },
      data: {
        nome: nome || undefined,
        descricao: descricao !== undefined ? descricao : undefined,
        ativo: ativo !== undefined ? ativo : undefined,
      },
    });
  }

  async deletar(id) {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { voluntarios: true } } },
    });
    if (!categoria) throw new Error('Categoria não encontrada');
    if (categoria._count.voluntarios > 0) {
      throw new Error('Não é possível deletar: há voluntários vinculados a esta categoria');
    }

    await prisma.categoria.delete({ where: { id: parseInt(id) } });
    return { mensagem: 'Categoria deletada com sucesso' };
  }
}

module.exports = new CategoriaService();
