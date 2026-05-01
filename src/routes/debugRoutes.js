// Arquivo de DEBUG - Use este endpoint para verificar se o token está funcionando

const express = require('express');
const authService = require('../services/authService');

const router = express.Router();

/**
 * @swagger
 * /api/debug/verificar-token:
 *   get:
 *     summary: DEBUG - Verificar se o token é válido (com mais detalhes)
 *     tags: [Debug]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: Token (alternativo ao header Authorization)
 *       - in: query
 *         name: detalhado
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Mostrar informações detalhadas do token
 *     responses:
 *       200:
 *         description: Token é válido
 */
router.get('/debug/verificar-token', (req, res) => {
  // Aceitar token do header ou da query
  let authHeader = req.headers.authorization || '';
  const tokenQuery = req.query.token;
  const detalhado = req.query.detalhado === 'true';

  // Se não tem header mas tem query, adicionar o prefixo Bearer
  if (!authHeader && tokenQuery) {
    authHeader = `Bearer ${tokenQuery}`;
  }

  if (!authHeader) {
    return res.status(401).json({ 
      sucesso: false,
      erro: 'Token não fornecido',
      timestamp: new Date().toISOString(),
      instrucoes: [
        '1. Adicione o header: Authorization: Bearer SEU_TOKEN',
        '2. Ou use a query: ?token=SEU_TOKEN',
        '3. Copie o token do /api/debug/signup-admin'
      ]
    });
  }

  const [tipo, token] = authHeader.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ 
      sucesso: false,
      erro: 'Formato inválido',
      timestamp: new Date().toISOString(),
      instrucoes: 'Use: Authorization: Bearer SEU_TOKEN',
      exemploHeader: 'Authorization: Bearer abc123def456...'
    });
  }

  try {
    const decoded = authService.validarToken(token);
    
    const resposta = {
      sucesso: true,
      mensagem: 'Token é VÁLIDO!',
      timestamp: new Date().toISOString(),
      tokenPreview: token.substring(0, 20) + '...' + token.substring(token.length - 10),
      usuarioId: decoded.id,
      role: decoded.role,
      permissoes: decoded.role === 'admin' 
        ? ['Gerenciar usuários', 'Gerenciar serviços', 'Ver dashboard', 'Gerar relatórios']
        : ['Ver perfil', 'Fazer agendamentos']
    };

    if (detalhado) {
      resposta.info = {
        tokenLength: token.length,
        tipoToken: 'Bearer Token (hex 64 caracteres)',
        armazenado: 'Em memória (Map)',
        proximosTestes: [
          `GET /api/admin/dashboard -H "Authorization: Bearer ${token}"`,
          `GET /api/admin/usuarios -H "Authorization: Bearer ${token}"`,
          `POST /api/admin/logout -H "Authorization: Bearer ${token}"`
        ]
      };
    }

    return res.status(200).json(resposta);
  } catch (error) {
    return res.status(401).json({
      sucesso: false,
      erro: 'Token INVÁLIDO ou expirado',
      timestamp: new Date().toISOString(),
      detalhes: error.message,
      possiveisProblemas: [
        'Token não existe no servidor',
        'Token foi limpo (servidor reiniciado)',
        'Token foi revogado com logout',
        'Token foi digitado incorretamente'
      ],
      solucao: 'Gere um novo token com POST /api/debug/signup-admin'
    });
  }
});

/**
 * @swagger
 * /api/debug/signup-admin:
 *   post:
 *     summary: DEBUG - Criar admin e retornar token (com instruções)
 *     tags: [Debug]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin criado com token
 */
