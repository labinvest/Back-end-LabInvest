const prisma = require('../lib/prisma');

class ServicoService {
    async criarServico(data) {
        return prisma.servico.create({
            data,
        });
    }

    async listarServicos() {
        return prisma.servico.findMany({
            orderBy: { id: 'asc' },
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
        });
    }

    async lerServico(id) {
        return prisma.servico.findUnique({
            where: { id: parseInt(id, 10) },
        });
    }

}

module.exports = new ServicoService();

