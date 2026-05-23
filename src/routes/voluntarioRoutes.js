const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Voluntários
 *   description: Gerenciamento de voluntários
 */

/**
 * @swagger
 * /api/voluntarios:
 *   get:
 *     summary: Listar voluntários
 *     tags: [Voluntários]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
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
router.get('/voluntarios', voluntarioController.listar);

/**
 * @swagger
 * /api/voluntarios/{id}:
 *   get:
 *     summary: Obter voluntário por ID
 *     tags: [Voluntários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados do voluntário
 */
router.get('/voluntarios/:id', voluntarioController.obterPorId);

/**
 * @swagger
 * /api/voluntarios:
 *   post:
 *     summary: Cadastrar voluntário (vincula perfil existente)
 *     tags: [Voluntários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - perfilId
 *             properties:
 *               perfilId:
 *                 type: integer
 *               categoriaId:
 *                 type: integer
 *               formacao:
 *                 type: string
 *               bio:
 *                 type: string
 *               experiencia:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Voluntário criado
 */
router.post('/voluntarios', authMiddleware, voluntarioController.criar);

/**
 * @swagger
 * /api/voluntarios/{id}:
 *   put:
 *     summary: Atualizar voluntário
 *     tags: [Voluntários]
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
 *               categoriaId:
 *                 type: integer
 *               formacao:
 *                 type: string
 *               bio:
 *                 type: string
 *               experiencia:
 *                 type: integer
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Voluntário atualizado
 */
router.put('/voluntarios/:id', authMiddleware, voluntarioController.atualizar);

/**
 * @swagger
 * /api/voluntarios/{id}:
 *   delete:
 *     summary: Desativar voluntário (Admin)
 *     tags: [Voluntários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Voluntário desativado
 */
router.delete('/voluntarios/:id', adminMiddleware, voluntarioController.deletar);

module.exports = router;
