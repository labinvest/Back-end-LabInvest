const express = require('express');
const ServicoController = require('../controllers/servicoController');

const router = express.Router(); 

router.post('/servicos', (req, res) => ServicoController.criarServico(req, res));
router.get('/servicos', (req, res) => ServicoController.listarServicos(req, res));
router.get('/servicos/:id', (req, res) => ServicoController.obterPorId(req, res));
router.put('/servicos/:id', (req, res) => ServicoController.atualizarServico(req, res));
router.delete('/servicos/:id', (req, res) => ServicoController.excluirServico(req, res));

module.exports = router;

