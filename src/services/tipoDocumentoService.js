const prisma = require('../lib/prisma');

class TipoDocumentoService {
  async criar(dados) {
    const { nome, obrigatorio } = dados;
    if (!nome) throw new Error('Nome é obrigatório');

    const existente = await prisma.tipoDocumento.findUnique({ where: { nome } });
    if (existente) throw new Error('Tipo de documento com este nome já existe');

    return prisma.tipoDocumento.create({
      data: { nome, obrigatorio: obrigatorio === true || obrigatorio === 'true', ativo: true },
    });
  }

  async listar(filtros = {}) {
    const { ativo } = filtros;
    const where = {};
    if (ativo !== undefined) where.ativo = ativo === 'true' || ativo === true;

    return prisma.tipoDocumento.findMany({
      where,
      include: { _count: { select: { documentos: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async obterPorId(id) {
    const tipo = await prisma.tipoDocumento.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { documentos: true } } },
    });
    if (!tipo) throw new Error('Tipo de documento não encontrado');
    return tipo;
  }

  async atualizar(id, dados) {
    const { nome, obrigatorio, ativo } = dados;

    const tipo = await prisma.tipoDocumento.findUnique({ where: { id: parseInt(id) } });
    if (!tipo) throw new Error('Tipo de documento não encontrado');

    return prisma.tipoDocumento.update({
      where: { id: parseInt(id) },
      data: {
        nome: nome || undefined,
        obrigatorio: obrigatorio !== undefined ? (obrigatorio === true || obrigatorio === 'true') : undefined,
        ativo: ativo !== undefined ? (ativo === true || ativo === 'true') : undefined,
      },
    });
  }

  async deletar(id) {
    const tipo = await prisma.tipoDocumento.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { documentos: true } } },
    });
    if (!tipo) throw new Error('Tipo de documento não encontrado');
    if (tipo._count.documentos > 0) throw new Error('Não é possível deletar: há documentos vinculados');

    await prisma.tipoDocumento.delete({ where: { id: parseInt(id) } });
    return { mensagem: 'Tipo de documento deletado com sucesso' };
  }
}

module.exports = new TipoDocumentoService();