router.post('/debug/signup-admin', async (req, res) => {
  try {
    const authService2 = require('../services/authService');
    
    const resultado = await authService2.signup({
      nome: 'Admin Debug',
      email: req.body.email || `admin-${Date.now()}@debug.com`,
      senha: 'admin123',
      role: 'admin'
    });

    const { token } = resultado;

    res.status(201).json({
      sucesso: true,
      mensagem: '✅ Admin criado com sucesso!',
      timestamp: new Date().toISOString(),
      usuario: {
        id: resultado.usuario.id,
        nome: resultado.usuario.nome,
        email: resultado.usuario.email,
        role: resultado.usuario.role
      },
      token: token,
      tokenPreview: token.substring(0, 20) + '...',
      instrucoes: {
        passo1: 'Copie o TOKEN acima (campo "token")',
        passo2: 'Use em qualquer requisição com header:',
        passo2_exemplo: `Authorization: Bearer ${token}`,
        passo3: 'Teste com qualquer endpoint admin'
      },
      testesCURL: {
        verificarToken: `curl -X GET "http://localhost:3000/api/debug/verificar-token?token=${token}"`,
        dashboard: `curl -X GET "http://localhost:3000/api/admin/dashboard" -H "Authorization: Bearer ${token}"`,
        listarUsuarios: `curl -X GET "http://localhost:3000/api/admin/usuarios" -H "Authorization: Bearer ${token}"`,
        detalhes: 'Copie qualquer um dos comandos acima e rode no PowerShell'
      }
    });
  } catch (error) {
    res.status(400).json({
      sucesso: false,
      erro: '❌ Erro ao criar admin',
      timestamp: new Date().toISOString(),
      detalhes: error.message,
      solucao: 'Verifique se o servidor está rodando: npm run dev'
    });
  }
});

/**
 * @swagger
 * /api/debug/signup-usuario:
 *   post:
 *     summary: DEBUG - Criar usuário com role escolhida
 *     tags: [Debug]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 default: "Usuário Debug"
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, cliente, especialista, admin]
 *                 default: "cliente"
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               formacao:
 *                 type: string
 *                 description: "Apenas para especialistas"
 *     responses:
 *       201:
 *         description: Usuário criado com token
 */
router.post('/debug/signup-usuario', async (req, res) => {
  try {
    const authService2 = require('../services/authService');
    
    const {
      nome = 'Usuário Debug',
      email = `user-${Date.now()}@debug.com`,
      role = 'cliente',
      telefone = null,
      endereco = null,
      formacao = null
    } = req.body;

    const rolesValidas = ['user', 'cliente', 'especialista', 'admin'];
    if (!rolesValidas.includes(role)) {
      return res.status(400).json({
        sucesso: false,
        erro: `❌ Role inválida`,
        rolesDisponiveis: rolesValidas,
        exemplo: { role: 'cliente' }
      });
    }

    const resultado = await authService2.signup({
      nome,
      email,
      senha: 'debug123',
      telefone,
      endereco,
      role,
      formacao: role === 'especialista' ? (formacao || 'Formação padrão') : null
    });

    const { token } = resultado;

    res.status(201).json({
      sucesso: true,
      mensagem: `✅ ${role.charAt(0).toUpperCase() + role.slice(1)} criado com sucesso!`,
      timestamp: new Date().toISOString(),
      usuario: resultado.usuario,
      token: token,
      tokenPreview: token.substring(0, 20) + '...',
      tabelas: {
        user: 'Sempre criado em User',
        adicional: role === 'cliente' 
          ? 'Também criado em Cliente' 
          : role === 'especialista'
          ? 'Também criado em Especialista'
          : 'Nenhuma tabela adicional'
      },
      testesCURL: {
        verificarToken: `curl -X GET "http://localhost:3000/api/debug/verificar-token?token=${token}"`,
        dashboard: role === 'admin' ? `curl -X GET "http://localhost:3000/api/admin/dashboard" -H "Authorization: Bearer ${token}"` : 'Não disponível (não é admin)',
        listarUsuarios: role === 'admin' ? `curl -X GET "http://localhost:3000/api/admin/usuarios" -H "Authorization: Bearer ${token}"` : 'Não disponível (não é admin)'
      }
    });
  } catch (error) {
    res.status(400).json({
      sucesso: false,
      erro: '❌ Erro ao criar usuário',
      timestamp: new Date().toISOString(),
      detalhes: error.message,
      sugestoes: [
        'Email pode já estar cadastrado',
        'Role deve ser: user, cliente, especialista ou admin',
        'Verifique se o servidor está rodando: npm run dev'
      ]
    });
  }
});

module.exports = router;
