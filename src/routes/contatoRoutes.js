const express = require('express');
const router = express.Router();
const contatoController = require('../controllers/contatoController');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Contato
 *   description: Mensagens de contato enviadas pelo formulário do FAQ
 */

/**
 * @swagger
 * /api/contato:
 *   post:
 *     summary: Enviar mensagem de contato
 *     tags: [Contato]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, mensagem]
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               mensagem:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
router.post('/contato', contatoController.criar);

/**
 * @swagger
 * /api/contato:
 *   get:
 *     summary: Listar mensagens de contato (Admin)
 *     tags: [Contato]
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
 *         name: lido
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista de mensagens de contato
 */
router.get('/contato', adminMiddleware, contatoController.listar);

/**
 * @swagger
 * /api/contato/{id}/lido:
 *   patch:
 *     summary: Marcar mensagem como lida (Admin)
 *     tags: [Contato]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mensagem marcada como lida
 */
router.patch('/contato/:id/lido', adminMiddleware, contatoController.marcarComoLido);

/**
 * @swagger
 * /api/contato/{id}:
 *   delete:
 *     summary: Deletar mensagem de contato (Admin)
 *     tags: [Contato]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mensagem removida
 */
router.delete('/contato/:id', adminMiddleware, contatoController.deletar);

module.exports = router;
