const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Pagamentos
 *   description: Gestão de pagamentos de agendamentos
 */

/**
 * @swagger
 * /api/pagamentos:
 *   get:
 *     summary: Listar pagamentos (Admin)
 *     tags: [Pagamentos]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, PAGO, CANCELADO]
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 */
router.get('/pagamentos', adminMiddleware, pagamentoController.listar);

/**
 * @swagger
 * /api/pagamentos/{id}:
 *   get:
 *     summary: Obter pagamento por ID
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados do pagamento
 */
router.get('/pagamentos/:id', authMiddleware, pagamentoController.obterPorId);

/**
 * @swagger
 * /api/pagamentos/agendamento/{agendamentoId}:
 *   get:
 *     summary: Obter pagamento por agendamento
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agendamentoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados do pagamento
 */
router.get('/pagamentos/agendamento/:agendamentoId', authMiddleware, pagamentoController.obterPorAgendamento);

/**
 * @swagger
 * /api/pagamentos:
 *   post:
 *     summary: Criar pagamento para um agendamento
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [agendamentoId, valor, metodo]
 *             properties:
 *               agendamentoId:
 *                 type: integer
 *               valor:
 *                 type: number
 *               metodo:
 *                 type: string
 *                 example: "PIX"
 *     responses:
 *       201:
 *         description: Pagamento criado
 */
router.post('/pagamentos', authMiddleware, pagamentoController.criar);

/**
 * @swagger
 * /api/pagamentos/{id}/status:
 *   patch:
 *     summary: Atualizar status do pagamento (Admin)
 *     tags: [Pagamentos]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, PAGO, CANCELADO]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch('/pagamentos/:id/status', adminMiddleware, pagamentoController.atualizarStatus);

module.exports = router;
