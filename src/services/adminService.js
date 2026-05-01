const prisma = require('../lib/prisma');

const adminService = {
  // ============================================
  // USUÁRIOS
  // ============================================

  // Listar todos os usuários
  async listarUsuarios(filtros = {}) {
    const { page = 1, limit = 20, role, ativo, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (ativo !== undefined) where.ativo = ativo === 'true' || ativo === true;
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [usuarios, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
          telefone: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return {
      usuarios,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    };
  },

  // Ver detalhes de um usuário
  async obterUsuario(id) {
    const usuario = await prisma.user.findUnique({
      where: { id }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return usuario;
  },

  // Editar usuário
  async editarUsuario(id, dados) {
    const { nome, email, telefone, endereco, ativo } = dados;

    const usuarioExistente = await prisma.user.findUnique({
      where: { id }
    });

    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se email já existe (em outro usuário)
    if (email && email !== usuarioExistente.email) {
      const emailJaExiste = await prisma.user.findUnique({
        where: { email }
      });

      if (emailJaExiste) {
        throw new Error('Email já está em uso');
      }
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id },
      data: {
        nome: nome || undefined,
        email: email || undefined,
        telefone: telefone || undefined,
        endereco: endereco || undefined,
        ativo: ativo !== undefined ? ativo : undefined
      }
    });

    return usuarioAtualizado;
  },

  // Mudar role de um usuário
  async mudarRole(id, novoRole) {
    const rolesValidas = ['user', 'especialista', 'admin'];

    if (!rolesValidas.includes(novoRole)) {
      throw new Error(`Role inválida. Valores válidos: ${rolesValidas.join(', ')}`);
    }

    const usuario = await prisma.user.findUnique({
      where: { id }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id },
      data: { role: novoRole }
    });

    return usuarioAtualizado;
  },

  // Deletar usuário (soft delete)
  async deletarUsuario(id) {
    const usuario = await prisma.user.findUnique({
      where: { id }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Soft delete - apenas marca como inativo
    await prisma.user.update({
      where: { id },
      data: { ativo: false }
    });

    return { mensagem: 'Usuário deletado com sucesso' };
  },

  // Resetar senha do usuário
  async resetarSenha(id, novaSenha) {
    if (!novaSenha) {
      throw new Error('Nova senha é obrigatória');
    }

    const usuario = await prisma.user.findUnique({
      where: { id }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    await prisma.user.update({
      where: { id },
      data: { senha: novaSenha }
    });

    return { mensagem: 'Senha resetada com sucesso' };
  },

  // ============================================
  // ESPECIALISTAS
  // ============================================

  // Listar especialistas
  async listarEspecialistas(filtros = {}) {
    const { page = 1, limit = 20, search } = filtros;
    const skip = (page - 1) * limit;

    const where = { role: 'especialista' };
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [especialistas, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          ativo: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return {
      especialistas,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    };
  },

  // ============================================
  // SERVIÇOS
  // ============================================

  // Listar serviços
  async listarServicos(filtros = {}) {
    const { page = 1, limit = 20, ativo, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (ativo !== undefined) where.ativo = ativo === 'true' || ativo === true;
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [servicos, total] = await Promise.all([
      prisma.servico.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.servico.count({ where })
    ]);

    return {
      servicos,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    };
  },

  // Criar serviço
  async criarServico(dados) {
    const { nome, descricao, preco } = dados;

    if (!nome || !preco) {
      throw new Error('Nome e preço são obrigatórios');
    }

    const servico = await prisma.servico.create({
      data: {
        nome,
        descricao: descricao || null,
        preco: parseFloat(preco),
        ativo: true
      }
    });

    return servico;
  },

  // Editar serviço
  async editarServico(id, dados) {
    const { nome, descricao, preco, ativo } = dados;

    const servico = await prisma.servico.findUnique({
      where: { id }
    });

    if (!servico) {
      throw new Error('Serviço não encontrado');
    }

    const servicoAtualizado = await prisma.servico.update({
      where: { id },
      data: {
        nome: nome || undefined,
        descricao: descricao || undefined,
        preco: preco ? parseFloat(preco) : undefined,
        ativo: ativo !== undefined ? ativo : undefined
      }
    });

    return servicoAtualizado;
  },

  // Deletar serviço (soft delete)
  async deletarServico(id) {
    const servico = await prisma.servico.findUnique({
      where: { id }
    });

    if (!servico) {
      throw new Error('Serviço não encontrado');
    }

    await prisma.servico.update({
      where: { id },
      data: { ativo: false }
    });

    return { mensagem: 'Serviço deletado com sucesso' };
  },

  // ============================================
  // AGENDAMENTOS
  // ============================================

  // Listar todos os agendamentos
  async listarAgendamentos(filtros = {}) {
    const { page = 1, limit = 20, status, search } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const [agendamentos, total] = await Promise.all([
      prisma.agendamento.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, nome: true, email: true } },
          especialista: { select: { id: true, nome: true, email: true } },
          servico: { select: { id: true, nome: true, preco: true } }
        },
        orderBy: { data: 'desc' }
      }),
      prisma.agendamento.count({ where })
    ]);

    return {
      agendamentos,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    };
  },

  // Cancelar agendamento
  async cancelarAgendamento(id) {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id }
    });

    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    const agendamentoCancelado = await prisma.agendamento.update({
      where: { id },
      data: { status: 'cancelado' }
    });

    return agendamentoCancelado;
  },

  // ============================================
  // CHATS
  // ============================================

  // Listar todos os chats
  async listarChats(filtros = {}) {
    const { page = 1, limit = 20, status } = filtros;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const [chats, total] = await Promise.all([
      prisma.chat.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, nome: true, email: true } },
          especialista: { select: { id: true, nome: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.chat.count({ where })
    ]);

    return {
      chats,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    };
  },

  // Fechar chat
  async fecharChat(id) {
    const chat = await prisma.chat.findUnique({
      where: { id }
    });

    if (!chat) {
      throw new Error('Chat não encontrado');
    }

    const chatFechado = await prisma.chat.update({
      where: { id },
      data: { status: 'fechado' }
    });

    return chatFechado;
  },

  // ============================================
  // POSTAGENS
  // ============================================

  // Listar postagens
  async listarPostagens(filtros = {}) {
    const { page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const [postagens, total] = await Promise.all([
      prisma.postagem.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, nome: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.postagem.count()
    ]);

    return {
      postagens,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    };
  },

  // Deletar postagem (moderar)
  async deletarPostagem(id) {
    const postagem = await prisma.postagem.findUnique({
      where: { id }
    });

    if (!postagem) {
      throw new Error('Postagem não encontrada');
    }

    await prisma.postagem.delete({
      where: { id }
    });

    return { mensagem: 'Postagem removida com sucesso' };
  },

  // ============================================
  // DASHBOARD E ESTATÍSTICAS
  // ============================================

  // Dashboard com KPIs
  async obterDashboard(filtros = {}) {
    const { dataInicio, dataFim, especialista, tipo = 'resumido' } = filtros;

    // Construir filtros de data para agendamentos
    let filtroData = {};
    if (dataInicio || dataFim) {
      if (dataInicio) {
        filtroData.gte = new Date(dataInicio + 'T00:00:00');
      }
      if (dataFim) {
        filtroData.lte = new Date(dataFim + 'T23:59:59');
      }
    }

    // Construir filtro de especialista
    let filtroEspecialista = especialista ? { especialista_id: especialista } : {};

    // Query principal de agendamentos com filtros
    const agendamentosQuery = {
      ...(Object.keys(filtroData).length > 0 && { data: filtroData }),
      ...filtroEspecialista
    };

    const [
      totalUsuarios,
      usuariosAtivos,
      totalEspecialistas,
      totalServicos,
      totalAgendamentos,
      agendamentosHoje,
      agendamentosPeriodo,
      chatsAbertos,
      postagens
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { ativo: true } }),
      prisma.user.count({ where: { role: 'especialista' } }),
      prisma.servico.count(),
      prisma.agendamento.count(),
      prisma.agendamento.count({
        where: {
          data: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      Object.keys(agendamentosQuery).length > 0
        ? prisma.agendamento.count({ where: agendamentosQuery })
        : prisma.agendamento.count(),
      prisma.chat.count({ where: { status: 'aberto' } }),
      prisma.postagem.count()
    ]);

    // Dashboard resumido (padrão)
    const dashboardResumo = {
      usuarios: {
        total: totalUsuarios,
        ativos: usuariosAtivos,
        inativos: totalUsuarios - usuariosAtivos
      },
      especialistas: totalEspecialistas,
      servicos: totalServicos,
      agendamentos: {
        total: totalAgendamentos,
        hoje: agendamentosHoje,
        ...(Object.keys(agendamentosQuery).length > 0 && { periodo: agendamentosPeriodo })
      },
      chatsAbertos,
      postagens,
      filtrosAplicados: {
        dataInicio: dataInicio || null,
        dataFim: dataFim || null,
        especialista: especialista || null
      }
    };

    // Se solicitar tipo completo, adicionar mais detalhes
    if (tipo === 'completo') {
      const [
        usuariosPorRole,
        agendamentosProximos,
        servicosPopulares,
        chatsPorEspecialista
      ] = await Promise.all([
        prisma.user.groupBy({
          by: ['role'],
          _count: true
        }),
        prisma.agendamento.findMany({
          take: 5,
          orderBy: { data: 'asc' },
          where: agendamentosQuery,
          include: { cliente: true, especialista: true }
        }),
        prisma.agendamento.groupBy({
          by: ['servico_id'],
          _count: true,
          orderBy: { _count: { servico_id: 'desc' } },
          take: 5
        }),
        prisma.chat.count({ where: { status: 'aberto' } })
      ]);

      return {
        ...dashboardResumo,
        usuariosPorRole: Object.fromEntries(usuariosPorRole.map(r => [r.role, r._count])),
        agendamentosProximos: agendamentosProximos.length,
        servicosMaisUsados: servicosPopulares.length,
        detalhesChat: chatsPorEspecialista
      };
    }

    return dashboardResumo;
  },

  // Relatório de agendamentos
  async relatorioAgendamentos(filtros = {}) {
    const { dataInicio, dataFim } = filtros;

    const where = {};
    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) where.data.gte = new Date(dataInicio);
      if (dataFim) where.data.lte = new Date(dataFim);
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        user: { select: { nome: true } },
        especialista: { select: { nome: true } },
        servico: { select: { nome: true, preco: true } }
      }
    });

    const stats = {
      total: agendamentos.length,
      porStatus: {
        agendado: agendamentos.filter(a => a.status === 'agendado').length,
        confirmado: agendamentos.filter(a => a.status === 'confirmado').length,
        realizado: agendamentos.filter(a => a.status === 'realizado').length,
        cancelado: agendamentos.filter(a => a.status === 'cancelado').length
      }
    };

    return { agendamentos, stats };
  },

  // Relatório de performance de especialistas
  async relatorioEspecialistas() {
    const especialistas = await prisma.user.findMany({
      where: { role: 'especialista' },
      include: {
        agendamentos: { select: { status: true } },
        agendamentosEspec: { select: { status: true } }
      }
    });

    const relatorio = especialistas.map(esp => ({
      id: esp.id,
      nome: esp.nome,
      email: esp.email,
      totalAgendamentos: esp.agendamentosEspec.length,
      agendamentosRealizados: esp.agendamentosEspec.filter(a => a.status === 'realizado').length,
      taxaCompleticao: esp.agendamentosEspec.length > 0 
        ? ((esp.agendamentosEspec.filter(a => a.status === 'realizado').length / esp.agendamentosEspec.length) * 100).toFixed(2) + '%'
        : 'N/A'
    }));

    return relatorio;
  },

  // Usuários mais ativos
  async usuariosMaisAtivos(limite = 10) {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        _count: {
          select: {
            agendamentos: true,
            chats: true,
            postagens: true
          }
        }
      }
    });

    const comAtividade = usuarios
      .map(u => ({
        ...u,
        totalAtividade: u._count.agendamentos + u._count.chats + u._count.postagens
      }))
      .sort((a, b) => b.totalAtividade - a.totalAtividade)
      .slice(0, limite);

    return comAtividade;
  },

  // Horários com mais demanda
  async horariosComMaisDemanda() {
    const agendamentos = await prisma.agendamento.findMany({
      select: { data: true, status: true }
    });

    const porHora = {};
    agendamentos.forEach(a => {
      if (a.data) {
        const hora = new Date(a.data).getHours();
        porHora[hora] = (porHora[hora] || 0) + 1;
      }
    });

    return Object.entries(porHora)
      .sort((a, b) => b[1] - a[1])
      .map(([hora, total]) => ({
        hora: `${hora}:00`,
        demanda: total
      }));
  }
};

module.exports = adminService;
