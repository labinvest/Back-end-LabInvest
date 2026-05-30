const prisma = require('../lib/prisma');

class ContatoService {
  async criar(dados) {
    const { nome, email, mensagem } = dados;

    if (!nome || !email || !mensagem) {
      throw new Error('nome, email e mensagem são obrigatórios');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    return prisma.contato.create({
      data: { nome, email, mensagem },
    });
  }

  async listar(filtros = {}) {
    const { page = 1, limit = 20, lido } = filtros;
    const skip = (page - 1) * limit;
    const where = {};
    if (lido !== undefined) where.lido = lido === 'true';

    const [contatos, total] = await Promise.all([
      prisma.contato.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contato.count({ where }),
    ]);

    return {
      contatos,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async marcarComoLido(id) {
    const contato = await prisma.contato.findUnique({ where: { id: parseInt(id) } });
    if (!contato) throw new Error('Contato não encontrado');
    return prisma.contato.update({ where: { id: parseInt(id) }, data: { lido: true } });
  }

  async deletar(id) {
    const contato = await prisma.contato.findUnique({ where: { id: parseInt(id) } });
    if (!contato) throw new Error('Contato não encontrado');
    await prisma.contato.delete({ where: { id: parseInt(id) } });
    return { mensagem: 'Contato removido com sucesso' };
  }
}

module.exports = new ContatoService();
