const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Perfil
 *   description: Gerenciamento de perfis de usuários
 */

/**
 * @swagger
 * /api/perfil/meu:
 *   get:
 *     summary: Obter meu perfil
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário autenticado
 */
router.get('/perfil/meu', authMiddleware, perfilController.obterMeuPerfil);

/**
 * @swagger
 * /api/perfil/meu:
 *   put:
 *     summary: Atualizar meu perfil
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               cpf:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado
 */
router.put('/perfil/meu', authMiddleware, perfilController.atualizarMeuPerfil);

/**
 * @swagger
 * /api/perfis:
 *   get:
 *     summary: Listar todos os perfis (Admin)
 *     tags: [Perfil]
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
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de perfis
 */
router.get('/perfis', adminMiddleware, perfilController.listar);

/**
 * @swagger
 * /api/perfis/{id}:
 *   get:
 *     summary: Obter perfil por ID (Admin)
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados do perfil
 */
router.get('/perfis/:id', adminMiddleware, perfilController.obterPorId);

module.exports = router;
