const prisma = require('../lib/prisma');

class PostService {
    async criarPost(data) {
        return prisma.postagem.create({
            data,
            include: { user: true },
        });
    }

    async listarPosts() {
        return prisma.postagem.findMany({
            orderBy: { id: 'asc' },
            include: { user: true },
        });
    }
    async deletarPost(id) {
        return prisma.postagem.delete({
            where: { id: parseInt(id, 10) },
        });
    }
    async atualizarPost(id, data) {
        return prisma.postagem.update({
            where: { id: parseInt(id, 10) },
            data,
            include: { user: true },
        });
    }
    async lerPost(id) {
        return prisma.postagem.findUnique({
            where: { id: parseInt(id, 10) },
            include: { user: true },
        });
    }
}

module.exports = new PostService();