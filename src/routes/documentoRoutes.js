const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const tipoDocumentoController = require('../controllers/tipoDocumentoController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   - name: Documentos
 *     description: Documentos de voluntários
 *   - name: Tipos de Documento
 *     description: Tipos de documentos aceitos
 */

// ============================================
// TIPOS DE DOCUMENTO
// ============================================

/**
 * @swagger
 * /api/tipos-documento:
 *   get:
 *     summary: Listar tipos de documento
 *     tags: [Tipos de Documento]
 *     parameters:
 *       - in: query
 *         name: ativo
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista de tipos
 */
router.get('/tipos-documento', tipoDocumentoController.listar);
router.get('/tipos-documento/:id', tipoDocumentoController.obterPorId);
router.post('/tipos-documento', adminMiddleware, tipoDocumentoController.criar);
router.put('/tipos-documento/:id', adminMiddleware, tipoDocumentoController.atualizar);
router.delete('/tipos-documento/:id', adminMiddleware, tipoDocumentoController.deletar);

// ============================================
// DOCUMENTOS
// ============================================

/**
 * @swagger
 * /api/documentos:
 *   get:
 *     summary: Listar documentos (Admin)
 *     tags: [Documentos]
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
 *         name: voluntarioId
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, APROVADO, REJEITADO]
 *     responses:
 *       200:
 *         description: Lista de documentos
 */
router.get('/documentos', adminMiddleware, documentoController.listar);
router.get('/documentos/:id', authMiddleware, documentoController.obterPorId);

/**
 * @swagger
 * /api/voluntarios/{voluntarioId}/documentos:
 *   get:
 *     summary: Listar documentos de um voluntário
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de documentos
 */
router.get('/voluntarios/:voluntarioId/documentos', authMiddleware, documentoController.listarPorVoluntario);

/**
 * @swagger
 * /api/documentos:
 *   post:
 *     summary: Enviar documento
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voluntarioId, tipoDocumentoId, caminhoArquivo, nomeArquivo]
 *             properties:
 *               voluntarioId:
 *                 type: integer
 *               tipoDocumentoId:
 *                 type: integer
 *               caminhoArquivo:
 *                 type: string
 *               nomeArquivo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Documento criado
 */
router.post('/documentos', authMiddleware, documentoController.criar);

/**
 * @swagger
 * /api/documentos/{id}/status:
 *   patch:
 *     summary: Atualizar status de validação (Admin)
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [statusValidacao]
 *             properties:
 *               statusValidacao:
 *                 type: string
 *                 enum: [PENDENTE, APROVADO, REJEITADO]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch('/documentos/:id/status', adminMiddleware, documentoController.atualizarStatus);
router.delete('/documentos/:id', adminMiddleware, documentoController.deletar);

module.exports = router;
