const prisma = require('../lib/prisma');


class AgendamentoService {
        
//Criar Agendamento
    async criarAgendamento(data) {
        return prisma.agendamento.create({ data });
    }

//Listar Agendamento
    async listarAgendamento() {
        return prisma.agendamento.findMany({
            orderBy: { id: 'asc' },
        });
    }

//Ler Agendamento
    async lerAgendamento(id) {
        return prisma.agendamento.findUnique({ 
            where: { id: parseInt(id) },
            include: { user: true },
        });
    }

//Atualizar Agendamento
    async atualizarAgendamento(id, data) {
        return prisma.agendamento.update({
            where: { id: parseInt(id) },
            data,
        });
    }

//Excluir Agendamento
    async excluirAgendamento(id) {
        return prisma.agendamento.delete({
            where: { id: parseInt(id) },
        });
    }

}

module.exports = new AgendamentoService();