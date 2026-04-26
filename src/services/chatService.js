const prisma = require('../lib/prisma');

class ChatService {
  async criarChat(data) {
    return prisma.chat.create({
      data,
      include: { user: true },
    });
  }

  async listarChats() {
    return prisma.chat.findMany({
      orderBy: { id: 'asc' },
      include: { user: true },
    });
  }

  async lerChat(id) {
    return prisma.chat.findUnique({
      where: { id: parseInt(id, 10) },
      include: { user: true },
    });
  }

  async atualizarChat(id, data) {
    return prisma.chat.update({
      where: { id: parseInt(id, 10) },
      data,
      include: { user: true },
    });
  }

  async excluirChat(id) {
    return prisma.chat.delete({
      where: { id: parseInt(id, 10) },
    });
  }
}

module.exports = new ChatService();