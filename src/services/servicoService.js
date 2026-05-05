const prisma = require('../lib/prisma');

class ServicoService {
    async criarServico(data) {
        return prisma.servico.create({
            data,
            select: {
                id: true,
                nome: true,
                descricao: true,
                preco: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async listarServicos() {
        return prisma.servico.findMany({
            orderBy: { id: 'asc' },
            select: {
                id: true,
                nome: true,
                descricao: true,
                preco: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async deletarServico(id) {
        return prisma.servico.delete({
            where: { id: parseInt(id, 10) },
        });
    }

    async atualizarServico(id, data) {
        return prisma.servico.update({
            where: { id: parseInt(id, 10) },
            data,
            select: {
                id: true,
                nome: true,
                descricao: true,
                preco: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async lerServico(id) {
        return prisma.servico.findUnique({
            where: { id: parseInt(id, 10) },
            select: {
                id: true,
                nome: true,
                descricao: true,
                preco: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

}

module.exports = new ServicoService();