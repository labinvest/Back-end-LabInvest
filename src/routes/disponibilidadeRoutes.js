const express = require('express');
const router = express.Router();
const disponibilidadeController = require('../controllers/disponibilidadeController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Disponibilidades
 *   description: Disponibilidade de horários dos voluntários
 */

/**
 * @swagger
 * /api/voluntarios/{voluntarioId}/disponibilidades:
 *   get:
 *     summary: Listar disponibilidades de um voluntário
 *     tags: [Disponibilidades]
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: ativo
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista de disponibilidades
 */
router.get('/voluntarios/:voluntarioId/disponibilidades', disponibilidadeController.listarPorVoluntario);

/**
 * @swagger
 * /api/voluntarios/{voluntarioId}/disponibilidades:
 *   post:
 *     summary: Criar disponibilidade para um voluntário
 *     tags: [Disponibilidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [diaSemana, horaInicio, horaFim]
 *             properties:
 *               diaSemana:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: "0=Domingo, 1=Segunda, ..., 6=Sábado"
 *               horaInicio:
 *                 type: string
 *                 example: "08:00"
 *               horaFim:
 *                 type: string
 *                 example: "18:00"
 *               intervaloMinutos:
 *                 type: integer
 *                 default: 30
 *     responses:
 *       201:
 *         description: Disponibilidade criada
 */
router.post('/voluntarios/:voluntarioId/disponibilidades', authMiddleware, disponibilidadeController.criar);

/**
 * @swagger
 * /api/disponibilidades/{id}:
 *   get:
 *     summary: Obter disponibilidade por ID
 *     tags: [Disponibilidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Disponibilidade encontrada
 */
router.get('/disponibilidades/:id', disponibilidadeController.obterPorId);

/**
 * @swagger
 * /api/disponibilidades/{id}:
 *   put:
 *     summary: Atualizar disponibilidade
 *     tags: [Disponibilidades]
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
 *               horaInicio:
 *                 type: string
 *               horaFim:
 *                 type: string
 *               intervaloMinutos:
 *                 type: integer
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada
 */
router.put('/disponibilidades/:id', authMiddleware, disponibilidadeController.atualizar);

/**
 * @swagger
 * /api/disponibilidades/{id}:
 *   delete:
 *     summary: Deletar disponibilidade
 *     tags: [Disponibilidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Disponibilidade removida
 */
router.delete('/disponibilidades/:id', authMiddleware, disponibilidadeController.deletar);

module.exports = router;
