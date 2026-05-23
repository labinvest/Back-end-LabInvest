const postService = require('../services/postService');

class PostController {
  async criarPost(req, res) {
    try {
      const post = await postService.criarPost(req.body);
      res.status(201).json({ sucesso: true, dados: post });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  }

  async listarPosts(req, res) {
    try {
      const { page, limit, voluntarioId, search } = req.query;
      const resultado = await postService.listarPosts({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        voluntarioId,
        search,
      });
      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  async deletarPost(req, res) {
    try {
      const resultado = await postService.deletarPost(req.params.id);
      res.json({ sucesso: true, mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  }

  async atualizarPost(req, res) {
    try {
      const { titulo, conteudo } = req.body;
      const post = await postService.atualizarPost(req.params.id, { titulo, conteudo });
      res.json({ sucesso: true, dados: post });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  }

  async lerPost(req, res) {
    try {
      const post = await postService.lerPost(req.params.id);
      res.json({ sucesso: true, dados: post });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  }
}

module.exports = new PostController();
