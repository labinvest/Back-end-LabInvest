const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Postagens
 *   description: Postagens dos voluntários
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Criar nova postagem
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voluntarioId, titulo, conteudo]
 *             properties:
 *               voluntarioId:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               conteudo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Postagem criada com sucesso
 */
router.post('/posts', authMiddleware, (req, res) => postController.criarPost(req, res));

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Listar postagens
 *     tags: [Postagens]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: voluntarioId
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de postagens
 */
router.get('/posts', (req, res) => postController.listarPosts(req, res));

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obter postagem por ID
 *     tags: [Postagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Postagem encontrada
 */
router.get('/posts/:id', (req, res) => postController.lerPost(req, res));

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Atualizar postagem
 *     tags: [Postagens]
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
 *               conteudo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Postagem atualizada
 */
router.put('/posts/:id', authMiddleware, (req, res) => postController.atualizarPost(req, res));

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Excluir postagem
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Postagem excluída
 */
router.delete('/posts/:id', authMiddleware, (req, res) => postController.deletarPost(req, res));

module.exports = router;
