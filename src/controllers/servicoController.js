const servicoService = require('../services/servicoService');

class ServicoController {
    async criarServico(req, res) {
        try {
            const { nome, descricao, preco } = req.body;
            if (!nome || !descricao || preco === undefined) {
                return res.status(400).json({ erro: 'nome, descricao e preco sao obrigatorios' });
            }

            const servico = await servicoService.criarServico({ nome, descricao, preco });
            res.status(201).json(servico);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao criar servico', detalhe: error.message });
        }

    }

    async listarServicos(req, res) {
        try {
            const servicos = await servicoService.listarServicos();
            res.json(servicos);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao listar servicos', detalhe: error.message });
        }
    }

    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const servico = await servicoService.lerServico(id);
            if (!servico) {
                return res.status(404).json({ erro: 'Servico nao encontrado' });
            }

            res.json(servico);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao ler servico', detalhe: error.message });
        }

    }

    async atualizarServico(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, preco } = req.body;

            const servico = await servicoService.atualizarServico(id, { nome, descricao, preco });
            res.json(servico);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao atualizar servico', detalhe: error.message });
        }
    }

    async excluirServico(req, res) {
        try {
            const { id } = req.params; 
            await servicoService.deletarServico(id);
            res.json({ mensagem: 'Servico excluido com sucesso' });
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao excluir servico', detalhe: error.message });
        }   
    }
}   

module.exports = new ServicoController();