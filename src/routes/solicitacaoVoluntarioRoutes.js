const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const solicitacaoVoluntarioController = require('../controllers/solicitacaoVoluntarioController');

const router = express.Router();

router.post('/solicitacoes-voluntario', authMiddleware, solicitacaoVoluntarioController.criar);
router.get('/solicitacoes-voluntario/minhas', authMiddleware, solicitacaoVoluntarioController.minhas);

router.get('/admin/solicitacoes-voluntario', adminMiddleware, solicitacaoVoluntarioController.listar);
router.patch('/admin/solicitacoes-voluntario/:id/aprovar', adminMiddleware, solicitacaoVoluntarioController.aprovar);
router.patch('/admin/solicitacoes-voluntario/:id/rejeitar', adminMiddleware, solicitacaoVoluntarioController.rejeitar);

module.exports = router;