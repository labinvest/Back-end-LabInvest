const prisma = require('../lib/prisma');

const includeVoluntario = {
  voluntario: {
    include: {
      perfil: { select: { id: true, nome: true } },
    },
  },
};

class PostService {
  async criarPost(dados) {
    const { voluntarioId, titulo, conteudo, imagemUrl } = dados;

    if (!voluntarioId || !titulo || !conteudo) {
      throw new Error('voluntarioId, titulo e conteudo são obrigatórios');
    }

    return prisma.postagem.create({
      data: {
        voluntarioId: parseInt(voluntarioId),
        titulo,
        conteudo,
        imagemUrl: imagemUrl || null,
      },
      include: includeVoluntario,
    });
  }

  async listarPosts(filtros = {}) {
    const { page = 1, limit = 20, voluntarioId, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (voluntarioId) where.voluntarioId = parseInt(voluntarioId);
    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { conteudo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [postagens, total] = await Promise.all([
      prisma.postagem.findMany({
        where,
        skip,
        take: limit,
        include: includeVoluntario,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.postagem.count({ where }),
    ]);

    return {
      postagens,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async lerPost(id) {
    const post = await prisma.postagem.findUnique({
      where: { id: parseInt(id) },
      include: includeVoluntario,
    });

    if (!post) throw new Error('Postagem não encontrada');
    return post;
  }

  async atualizarPost(id, dados) {
    const { titulo, conteudo, imagemUrl } = dados;

    const post = await prisma.postagem.findUnique({ where: { id: parseInt(id) } });
    if (!post) throw new Error('Postagem não encontrada');

    return prisma.postagem.update({
      where: { id: parseInt(id) },
      data: {
        titulo: titulo || undefined,
        conteudo: conteudo || undefined,
        imagemUrl: imagemUrl !== undefined ? imagemUrl : undefined,
      },
      include: includeVoluntario,
    });
  }

  async deletarPost(id) {
    const post = await prisma.postagem.findUnique({ where: { id: parseInt(id) } });
    if (!post) throw new Error('Postagem não encontrada');

    await prisma.postagem.delete({ where: { id: parseInt(id) } });
    return { mensagem: 'Postagem deletada com sucesso' };
  }
}

module.exports = new PostService();
