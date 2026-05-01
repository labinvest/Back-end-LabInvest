const express = require('express');
const router = express.Router();
const especialistaServicoController = require('../controllers/especialistaServicoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * /api/especialista-servico:
 *   post:
 *     summary: Criar associação entre especialista e serviço
 *     tags: [Especialista-Serviço]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - especialistaId
 *               - servicoId
 *             properties:
 *               especialistaId:
 *                 type: integer
 *               servicoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Associação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post('/', adminMiddleware, (req, res) => especialistaServicoController.criar(req, res));

/**
 * @swagger
 * /api/especialista-servico:
 *   get:
 *     summary: Listar todas as associações
 *     tags: [Especialista-Serviço]
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Associações listadas com sucesso
 */
router.get('/', (req, res) => especialistaServicoController.listarTodas(req, res));

/**
 * @swagger
 * /api/especialista-servico/especialista/{especialistaId}:
 *   get:
 *     summary: Listar serviços de um especialista
 *     tags: [Especialista-Serviço]
 *     parameters:
 *       - in: path
 *         name: especialistaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Serviços listados com sucesso
 */
router.get('/especialista/:especialistaId', (req, res) => especialistaServicoController.listarServicosEspecialista(req, res));

/**
 * @swagger
 * /api/especialista-servico/servico/{servicoId}:
 *   get:
 *     summary: Listar especialistas de um serviço
 *     tags: [Especialista-Serviço]
 *     parameters:
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Especialistas listados com sucesso
 */
router.get('/servico/:servicoId', (req, res) => especialistaServicoController.listarEspecialistasServico(req, res));

/**
 * @swagger
 * /api/especialista-servico/{especialistaId}/{servicoId}:
 *   get:
 *     summary: Obter associação específica
 *     tags: [Especialista-Serviço]
 *     parameters:
 *       - in: path
 *         name: especialistaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Associação obtida com sucesso
 *       404:
 *         description: Associação não encontrada
 */
router.get('/:especialistaId/:servicoId', (req, res) => especialistaServicoController.obter(req, res));

/**
 * @swagger
 * /api/especialista-servico/{especialistaId}/{servicoId}:
 *   delete:
 *     summary: Deletar associação
 *     tags: [Especialista-Serviço]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: especialistaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Associação deletada com sucesso
 *       401:
 *         description: Não autenticado
 */
router.delete('/:especialistaId/:servicoId', adminMiddleware, (req, res) => especialistaServicoController.deletar(req, res));

/**
 * @swagger
 * /api/especialista-servico/contar/especialista/{especialistaId}:
 *   get:
 *     summary: Contar serviços de um especialista
 *     tags: [Especialista-Serviço]
 *     parameters:
 *       - in: path
 *         name: especialistaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contagem realizada com sucesso
 */
router.get('/contar/especialista/:especialistaId', (req, res) => especialistaServicoController.contarServicosEspecialista(req, res));

/**
 * @swagger
 * /api/especialista-servico/contar/servico/{servicoId}:
 *   get:
 *     summary: Contar especialistas de um serviço
 *     tags: [Especialista-Serviço]
 *     parameters:
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contagem realizada com sucesso
 */
router.get('/contar/servico/:servicoId', (req, res) => especialistaServicoController.contarEspecialistasServico(req, res));

module.exports = router;
