const postService = require('../services/postService');

class PostController {
    async criarPost(req, res) {
        try {
            const post = await postService.criarPost(req.body);
            res.status(201).json(post);
        }
        catch (error) {
            res.status(500).json({ erro: 'Erro ao criar post', detalhe: error.message });
        }
    }
    async listarPosts(req, res) {
        try {
            const posts = await postService.listarPosts();
            res.json(posts);
        }
        catch (error) {
            res.status(500).json({ erro: 'Erro ao listar posts', detalhe: error.message });
        }
    }
    async deletarPost(req, res) {
        try {
            const { id } = req.params;
            await postService.deletarPost(id);
            res.json({ mensagem: 'Post deletado com sucesso' });
        }
        catch (error) {
            res.status(500).json({ erro: 'Erro ao deletar post', detalhe: error.message });
        }
    }
    async atualizarPost(req, res) {
        try {
            const { id } = req.params;
            const { titulo, conteudo } = req.body;
            const post = await postService.atualizarPost(id, { titulo, conteudo });
            res.json(post);
        }
        catch (error) {
            res.status(500).json({ erro: 'Erro ao atualizar post', detalhe: error.message });
        }
    }
    async lerPost(req, res) {
        try {
            const { id } = req.params;
            const post = await postService.lerPost(id);
            if (!post) {
                return res.status(404).json({ erro: 'Post não encontrado' });
            }
            res.json(post);
        }
        catch (error) {
            res.status(500).json({ erro: 'Erro ao ler post', detalhe: error.message });
        }
    }
}

module.exports = new PostController();
