const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Criar novo chat
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               assunto:
 *                 type: string
 *               mensagem:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat criado com sucesso
 */
router.post('/chats', (req, res) => chatController.criarChat(req, res));

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Listar todos os chats
 *     tags: [Chats]
 *     responses:
 *       200:
 *         description: Lista de chats
 */
router.get('/chats', (req, res) => chatController.listarChats(req, res));

/**
 * @swagger
 * /api/chats/{id}:
 *   get:
 *     summary: Obter chat por ID
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat encontrado
 */
router.get('/chats/:id', (req, res) => chatController.obterPorId(req, res));

/**
 * @swagger
 * /api/chats/{id}:
 *   put:
 *     summary: Atualizar chat
 *     tags: [Chats]
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
 *         description: Chat atualizado
 */
router.put('/chats/:id', (req, res) => chatController.atualizarChat(req, res));

/**
 * @swagger
 * /api/chats/{id}:
 *   delete:
 *     summary: Excluir chat
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat excluido
 */
router.delete('/chats/:id', (req, res) => chatController.excluirChat(req, res));

module.exports = router;