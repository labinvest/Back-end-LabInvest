const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

router.post('/agendamentos', agendamentoController.criarAgendamento.bind(agendamentoController));
router.get('/agendamentos', agendamentoController.listarAgendamentos.bind(agendamentoController));
router.get('/agendamentos/:id', agendamentoController.obterPorId.bind(agendamentoController));
router.put('/agendamentos/:id', agendamentoController.atualizarAgendamento.bind(agendamentoController));
router.delete('/agendamentos/:id', agendamentoController.excluirAgendamento.bind(agendamentoController));

module.exports = router;