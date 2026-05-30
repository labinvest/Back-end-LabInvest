const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload de imagem para postagem
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 url:
 *                   type: string
 */
router.post('/upload', authMiddleware, upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ sucesso: false, erro: 'Nenhum arquivo enviado' });
  }

  const url = `/uploads/postagens/${req.file.filename}`;
  res.status(201).json({ sucesso: true, url });
});

module.exports = router;
