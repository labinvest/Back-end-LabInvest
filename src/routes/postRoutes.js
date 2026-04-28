const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Criar novo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               conteudo:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 */
router.post('/posts', (req, res) => postController.criarPost(req, res));

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Listar todos os posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get('/posts', (req, res) => postController.listarPosts(req, res));

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obter post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post encontrado
 */
router.get('/posts/:id', (req, res) => postController.lerPost(req, res));

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Atualizar post
 *     tags: [Posts]
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
 *         description: Post atualizado
 */
router.put('/posts/:id', (req, res) => postController.atualizarPost(req, res));

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Excluir post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post excluido
 */
router.delete('/posts/:id', (req, res) => postController.deletarPost(req, res));

module.exports = router;