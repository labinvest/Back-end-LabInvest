const prisma = require('../lib/prisma');


class AgendamentoService {
        
    async criarAgendamento(data) {
        return prisma.agendamento.create({ data });
    }

    async listarAgendamentos() {
        return prisma.agendamento.findMany({
            orderBy: { id: 'asc' },
        });
    }

    async lerAgendamento(id) {
        return prisma.agendamento.findUnique({ 
            where: { id: parseInt(id) },
            include: { user: true },
        });
    }

    async atualizarAgendamento(id, data) {
        return prisma.agendamento.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    async excluirAgendamento(id) {
        return prisma.agendamento.delete({
            where: { id: parseInt(id) },
        });
    }

}

module.exports = new AgendamentoService();