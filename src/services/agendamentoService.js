const prisma = require('../lib/prisma');

// Função auxiliar para remover dados sensíveis do usuário
function removerDadosSensiveis(usuario) {
    if (!usuario) return null;
    const { senha, ...usuarioSeguro } = usuario;
    return usuarioSeguro;
}

// Função auxiliar para remover campos nulos do objeto
function removerNulos(obj) {
    if (!obj) return null;
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null)
    );
}

// Função auxiliar para limpar resposta de agendamento
function limparAgendamento(agendamento) {
    if (!agendamento) return null;
    const agendamentoLimpo = {
        ...agendamento,
        user: removerDadosSensiveis(agendamento.user),
        especialista: removerDadosSensiveis(agendamento.especialista),
        servico: agendamento.servico
    };
    return removerNulos(agendamentoLimpo);
}

class AgendamentoService {
        
    async criarAgendamento(agendamentoData) {
        // Se não tiver 'data', usar 'dataInicio' como fallback
        const dadosProcessados = {
            ...agendamentoData,
            data: agendamentoData.data || agendamentoData.dataInicio || new Date()
        };

        const agendamento = await prisma.agendamento.create({ 
            data: dadosProcessados,
            include: {
                user: true,
                especialista: true,
                servico: true
            }
        });

        return limparAgendamento(agendamento);
    }

    async listarAgendamentos() {
        const agendamentos = await prisma.agendamento.findMany({
            include: {
                user: true,
                especialista: true,
                servico: true
            },
            orderBy: { id: 'asc' },
        });

        return agendamentos.map(agendamento => limparAgendamento(agendamento));
    }

    async lerAgendamento(id) {
        const agendamento = await prisma.agendamento.findUnique({ 
            where: { id: parseInt(id) },
            include: { 
                user: true,
                especialista: true,
                servico: true
            }
        });

        return limparAgendamento(agendamento);
    }

    async atualizarAgendamento(id, agendamentoData) {
        const agendamento = await prisma.agendamento.update({
            where: { id: parseInt(id) },
            data: agendamentoData,
            include: {
                user: true,
                especialista: true,
                servico: true
            }
        });

        return limparAgendamento(agendamento);
    }

    async excluirAgendamento(id) {
        return prisma.agendamento.delete({
            where: { id: parseInt(id) },
        });
    }

}

module.exports = new AgendamentoService();