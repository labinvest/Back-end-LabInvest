const agendamentoService = require('../services/agendamentoService');

class AgendamentoController {

    async criarAgendamento(req, res) {
        try {
            const { userId, data } = req.body;

            if (!userId || !data) {
                return res.status(400).json({ erro: 'userId e data sao obrigatorios' });
            }

            const agendamento = await agendamentoService.criarAgendamento({ userId, data });
            res.status(201).json(agendamento);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao criar agendamento', detalhe: error.message });
        }

    }

    async listarAgendamentos(req, res) {
        try {
            const agendamentos = await agendamentoService.listarAgendamentos();
            res.json(agendamentos);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao listar agendamento', detalhe: error.message });
        }
    }

    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const agendamento = await agendamentoService.lerAgendamento(id);
            if (!agendamento) {
                return res.status(404).json({ erro: 'Agendamento nao encontrado' });
            }
            res.json(agendamento);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao ler agendamento', detalhe: error.message });
        }
    }

    async atualizarAgendamento(req, res) {
        try {
            const { id } = req.params;
            const { userId, data } = req.body;

            const agendamento = await agendamentoService.atualizarAgendamento(id, { userId, data });
            res.json(agendamento);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao atualizar agendamento', detalhe: error.message });
        }
    }

    async excluirAgendamento(req, res) {
        try {
            const { id } = req.params;
            await agendamentoService.excluirAgendamento(id);
            res.json({ mensagem: 'Agendamento excluido com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao excluir agendamento', detalhe: error.message });
        }
    }

}

module.exports = new AgendamentoController();