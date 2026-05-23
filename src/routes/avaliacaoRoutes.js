const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Avaliações
 *   description: Avaliações de voluntários
 */

/**
 * @swagger
 * /api/avaliacoes:
 *   get:
 *     summary: Listar avaliações
 *     tags: [Avaliações]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: voluntarioId
 *         schema: { type: integer }
 *       - in: query
 *         name: perfilId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */
router.get('/avaliacoes', avaliacaoController.listar);

/**
 * @swagger
 * /api/avaliacoes/{id}:
 *   get:
 *     summary: Obter avaliação por ID
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados da avaliação
 */
router.get('/avaliacoes/:id', avaliacaoController.obterPorId);

/**
 * @swagger
 * /api/avaliacoes:
 *   post:
 *     summary: Criar avaliação
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [perfilId, classificacao]
 *             properties:
 *               perfilId:
 *                 type: integer
 *               voluntarioId:
 *                 type: integer
 *               agendamentoId:
 *                 type: integer
 *               classificacao:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação criada
 */
router.post('/avaliacoes', authMiddleware, avaliacaoController.criar);

/**
 * @swagger
 * /api/avaliacoes/{id}:
 *   delete:
 *     summary: Deletar avaliação (Admin)
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Avaliação removida
 */
router.delete('/avaliacoes/:id', adminMiddleware, avaliacaoController.deletar);

module.exports = router;
