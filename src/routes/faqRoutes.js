const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: Perguntas frequentes
 */

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Listar perguntas frequentes
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: Lista de FAQs
 */
router.get('/faqs', faqController.listar);

/**
 * @swagger
 * /api/faqs/{id}:
 *   get:
 *     summary: Obter FAQ por ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: FAQ encontrada
 */
router.get('/faqs/:id', faqController.obterPorId);

module.exports = router;
