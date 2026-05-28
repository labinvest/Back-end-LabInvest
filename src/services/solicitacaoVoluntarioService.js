const prisma = require('../lib/prisma');

function normalizarDocumentos(documentos) {
  if (!documentos) return [];

  if (Array.isArray(documentos)) {
    return documentos.filter(Boolean);
  }

  if (typeof documentos === 'string') {
    const texto = documentos.trim();
    if (!texto) return [];

    try {
      const parsed = JSON.parse(texto);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {
      return texto
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

const solicitacaoVoluntarioService = {
  async criar(userId, dados) {
    const { categoriaId, formacao, bio, experiencia, documentos } = dados;

    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        perfil: {
          include: {
            voluntario: true,
          },
        },
      },
    });

    if (!usuario || !usuario.perfil) {
      throw new Error('Perfil não encontrado');
    }

    if (usuario.perfil.voluntario) {
      throw new Error('Seu perfil já está vinculado a um cadastro de voluntário');
    }

    const documentosNormalizados = normalizarDocumentos(documentos);

    const solicitacao = await prisma.solicitacaoVoluntario.upsert({
      where: { perfilId: usuario.perfil.id },
      update: {
        categoriaId: categoriaId ? parseInt(categoriaId) : null,
        formacao: formacao || null,
        bio: bio || null,
        experiencia: experiencia ? parseInt(experiencia) : null,
        documentos: documentosNormalizados,
        status: 'PENDENTE',
        observacaoAdmin: null,
        aprovadoEm: null,
        aprovadoPorId: null,
      },
      create: {
        perfilId: usuario.perfil.id,
        categoriaId: categoriaId ? parseInt(categoriaId) : null,
        formacao: formacao || null,
        bio: bio || null,
        experiencia: experiencia ? parseInt(experiencia) : null,
        documentos: documentosNormalizados,
        status: 'PENDENTE',
      },
      include: {
        perfil: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
        categoria: {
          select: { id: true, nome: true },
        },
      },
    });

    return solicitacao;
  },

  async minhasSolicitacoes(userId) {
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: { perfil: { select: { id: true } } },
    });

    if (!usuario?.perfil?.id) {
      throw new Error('Perfil não encontrado');
    }

    return prisma.solicitacaoVoluntario.findUnique({
      where: { perfilId: usuario.perfil.id },
      include: {
        categoria: { select: { id: true, nome: true } },
        perfil: {
          select: {
            id: true,
            nome: true,
            user: { select: { id: true, email: true, role: true } },
          },
        },
      },
    });
  },

  async listar(filtros = {}) {
    const { page = 1, limit = 20, status, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status.toUpperCase();
    if (search) {
      where.OR = [
        { perfil: { nome: { contains: search, mode: 'insensitive' } } },
        { perfil: { user: { email: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const [solicitacoes, total] = await Promise.all([
      prisma.solicitacaoVoluntario.findMany({
        where,
        skip,
        take: limit,
        include: {
          categoria: { select: { id: true, nome: true } },
          perfil: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              user: {
                select: { id: true, email: true, role: true, ativo: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.solicitacaoVoluntario.count({ where }),
    ]);

    return {
      solicitacoes,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  async aprovar(id, adminUserId) {
    return prisma.$transaction(async (tx) => {
      const solicitacao = await tx.solicitacaoVoluntario.findUnique({
        where: { id },
        include: {
          perfil: {
            include: {
              user: true,
              voluntario: true,
            },
          },
        },
      });

      if (!solicitacao) {
        throw new Error('Solicitação não encontrada');
      }

      if (solicitacao.status === 'APROVADA') {
        throw new Error('Solicitação já aprovada');
      }

      if (!solicitacao.perfil?.user) {
        throw new Error('Usuário associado à solicitação não encontrado');
      }

      let voluntario = solicitacao.perfil.voluntario;
      if (!voluntario) {
        voluntario = await tx.voluntario.create({
          data: {
            perfilId: solicitacao.perfilId,
            categoriaId: solicitacao.categoriaId || null,
            formacao: solicitacao.formacao || null,
            bio: solicitacao.bio || null,
            experiencia: solicitacao.experiencia || null,
            ativo: true,
          },
        });
      } else {
        voluntario = await tx.voluntario.update({
          where: { id: voluntario.id },
          data: {
            categoriaId: solicitacao.categoriaId || voluntario.categoriaId,
            formacao: solicitacao.formacao || voluntario.formacao,
            bio: solicitacao.bio || voluntario.bio,
            experiencia: solicitacao.experiencia || voluntario.experiencia,
            ativo: true,
          },
        });
      }

      await tx.user.update({
        where: { id: solicitacao.perfil.userId },
        data: { role: 'VOLUNTARIO' },
      });

      return tx.solicitacaoVoluntario.update({
        where: { id },
        data: {
          status: 'APROVADA',
          aprovadoEm: new Date(),
          aprovadoPorId: adminUserId || null,
          observacaoAdmin: null,
        },
        include: {
          perfil: { select: { id: true, nome: true, user: { select: { id: true, email: true, role: true } } } },
          categoria: { select: { id: true, nome: true } },
        },
      });
    });
  },

  async rejeitar(id, adminUserId, observacaoAdmin) {
    const solicitacao = await prisma.solicitacaoVoluntario.findUnique({ where: { id } });
    if (!solicitacao) {
      throw new Error('Solicitação não encontrada');
    }

    return prisma.solicitacaoVoluntario.update({
      where: { id },
      data: {
        status: 'REJEITADA',
        aprovadoPorId: adminUserId || null,
        aprovadoEm: null,
        observacaoAdmin: observacaoAdmin || null,
      },
    });
  },
};

module.exports = solicitacaoVoluntarioService;