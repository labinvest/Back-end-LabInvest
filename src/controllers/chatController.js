const chatService = require('../services/chatService');

class ChatController {
  async criarChat(req, res) {
    try {
      const chat = await chatService.criarChat(req.body);
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar chat', detalhe: error.message });
    }
  }

  async listarChats(req, res) {
    try {
      const chats = await chatService.listarChats();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar chats', detalhe: error.message });
    }
  }

  async obterPorId(req, res) {
    try {
      const { id } = req.params;
      const chat = await chatService.lerChat(id);
      if (!chat) {
        return res.status(404).json({ erro: 'Chat não encontrado' });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao ler chat', detalhe: error.message });
    }
  }

  async atualizarChat(req, res) {
    try {
      const { id } = req.params;
      const { userId, message } = req.body;
      const chat = await chatService.atualizarChat(id, { userId, message });
      res.json(chat);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar chat', detalhe: error.message });
    }
  }

  async excluirChat(req, res) {
    try {
      const { id } = req.params;
      await chatService.excluirChat(id);
      res.json({ mensagem: 'Chat excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao excluir chat', detalhe: error.message });
    }
  }
}

module.exports = new ChatController();