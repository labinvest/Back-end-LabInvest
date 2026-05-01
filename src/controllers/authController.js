const authService = require('../services/authService');

const authController = {
  // Signup - Registrar novo usuário
  async signup(req, res) {
    try {
      const { nome, email, senha, telefone, endereco, role } = req.body;

      const resultado = await authService.signup({
        nome,
        email,
        senha,
        telefone,
        endereco,
        role
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso',
        dados: resultado
      });
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        erro: error.message
      });
    }
  },

  // Login - Fazer login
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const resultado = await authService.login(email, senha);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso',
        dados: resultado
      });
    } catch (error) {
      res.status(401).json({
        sucesso: false,
        erro: error.message
      });
    }
  },

  // Logout
  async logout(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Token não fornecido'
        });
      }

      const resultado = authService.logout(token);

      res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        erro: error.message
      });
    }
  },

  // Obter perfil do usuário logado
  async obterPerfil(req, res) {
    try {
      const userId = req.userId;

      const usuario = await authService.obterPerfil(userId);

      res.status(200).json({
        sucesso: true,
        dados: usuario
      });
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        erro: error.message
      });
    }
  },

  // Atualizar perfil do usuário
  async atualizarPerfil(req, res) {
    try {
      const userId = req.userId;
      const { nome, telefone, endereco } = req.body;

      const usuario = await authService.atualizarPerfil(userId, {
        nome,
        telefone,
        endereco
      });

      res.status(200).json({
        sucesso: true,
        mensagem: 'Perfil atualizado com sucesso',
        dados: usuario
      });
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        erro: error.message
      });
    }
  },

  // Alterar senha
  async alterarSenha(req, res) {
    try {
      const userId = req.userId;
      const { senhaAtual, novaSenha } = req.body;

      const resultado = await authService.alterarSenha(userId, senhaAtual, novaSenha);

      res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        erro: error.message
      });
    }
  }
};

module.exports = authController;
