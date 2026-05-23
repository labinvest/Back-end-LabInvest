const express = require('express');
const router = express.Router();
const voluntarioServicoController = require('../controllers/voluntarioServicoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Voluntário-Serviço
 *   description: Associação entre voluntários e serviços
 */

/**
 * @swagger
 * /api/voluntario-servico:
 *   post:
 *     summary: Criar associação voluntário-serviço (Admin)
 *     tags: [Voluntário-Serviço]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voluntarioId, servicoId]
 *             properties:
 *               voluntarioId:
 *                 type: integer
 *               servicoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Associação criada
 */
router.post('/', adminMiddleware, (req, res) => voluntarioServicoController.criar(req, res));

/**
 * @swagger
 * /api/voluntario-servico:
 *   get:
 *     summary: Listar todas as associações
 *     tags: [Voluntário-Serviço]
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Associações listadas
 */
router.get('/', (req, res) => voluntarioServicoController.listarTodas(req, res));

/**
 * @swagger
 * /api/voluntario-servico/voluntario/{voluntarioId}:
 *   get:
 *     summary: Listar serviços de um voluntário
 *     tags: [Voluntário-Serviço]
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Serviços do voluntário
 */
router.get('/voluntario/:voluntarioId', (req, res) => voluntarioServicoController.listarServicosVoluntario(req, res));

/**
 * @swagger
 * /api/voluntario-servico/servico/{servicoId}:
 *   get:
 *     summary: Listar voluntários de um serviço
 *     tags: [Voluntário-Serviço]
 *     parameters:
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Voluntários do serviço
 */
router.get('/servico/:servicoId', (req, res) => voluntarioServicoController.listarVoluntariosServico(req, res));

/**
 * @swagger
 * /api/voluntario-servico/{voluntarioId}/{servicoId}:
 *   get:
 *     summary: Obter associação específica
 *     tags: [Voluntário-Serviço]
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Associação encontrada
 */
router.get('/:voluntarioId/:servicoId', (req, res) => voluntarioServicoController.obter(req, res));

/**
 * @swagger
 * /api/voluntario-servico/{voluntarioId}/{servicoId}:
 *   delete:
 *     summary: Deletar associação (Admin)
 *     tags: [Voluntário-Serviço]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: servicoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Associação deletada
 */
router.delete('/:voluntarioId/:servicoId', adminMiddleware, (req, res) => voluntarioServicoController.deletar(req, res));

module.exports = router;
