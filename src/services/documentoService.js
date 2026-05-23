const prisma = require('../lib/prisma');

class DocumentoService {
  async criar(dados) {
    const { voluntarioId, tipoDocumentoId, caminhoArquivo, nomeArquivo } = dados;

    if (!voluntarioId || !tipoDocumentoId || !caminhoArquivo || !nomeArquivo) {
      throw new Error('voluntarioId, tipoDocumentoId, caminhoArquivo e nomeArquivo são obrigatórios');
    }

    const voluntario = await prisma.voluntario.findUnique({ where: { id: parseInt(voluntarioId) } });
    if (!voluntario) throw new Error('Voluntário não encontrado');

    const tipo = await prisma.tipoDocumento.findUnique({ where: { id: parseInt(tipoDocumentoId) } });
    if (!tipo) throw new Error('Tipo de documento não encontrado');

    return prisma.documento.create({
      data: {
        voluntarioId: parseInt(voluntarioId),
        tipoDocumentoId: parseInt(tipoDocumentoId),
        caminhoArquivo,
        nomeArquivo,
        statusValidacao: 'PENDENTE',
      },
      include: {
        tipoDocumento: true,
        voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
      },
    });
  }

  async listar(filtros = {}) {
    const { page = 1, limit = 20, voluntarioId, status } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (voluntarioId) where.voluntarioId = parseInt(voluntarioId);
    if (status) where.statusValidacao = status.toUpperCase();

    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        where,
        skip,
        take: limit,
        include: {
          tipoDocumento: true,
          voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.documento.count({ where }),
    ]);

    return {
      documentos,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  }

  async obterPorId(id) {
    const documento = await prisma.documento.findUnique({
      where: { id: parseInt(id) },
      include: {
        tipoDocumento: true,
        voluntario: { include: { perfil: { select: { id: true, nome: true } } } },
      },
    });
    if (!documento) throw new Error('Documento não encontrado');
    return documento;
  }

  async listarPorVoluntario(voluntarioId) {
    return prisma.documento.findMany({
      where: { voluntarioId: parseInt(voluntarioId) },
      include: { tipoDocumento: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async atualizarStatus(id, statusValidacao) {
    const statusValidos = ['PENDENTE', 'APROVADO', 'REJEITADO'];
    const statusUpper = statusValidacao?.toUpperCase();
    if (!statusValidos.includes(statusUpper)) throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);

    const documento = await prisma.documento.findUnique({ where: { id: parseInt(id) } });
    if (!documento) throw new Error('Documento não encontrado');

    return prisma.documento.update({
      where: { id: parseInt(id) },
      data: { statusValidacao: statusUpper },
    });
  }

  async deletar(id) {
    const documento = await prisma.documento.findUnique({ where: { id: parseInt(id) } });
    if (!documento) throw new Error('Documento não encontrado');

    await prisma.documento.delete({ where: { id: parseInt(id) } });
    return { mensagem: 'Documento deletado com sucesso' };
  }
}

module.exports = new DocumentoService();
