const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chats', (req, res) => chatController.criarChat(req, res));
router.get('/chats', (req, res) => chatController.listarChats(req, res));
router.get('/chats/:id', (req, res) => chatController.obterPorId(req, res));
router.put('/chats/:id', (req, res) => chatController.atualizarChat(req, res));
router.delete('/chats/:id', (req, res) => chatController.excluirChat(req, res));

module.exports = router;