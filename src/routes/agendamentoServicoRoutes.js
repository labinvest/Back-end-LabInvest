const express = require('express');
const router = express.Router();
const agendamentoServicoController = require('../controllers/agendamentoServicoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * /api/agendamento-servico:
 *   post:
 *     summary: Criar associação entre agendamento e serviço
 *     tags: [Agendamento-Serviço]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agendamentoId
 *               - servicoId
 *             properties:
 *               agendamentoId:
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
router.post('/', authMiddleware, (req, res) => agendamentoServicoController.criar(req, res));

/**
 * @swagger
 * /api/agendamento-servico:
 *   get:
 *     summary: Listar todas as associações
 *     tags: [Agendamento-Serviço]
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
router.get('/', (req, res) => agendamentoServicoController.listarTodas(req, res));

/**
 * @swagger
 * /api/agendamento-servico/agendamento/{agendamentoId}:
 *   get:
 *     summary: Listar serviços de um agendamento
 *     tags: [Agendamento-Serviço]
 *     parameters:
 *       - in: path
 *         name: agendamentoId
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
router.get('/agendamento/:agendamentoId', (req, res) => agendamentoServicoController.listarServicosAgendamento(req, res));

/**
 * @swagger
 * /api/agendamento-servico/servico/{servicoId}:
 *   get:
 *     summary: Listar agendamentos de um serviço
 *     tags: [Agendamento-Serviço]
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
 *         description: Agendamentos listados com sucesso
 */
router.get('/servico/:servicoId', (req, res) => agendamentoServicoController.listarAgendamentosServico(req, res));

/**
 * @swagger
 * /api/agendamento-servico/{agendamentoId}/{servicoId}:
 *   get:
 *     summary: Obter associação específica
 *     tags: [Agendamento-Serviço]
 *     parameters:
 *       - in: path
 *         name: agendamentoId
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
router.get('/:agendamentoId/:servicoId', (req, res) => agendamentoServicoController.obter(req, res));

/**
 * @swagger
 * /api/agendamento-servico/{agendamentoId}/{servicoId}:
 *   delete:
 *     summary: Deletar associação
 *     tags: [Agendamento-Serviço]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agendamentoId
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
router.delete('/:agendamentoId/:servicoId', authMiddleware, (req, res) => agendamentoServicoController.deletar(req, res));

/**
 * @swagger
 * /api/agendamento-servico/contar/agendamento/{agendamentoId}:
 *   get:
 *     summary: Contar serviços de um agendamento
 *     tags: [Agendamento-Serviço]
 *     parameters:
 *       - in: path
 *         name: agendamentoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contagem realizada com sucesso
 */
router.get('/contar/agendamento/:agendamentoId', (req, res) => agendamentoServicoController.contarServicosAgendamento(req, res));

/**
 * @swagger
 * /api/agendamento-servico/contar/servico/{servicoId}:
 *   get:
 *     summary: Contar agendamentos de um serviço
 *     tags: [Agendamento-Serviço]
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
router.get('/contar/servico/:servicoId', (req, res) => agendamentoServicoController.contarAgendamentosServico(req, res));

/**
 * @swagger
 * /api/agendamento-servico/{agendamentoId}/preco:
 *   get:
 *     summary: Calcular preço total de um agendamento
 *     tags: [Agendamento-Serviço]
 *     parameters:
 *       - in: path
 *         name: agendamentoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Preço calculado com sucesso
 */
router.get('/:agendamentoId/preco', (req, res) => agendamentoServicoController.calcularPrecoTotal(req, res));

module.exports = router;
