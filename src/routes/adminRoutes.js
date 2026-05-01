const express = require('express');
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints exclusivos para administradores
 */

// ============================================
// USUÁRIOS
// ============================================

/**
 * @swagger
 * /api/admin/usuarios:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Admin - Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, especialista, admin]
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/admin/usuarios', adminMiddleware, adminController.listarUsuarios);

/**
 * @swagger
 * /api/admin/usuarios/{id}:
 *   get:
 *     summary: Obter detalhes de um usuário
 *     tags: [Admin - Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get('/admin/usuarios/:id', adminMiddleware, adminController.obterUsuario);

/**
 * @swagger
 * /api/admin/usuarios/{id}:
 *   put:
 *     summary: Editar um usuário
 *     tags: [Admin - Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put('/admin/usuarios/:id', adminMiddleware, adminController.editarUsuario);

/**
 * @swagger
 * /api/admin/usuarios/{id}/role:
 *   patch:
 *     summary: Mudar role de um usuário
 *     tags: [Admin - Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, especialista, admin]
 *     responses:
 *       200:
 *         description: Role atualizada
 */
router.patch('/admin/usuarios/:id/role', adminMiddleware, adminController.mudarRole);

/**
 * @swagger
 * /api/admin/usuarios/{id}:
 *   delete:
 *     summary: Deletar um usuário (soft delete)
 *     tags: [Admin - Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário deletado
 */
router.delete('/admin/usuarios/:id', adminMiddleware, adminController.deletarUsuario);

/**
 * @swagger
 * /api/admin/usuarios/{id}/resetar-senha:
 *   post:
 *     summary: Resetar senha de um usuário
 *     tags: [Admin - Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novaSenha
 *             properties:
 *               novaSenha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha resetada
 */
router.post('/admin/usuarios/:id/resetar-senha', adminMiddleware, adminController.resetarSenha);

// ============================================
// ESPECIALISTAS
// ============================================

/**
 * @swagger
 * /api/admin/especialistas:
 *   get:
 *     summary: Listar especialistas
 *     tags: [Admin - Especialistas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de especialistas
 */
router.get('/admin/especialistas', adminMiddleware, adminController.listarEspecialistas);

// ============================================
// SERVIÇOS
// ============================================

/**
 * @swagger
 * /api/admin/servicos:
 *   get:
 *     summary: Listar serviços
 *     tags: [Admin - Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de serviços
 */
router.get('/admin/servicos', adminMiddleware, adminController.listarServicos);

/**
 * @swagger
 * /api/admin/servicos:
 *   post:
 *     summary: Criar novo serviço
 *     tags: [Admin - Serviços]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Serviço criado
 */
router.post('/admin/servicos', adminMiddleware, adminController.criarServico);

/**
 * @swagger
 * /api/admin/servicos/{id}:
 *   put:
 *     summary: Editar serviço
 *     tags: [Admin - Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Serviço atualizado
 */
router.put('/admin/servicos/:id', adminMiddleware, adminController.editarServico);

/**
 * @swagger
 * /api/admin/servicos/{id}:
 *   delete:
 *     summary: Deletar serviço
 *     tags: [Admin - Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Serviço deletado
 */
router.delete('/admin/servicos/:id', adminMiddleware, adminController.deletarServico);

// ============================================
// AGENDAMENTOS
// ============================================

/**
 * @swagger
 * /api/admin/agendamentos:
 *   get:
 *     summary: Listar todos os agendamentos
 *     tags: [Admin - Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/admin/agendamentos', adminMiddleware, adminController.listarAgendamentos);

/**
 * @swagger
 * /api/admin/agendamentos/{id}/cancelar:
 *   post:
 *     summary: Cancelar agendamento
 *     tags: [Admin - Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento cancelado
 */
router.post('/admin/agendamentos/:id/cancelar', adminMiddleware, adminController.cancelarAgendamento);

// ============================================
// CHATS
// ============================================

/**
 * @swagger
 * /api/admin/chats:
 *   get:
 *     summary: Listar todos os chats
 *     tags: [Admin - Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de chats
 */
router.get('/admin/chats', adminMiddleware, adminController.listarChats);

/**
 * @swagger
 * /api/admin/chats/{id}/fechar:
 *   post:
 *     summary: Fechar chat
 *     tags: [Admin - Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat fechado
 */
router.post('/admin/chats/:id/fechar', adminMiddleware, adminController.fecharChat);

// ============================================
// POSTAGENS
// ============================================

/**
 * @swagger
 * /api/admin/postagens:
 *   get:
 *     summary: Listar postagens
 *     tags: [Admin - Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de postagens
 */
router.get('/admin/postagens', adminMiddleware, adminController.listarPostagens);

/**
 * @swagger
 * /api/admin/postagens/{id}:
 *   delete:
 *     summary: Deletar postagem (moderar)
 *     tags: [Admin - Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Postagem deletada
 */
router.delete('/admin/postagens/:id', adminMiddleware, adminController.deletarPostagem);

// ============================================
// DASHBOARD E RELATÓRIOS
// ============================================

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Dashboard com KPIs
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-05-01"
 *         description: Data de início do período
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-05-31"
 *         description: Data de fim do período
 *       - in: query
 *         name: especialista
 *         schema:
 *           type: integer
 *         description: ID do especialista para filtrar (opcional)
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [resumido, completo]
 *           default: resumido
 *         description: Tipo de dashboard (resumido ou com mais detalhes)
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get('/admin/dashboard', adminMiddleware, adminController.obterDashboard);

/**
 * @swagger
 * /api/admin/relatorios/agendamentos:
 *   get:
 *     summary: Relatório de agendamentos
 *     tags: [Admin - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Relatório de agendamentos
 */
router.get('/admin/relatorios/agendamentos', adminMiddleware, adminController.relatorioAgendamentos);

/**
 * @swagger
 * /api/admin/relatorios/especialistas:
 *   get:
 *     summary: Relatório de performance dos especialistas
 *     tags: [Admin - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório de especialistas
 */
router.get('/admin/relatorios/especialistas', adminMiddleware, adminController.relatorioEspecialistas);

/**
 * @swagger
 * /api/admin/relatorios/usuarios-ativos:
 *   get:
 *     summary: Usuários mais ativos
 *     tags: [Admin - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Usuários mais ativos
 */
router.get('/admin/relatorios/usuarios-ativos', adminMiddleware, adminController.usuariosMaisAtivos);

/**
 * @swagger
 * /api/admin/relatorios/horarios-demanda:
 *   get:
 *     summary: Horários com mais demanda
 *     tags: [Admin - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horários com mais demanda
 */
router.get('/admin/relatorios/horarios-demanda', adminMiddleware, adminController.horariosComMaisDemanda);

module.exports = router;
