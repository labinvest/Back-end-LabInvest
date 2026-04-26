const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/posts', (req, res) => postController.criarPost(req, res));
router.get('/posts', (req, res) => postController.listarPosts(req, res));
router.get('/posts/:id', (req, res) => postController.lerPost(req, res));
router.put('/posts/:id', (req, res) => postController.atualizarPost(req, res));
router.delete('/posts/:id', (req, res) => postController.deletarPost(req, res));

module.exports = router;