const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

/**
 * @swagger
 * /api/agendamentos:
 *   post:
 *     summary: Criar novo agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               duracao:
 *                 type: integer
 *               local:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 */
router.post('/agendamentos', agendamentoController.criarAgendamento.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos:
 *   get:
 *     summary: Listar todos os agendamentos
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/agendamentos', agendamentoController.listarAgendamentos.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   get:
 *     summary: Obter agendamento por ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *       404:
 *         description: Agendamento nao encontrado
 */
router.get('/agendamentos/:id', agendamentoController.obterPorId.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   put:
 *     summary: Atualizar agendamento
 *     tags: [Agendamentos]
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
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 */
router.put('/agendamentos/:id', agendamentoController.atualizarAgendamento.bind(agendamentoController));

/**
 * @swagger
 * /api/agendamentos/{id}:
 *   delete:
 *     summary: Excluir agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento excluido
 */
router.delete('/agendamentos/:id', agendamentoController.excluirAgendamento.bind(agendamentoController));

module.exports = router;