const express = require('express');
const ServicoController = require('../controllers/servicoController');

const router = express.Router();

/**
 * @swagger
 * /api/servicos:
 *   post:
 *     summary: Criar novo servico
 *     tags: [Servicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Servico criado com sucesso
 */
router.post('/servicos', (req, res) => ServicoController.criarServico(req, res));

/**
 * @swagger
 * /api/servicos:
 *   get:
 *     summary: Listar todos os servicos
 *     tags: [Servicos]
 *     responses:
 *       200:
 *         description: Lista de servicos
 */
router.get('/servicos', (req, res) => ServicoController.listarServicos(req, res));

/**
 * @swagger
 * /api/servicos/{id}:
 *   get:
 *     summary: Obter servico por ID
 *     tags: [Servicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servico encontrado
 */
router.get('/servicos/:id', (req, res) => ServicoController.obterPorId(req, res));

/**
 * @swagger
 * /api/servicos/{id}:
 *   put:
 *     summary: Atualizar servico
 *     tags: [Servicos]
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
 *         description: Servico atualizado
 */
router.put('/servicos/:id', (req, res) => ServicoController.atualizarServico(req, res));

/**
 * @swagger
 * /api/servicos/{id}:
 *   delete:
 *     summary: Excluir servico
 *     tags: [Servicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servico excluido
 */
router.delete('/servicos/:id', (req, res) => ServicoController.excluirServico(req, res));

module.exports = router;

