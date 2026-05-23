const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

const adminService = {
  // ============================================
  // USUÁRIOS
  // ============================================

  async listarUsuarios(filtros = {}) {
    const { page = 1, limit = 20, role, ativo, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (role) where.role = role.toUpperCase();
    if (ativo !== undefined) where.ativo = ativo === 'true' || ativo === true;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { perfil: { nome: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [usuarios, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          ativo: true,
          createdAt: true,
          updatedAt: true,
          perfil: {
            select: { id: true, nome: true, telefone: true, endereco: true, cpf: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      usuarios,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit),
      },
    };
  },

  async obterUsuario(id) {
    const usuario = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
        perfil: {
          include: { voluntario: true },
        },
      },
    });

    if (!usuario) throw new Error('Usuário não encontrado');
    return usuario;
  },

  async editarUsuario(id, dados) {
    const { nome, email, telefone, endereco, ativo } = dados;

    const usuarioExistente = await prisma.user.findUnique({ where: { id } });
    if (!usuarioExistente) throw new Error('Usuário não encontrado');

    if (email && email !== usuarioExistente.email) {
      const emailJaExiste = await prisma.user.findUnique({ where: { email } });
      if (emailJaExiste) throw new Error('Email já está em uso');
    }

    const usuario = await prisma.user.update({
      where: { id },
      data: {
        email: email || undefined,
        ativo: ativo !== undefined ? ativo : undefined,
        perfil: {
          update: {
            nome: nome || undefined,
            telefone: telefone !== undefined ? telefone : undefined,
            endereco: endereco !== undefined ? endereco : undefined,
          },
        },
      },
      include: {
        perfil: { select: { id: true, nome: true, telefone: true, endereco: true } },
      },
    });

    return usuario;
  },

  async mudarRole(id, novoRole) {
    const rolesValidas = ['CLIENTE', 'VOLUNTARIO', 'ADMIN'];
    const roleUpper = novoRole?.toUpperCase();

    if (!rolesValidas.includes(roleUpper)) {
      throw new Error(`Role inválida. Valores válidos: ${rolesValidas.join(', ')}`);
    }

    const usuario = await prisma.user.findUnique({ where: { id } });
    if (!usuario) throw new Error('Usuário não encontrado');

    return prisma.user.update({
      where: { id },
      data: { role: roleUpper },
      select: { id: true, email: true, role: true },
    });
  },

  async deletarUsuario(id) {
    const usuario = await prisma.user.findUnique({ where: { id } });
    if (!usuario) throw new Error('Usuário não encontrado');

    await prisma.user.update({ where: { id }, data: { ativo: false } });
    return { mensagem: 'Usuário desativado com sucesso' };
  },

  async resetarSenha(id, novaSenha) {
    if (!novaSenha) throw new Error('Nova senha é obrigatória');

    const usuario = await prisma.user.findUnique({ where: { id } });
    if (!usuario) throw new Error('Usuário não encontrado');

    const hash = await bcrypt.hash(novaSenha, 10);
    await prisma.user.update({ where: { id }, data: { senha: hash } });
    return { mensagem: 'Senha resetada com sucesso' };
  },

  // ============================================
  // VOLUNTÁRIOS (substituiu Especialistas)
  // ============================================

  async listarVoluntarios(filtros = {}) {
    const { page = 1, limit = 20, search, categoriaId, ativo } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (ativo !== undefined) where.ativo = ativo === 'true' || ativo === true;
    if (categoriaId) where.categoriaId = parseInt(categoriaId);
    if (search) {
      where.perfil = {
        nome: { contains: search, mode: 'insensitive' },
      };
    }

    const [voluntarios, total] = await Promise.all([
      prisma.voluntario.findMany({
        where,
        skip,
        take: limit,
        include: {
          perfil: { select: { id: true, nome: true, telefone: true } },
          categoria: { select: { id: true, nome: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.voluntario.count({ where }),
    ]);

    return {
      voluntarios,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit),
      },
    };
  },

  // ============================================
  // SERVIÇOS
  // ============================================

  async listarServicos(filtros = {}) {
    const { page = 1, limit = 20, ativo, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (ativo !== undefined) where.ativo = ativo === 'true' || ativo === true;
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [servicos, total] = await Promise.all([
      prisma.servico.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.servico.count({ where }),
    ]);

    return {
      servicos,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  async criarServico(dados) {
    const { nome, descricao, preco, duracao } = dados;
    if (!nome || preco === undefined) throw new Error('Nome e preço são obrigatórios');

    return prisma.servico.create({
      data: { nome, descricao: descricao || null, preco: parseFloat(preco), duracao: duracao || null, ativo: true },
    });
  },

  async editarServico(id, dados) {
    const { nome, descricao, preco, duracao, ativo } = dados;

    const servico = await prisma.servico.findUnique({ where: { id } });
    if (!servico) throw new Error('Serviço não encontrado');

    return prisma.servico.update({
      where: { id },
      data: {
        nome: nome || undefined,
        descricao: descricao !== undefined ? descricao : undefined,
        preco: preco !== undefined ? parseFloat(preco) : undefined,
        duracao: duracao !== undefined ? duracao : undefined,
        ativo: ativo !== undefined ? ativo : undefined,
      },
    });
  },

  async deletarServico(id) {
    const servico = await prisma.servico.findUnique({ where: { id } });
    if (!servico) throw new Error('Serviço não encontrado');

    await prisma.servico.update({ where: { id }, data: { ativo: false } });
    return { mensagem: 'Serviço desativado com sucesso' };
  },

  // ============================================
  // AGENDAMENTOS
  // ============================================

  async listarAgendamentos(filtros = {}) {
    const { page = 1, limit = 20, status } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status.toUpperCase();

    const [agendamentos, total] = await Promise.all([
      prisma.agendamento.findMany({
        where,
        skip,
        take: limit,
        include: {
          cliente: { select: { id: true, nome: true } },
          voluntario: { select: { id: true, nome: true } },
          servico: { select: { id: true, nome: true, preco: true } },
        },
        orderBy: { dataInicio: 'desc' },
      }),
      prisma.agendamento.count({ where }),
    ]);

    return {
      agendamentos,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  async cancelarAgendamento(id) {
    const agendamento = await prisma.agendamento.findUnique({ where: { id } });
    if (!agendamento) throw new Error('Agendamento não encontrado');

    return prisma.agendamento.update({
      where: { id },
      data: { status: 'CANCELADO' },
    });
  },

  // ============================================
  // POSTAGENS
  // ============================================

  async listarPostagens(filtros = {}) {
    const { page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const [postagens, total] = await Promise.all([
      prisma.postagem.findMany({
        skip,
        take: limit,
        include: {
          voluntario: {
            include: { perfil: { select: { id: true, nome: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.postagem.count(),
    ]);

    return {
      postagens,
      paginacao: { total, pagina: page, limite: limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  async deletarPostagem(id) {
    const postagem = await prisma.postagem.findUnique({ where: { id } });
    if (!postagem) throw new Error('Postagem não encontrada');

    await prisma.postagem.delete({ where: { id } });
    return { mensagem: 'Postagem removida com sucesso' };
  },

  // ============================================
  // DASHBOARD E ESTATÍSTICAS
  // ============================================

  async obterDashboard(filtros = {}) {
    const { dataInicio, dataFim, tipo = 'resumido' } = filtros;

    const filtroData = {};
    if (dataInicio) filtroData.gte = new Date(dataInicio + 'T00:00:00');
    if (dataFim) filtroData.lte = new Date(dataFim + 'T23:59:59');

    const agendamentosWhere = Object.keys(filtroData).length > 0
      ? { dataInicio: filtroData }
      : {};

    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);

    const [
      totalUsuarios,
      usuariosAtivos,
      totalVoluntarios,
      totalServicos,
      totalAgendamentos,
      agendamentosHoje,
      agendamentosPorStatus,
      totalPostagens,
      totalAvaliacoes,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { ativo: true } }),
      prisma.voluntario.count({ where: { ativo: true } }),
      prisma.servico.count({ where: { ativo: true } }),
      prisma.agendamento.count({ where: agendamentosWhere }),
      prisma.agendamento.count({
        where: { dataInicio: { gte: inicioHoje, lte: fimHoje } },
      }),
      prisma.agendamento.groupBy({
        by: ['status'],
        _count: { status: true },
        where: agendamentosWhere,
      }),
      prisma.postagem.count(),
      prisma.avaliacao.count(),
    ]);

    const porStatus = agendamentosPorStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});

    const dashboard = {
      usuarios: {
        total: totalUsuarios,
        ativos: usuariosAtivos,
        inativos: totalUsuarios - usuariosAtivos,
      },
      voluntarios: totalVoluntarios,
      servicos: totalServicos,
      agendamentos: {
        total: totalAgendamentos,
        hoje: agendamentosHoje,
        porStatus,
      },
      postagens: totalPostagens,
      avaliacoes: totalAvaliacoes,
      filtrosAplicados: { dataInicio: dataInicio || null, dataFim: dataFim || null },
    };

    if (tipo === 'completo') {
      const [usuariosPorRole, servicosPopulares] = await Promise.all([
        prisma.user.groupBy({ by: ['role'], _count: { role: true } }),
        prisma.agendamento.groupBy({
          by: ['servicoId'],
          _count: { servicoId: true },
          orderBy: { _count: { servicoId: 'desc' } },
          take: 5,
          where: { servicoId: { not: null } },
        }),
      ]);

      return {
        ...dashboard,
        usuariosPorRole: Object.fromEntries(usuariosPorRole.map((r) => [r.role, r._count.role])),
        servicosMaisUsados: servicosPopulares,
      };
    }

    return dashboard;
  },

  async relatorioAgendamentos(filtros = {}) {
    const { dataInicio, dataFim } = filtros;

    const where = {};
    if (dataInicio || dataFim) {
      where.dataInicio = {};
      if (dataInicio) where.dataInicio.gte = new Date(dataInicio);
      if (dataFim) where.dataInicio.lte = new Date(dataFim);
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        cliente: { select: { nome: true } },
        voluntario: { select: { nome: true } },
        servico: { select: { nome: true, preco: true } },
      },
      orderBy: { dataInicio: 'desc' },
    });

    const stats = {
      total: agendamentos.length,
      porStatus: agendamentos.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      }, {}),
    };

    return { agendamentos, stats };
  },

  async relatorioVoluntarios() {
    const voluntarios = await prisma.voluntario.findMany({
      include: {
        perfil: { select: { nome: true } },
        avaliacoesRecebidas: { select: { classificacao: true } },
        _count: { select: { servicos: true, postagens: true } },
      },
    });

    return voluntarios.map((v) => {
      const totalAvaliacoes = v.avaliacoesRecebidas.length;
      const mediaAvaliacao = totalAvaliacoes > 0
        ? (v.avaliacoesRecebidas.reduce((s, a) => s + a.classificacao, 0) / totalAvaliacoes).toFixed(2)
        : 'N/A';

      return {
        id: v.id,
        nome: v.perfil?.nome,
        ativo: v.ativo,
        avaliacaoMedia: mediaAvaliacao,
        totalAvaliacoes,
        totalServicos: v._count.servicos,
        totalPostagens: v._count.postagens,
      };
    });
  },

  async horariosComMaisDemanda() {
    const agendamentos = await prisma.agendamento.findMany({
      select: { dataInicio: true, status: true },
    });

    const porHora = {};
    agendamentos.forEach((a) => {
      if (a.dataInicio) {
        const hora = new Date(a.dataInicio).getHours();
        porHora[hora] = (porHora[hora] || 0) + 1;
      }
    });

    return Object.entries(porHora)
      .sort((a, b) => b[1] - a[1])
      .map(([hora, total]) => ({ hora: `${hora}:00`, demanda: total }));
  },
};

module.exports = adminService;
