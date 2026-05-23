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
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [CLIENTE, VOLUNTARIO, ADMIN] }
 *       - in: query
 *         name: ativo
 *         schema: { type: boolean }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/admin/usuarios', adminMiddleware, adminController.listarUsuarios);
router.get('/admin/usuarios/:id', adminMiddleware, adminController.obterUsuario);
router.put('/admin/usuarios/:id', adminMiddleware, adminController.editarUsuario);
router.patch('/admin/usuarios/:id/role', adminMiddleware, adminController.mudarRole);
router.delete('/admin/usuarios/:id', adminMiddleware, adminController.deletarUsuario);
router.post('/admin/usuarios/:id/resetar-senha', adminMiddleware, adminController.resetarSenha);

// ============================================
// VOLUNTÁRIOS
// ============================================

/**
 * @swagger
 * /api/admin/voluntarios:
 *   get:
 *     summary: Listar voluntários (Admin)
 *     tags: [Admin - Voluntários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoriaId
 *         schema: { type: integer }
 *       - in: query
 *         name: ativo
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista de voluntários
 */
router.get('/admin/voluntarios', adminMiddleware, adminController.listarVoluntarios);

// ============================================
// SERVIÇOS
// ============================================

router.get('/admin/servicos', adminMiddleware, adminController.listarServicos);
router.post('/admin/servicos', adminMiddleware, adminController.criarServico);
router.put('/admin/servicos/:id', adminMiddleware, adminController.editarServico);
router.delete('/admin/servicos/:id', adminMiddleware, adminController.deletarServico);

// ============================================
// AGENDAMENTOS
// ============================================

router.get('/admin/agendamentos', adminMiddleware, adminController.listarAgendamentos);
router.post('/admin/agendamentos/:id/cancelar', adminMiddleware, adminController.cancelarAgendamento);

// ============================================
// POSTAGENS
// ============================================

router.get('/admin/postagens', adminMiddleware, adminController.listarPostagens);
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
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: dataFim
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: tipo
 *         schema: { type: string, enum: [resumido, completo], default: resumido }
 *     responses:
 *       200:
 *         description: Dados do dashboard
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
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: dataFim
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Relatório gerado
 */
router.get('/admin/relatorios/agendamentos', adminMiddleware, adminController.relatorioAgendamentos);

/**
 * @swagger
 * /api/admin/relatorios/voluntarios:
 *   get:
 *     summary: Relatório de performance dos voluntários
 *     tags: [Admin - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado
 */
router.get('/admin/relatorios/voluntarios', adminMiddleware, adminController.relatorioVoluntarios);

/**
 * @swagger
 * /api/admin/relatorios/horarios:
 *   get:
 *     summary: Horários com mais demanda
 *     tags: [Admin - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horários mais demandados
 */
router.get('/admin/relatorios/horarios', adminMiddleware, adminController.horariosComMaisDemanda);

module.exports = router;
