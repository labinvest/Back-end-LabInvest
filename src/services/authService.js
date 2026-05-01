const prisma = require('../lib/prisma');
const crypto = require('crypto');

// Armazenar tokens ativos em memória (em produção, usar banco de dados)
const tokensAtivos = new Map();

// Gerar token simples
function gerarToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Armazenar informações do token
function armazenarToken(token, userId, role = 'user') {
  tokensAtivos.set(token, { id: userId, role });
}

const authService = {
  // Criar novo usuário (Signup)
  async signup(dados) {
    const { nome, email, senha, telefone, endereco, role, formacao } = dados;

    // Validar dados obrigatórios
    if (!nome || !email || !senha) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    // Verificar se usuário já existe (em ambas as tabelas)
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    // Validar role
    const rolesValidas = ['user', 'cliente', 'especialista', 'admin'];
    const roleDefinida = role || 'user';
    
    if (!rolesValidas.includes(roleDefinida)) {
      throw new Error(`Role inválida. Use: ${rolesValidas.join(', ')}`);
    }

    try {
      // Criar usuário na tabela User
      const usuario = await prisma.user.create({
        data: {
          nome,
          email,
          senha,
          telefone: telefone || null,
          endereco: endereco || null,
          role: roleDefinida,
          ativo: true
        }
      });

      // Criar registro na tabela específica conforme a role
      if (roleDefinida === 'cliente') {
        await prisma.cliente.create({
          data: {
            nome,
            email,
            telefone: telefone || null,
            endereco: endereco || null
          }
        });
      } else if (roleDefinida === 'especialista') {
        await prisma.especialista.create({
          data: {
            nome,
            email,
            telefone: telefone || null,
            endereco: endereco || null,
            formacao: formacao || null
          }
        });
      }

      // Gerar token
      const token = gerarToken();
      armazenarToken(token, usuario.id, usuario.role);

      return {
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          telefone: usuario.telefone,
          endereco: usuario.endereco,
          ...(roleDefinida === 'especialista' && { formacao })
        },
        token,
        mensagem: `${roleDefinida === 'cliente' ? 'Cliente' : roleDefinida === 'especialista' ? 'Especialista' : 'Usuário'} criado com sucesso!`
      };
    } catch (error) {
      // Se houver erro ao criar nas tabelas específicas, tentar deletar o User criado
      if (error.code !== 'P2002') { // P2002 é erro de unique constraint
        await prisma.user.deleteMany({
          where: { email }
        }).catch(() => {
          // Silenciar erro se não conseguir deletar
        });
      }
      throw error;
    }
  },

  // Login de usuário
  async login(email, senha) {
    // Validar dados obrigatórios
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Buscar usuário
    const usuario = await prisma.user.findUnique({
      where: { email }
    });

    if (!usuario || usuario.senha !== senha) {
      throw new Error('Usuário ou senha incorretos');
    }

    if (!usuario.ativo) {
      throw new Error('Usuário inativo');
    }

    // Gerar token
    const token = gerarToken();
    armazenarToken(token, usuario.id, usuario.role);

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        telefone: usuario.telefone,
        endereco: usuario.endereco
      },
      token
    };
  },

  // Validar token
  validarToken(token) {
    if (!tokensAtivos.has(token)) {
      throw new Error('Token inválido');
    }
    return tokensAtivos.get(token);
  },

  // Logout
  logout(token) {
    tokensAtivos.delete(token);
    return { mensagem: 'Logout realizado com sucesso' };
  },

  // Obter dados do usuário logado
  async obterPerfil(userId) {
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        telefone: true,
        endereco: true,
        ativo: true,
        createdAt: true
      }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return usuario;
  },

  // Atualizar perfil do usuário
  async atualizarPerfil(userId, dados) {
    const { nome, telefone, endereco } = dados;

    const usuario = await prisma.user.update({
      where: { id: userId },
      data: {
        nome: nome || undefined,
        telefone: telefone || undefined,
        endereco: endereco || undefined
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        telefone: true,
        endereco: true
      }
    });

    return usuario;
  },

  // Alterar senha
  async alterarSenha(userId, senhaAtual, novaSenha) {
    if (!senhaAtual || !novaSenha) {
      throw new Error('Senha atual e nova senha são obrigatórias');
    }

    const usuario = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    if (usuario.senha !== senhaAtual) {
      throw new Error('Senha atual incorreta');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { senha: novaSenha }
    });

    return { mensagem: 'Senha alterada com sucesso' };
  }
};

module.exports = authService;
