const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DEFAULT_JWT_SECRET = 'dev-secret';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

function gerarToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

const authService = {
  // Criar novo usuário (Signup) — cria User + Perfil atomicamente
  async signup(dados) {
    const { nome, email, senha, telefone, endereco, cpf, role } = dados;

    if (!nome || !email || !senha) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    // Roles válidas conforme enum do schema
    const rolesValidas = ['CLIENTE', 'VOLUNTARIO', 'ADMIN'];
    const roleDefinida = (role || 'CLIENTE').toUpperCase();

    if (!rolesValidas.includes(roleDefinida)) {
      throw new Error(`Role inválida. Use: ${rolesValidas.join(', ')}`);
    }

    const usuarioExistente = await prisma.user.findUnique({ where: { email } });
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    if (cpf) {
      const cpfExistente = await prisma.perfil.findUnique({ where: { cpf } });
      if (cpfExistente) {
        throw new Error('CPF já cadastrado');
      }
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar User + Perfil dentro de uma transaction
    const resultado = await prisma.$transaction(async (tx) => {
      const usuario = await tx.user.create({
        data: {
          email,
          senha: senhaHash,
          role: roleDefinida,
          ativo: true,
          perfil: {
            create: {
              nome,
              telefone: telefone || null,
              endereco: endereco || null,
              cpf: cpf || null,
            },
          },
        },
        include: {
          perfil: true,
        },
      });

      return usuario;
    });

    const token = gerarToken({ id: resultado.id, role: resultado.role, perfilId: resultado.perfil?.id });

    return {
      usuario: {
        id: resultado.id,
        email: resultado.email,
        role: resultado.role,
        ativo: resultado.ativo,
        perfil: {
          id: resultado.perfil?.id,
          nome: resultado.perfil?.nome,
          telefone: resultado.perfil?.telefone,
          endereco: resultado.perfil?.endereco,
        },
      },
      token,
      mensagem: 'Usuário criado com sucesso',
    };
  },

  // Login de usuário
  async login(email, senha) {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }

    const usuario = await prisma.user.findUnique({
      where: { email },
      include: { perfil: true },
    });

    if (!usuario) {
      throw new Error('Usuário ou senha incorretos');
    }

    if (!usuario.ativo) {
      throw new Error('Usuário inativo. Entre em contato com o suporte.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Usuário ou senha incorretos');
    }

    const token = gerarToken({ id: usuario.id, role: usuario.role, perfilId: usuario.perfil?.id });

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        ativo: usuario.ativo,
        perfil: usuario.perfil
          ? {
              id: usuario.perfil.id,
              nome: usuario.perfil.nome,
              telefone: usuario.perfil.telefone,
              endereco: usuario.perfil.endereco,
            }
          : null,
      },
      token,
    };
  },

  // Validar token
  validarToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  // Logout (stateless — client descarta o token)
  logout() {
    return { mensagem: 'Logout realizado com sucesso' };
  },

  // Obter dados do usuário logado (com perfil)
  async obterPerfil(userId) {
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        ativo: true,
        createdAt: true,
        perfil: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            endereco: true,
            cpf: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return usuario;
  },

  // Atualizar perfil do usuário
  async atualizarPerfil(userId, dados) {
    const { nome, telefone, endereco } = dados;

    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: { perfil: true },
    });

    if (!usuario) throw new Error('Usuário não encontrado');

    // Upsert no perfil
    const perfilAtualizado = await prisma.perfil.upsert({
      where: { userId },
      update: {
        nome: nome || undefined,
        telefone: telefone !== undefined ? telefone : undefined,
        endereco: endereco !== undefined ? endereco : undefined,
      },
      create: {
        userId,
        nome: nome || 'Sem nome',
        telefone: telefone || null,
        endereco: endereco || null,
      },
    });

    return perfilAtualizado;
  },

  // Alterar senha
  async alterarSenha(userId, senhaAtual, novaSenha) {
    if (!senhaAtual || !novaSenha) {
      throw new Error('Senha atual e nova senha são obrigatórias');
    }

    const usuario = await prisma.user.findUnique({ where: { id: userId } });
    if (!usuario) throw new Error('Usuário não encontrado');

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) throw new Error('Senha atual incorreta');

    const novaHash = await bcrypt.hash(novaSenha, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { senha: novaHash },
    });

    return { mensagem: 'Senha alterada com sucesso' };
  },
};

module.exports = authService;
