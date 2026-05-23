const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: Gestão de agendamentos
 */

/**
 * @swagger
 * /api/agendamentos:
 *   post:
 *     summary: Criar novo agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientePerfilId, voluntarioPerfilId, dataInicio]
 *             properties:
 *               clientePerfilId:
 *                 type: integer
 *               voluntarioPerfilId:
 *                 type: integer
 *               servicoId:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *               local:
 *                 type: string
 *               notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agendamento criado
 */
router.post('/agendamentos', authMiddleware, agendamentoController.criarAgendamento.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos:
 *   get:
 *     summary: Listar agendamentos
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clientePerfilId
 *         schema: { type: integer }
 *       - in: query
 *         name: voluntarioPerfilId
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AGENDADO, CONFIRMADO, REALIZADO, CANCELADO]
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/agendamentos', authMiddleware, agendamentoController.listarAgendamentos.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   get:
 *     summary: Obter agendamento por ID
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados do agendamento
 */
router.get('/agendamentos/:id', authMiddleware, agendamentoController.obterPorId.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   put:
 *     summary: Atualizar agendamento
 *     tags: [Agendamentos]
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
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *               local:
 *                 type: string
 *               notas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 */
router.put('/agendamentos/:id', authMiddleware, agendamentoController.atualizarAgendamento.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos/{id}/status:
 *   patch:
 *     summary: Atualizar status do agendamento
 *     tags: [Agendamentos]
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
 *                 enum: [AGENDADO, CONFIRMADO, REALIZADO, CANCELADO]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch('/agendamentos/:id/status', authMiddleware, agendamentoController.atualizarStatus.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   delete:
 *     summary: Excluir agendamento (Admin)
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Agendamento excluído
 */
router.delete('/agendamentos/:id', adminMiddleware, agendamentoController.excluirAgendamento.bind(agendamentoController));

module.exports = router;
