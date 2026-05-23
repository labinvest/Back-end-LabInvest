const express = require('express');
const router = express.Router();
const notificacaoController = require('../controllers/notificacaoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Notificações
 *   description: Notificações do sistema
 */

/**
 * @swagger
 * /api/notificacoes:
 *   get:
 *     summary: Listar minhas notificações
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: apenasNaoLidas
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista de notificações
 */
router.get('/notificacoes', authMiddleware, notificacaoController.listarMinhas);

/**
 * @swagger
 * /api/notificacoes:
 *   post:
 *     summary: Criar notificação (Admin/Sistema)
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [perfilId, titulo, mensagem, tipo]
 *             properties:
 *               perfilId:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               mensagem:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [AGENDAMENTO, PAGAMENTO, CHAT, AVALIACAO, SISTEMA]
 *     responses:
 *       201:
 *         description: Notificação criada
 */
router.post('/notificacoes', adminMiddleware, notificacaoController.criar);

/**
 * @swagger
 * /api/notificacoes/{id}/lida:
 *   patch:
 *     summary: Marcar notificação como lida
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [perfilId]
 *             properties:
 *               perfilId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 */
router.patch('/notificacoes/:id/lida', authMiddleware, notificacaoController.marcarComoLida);

/**
 * @swagger
 * /api/notificacoes/todas-lidas:
 *   patch:
 *     summary: Marcar todas as notificações como lidas
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [perfilId]
 *             properties:
 *               perfilId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Notificações marcadas
 */
router.patch('/notificacoes/todas-lidas', authMiddleware, notificacaoController.marcarTodasComoLidas);

/**
 * @swagger
 * /api/notificacoes/{id}:
 *   delete:
 *     summary: Deletar notificação
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [perfilId]
 *             properties:
 *               perfilId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Notificação deletada
 */
router.delete('/notificacoes/:id', authMiddleware, notificacaoController.deletar);

module.exports = router;
