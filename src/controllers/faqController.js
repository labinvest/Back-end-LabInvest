const faqService = require('../services/faqService');

const faqController = {
  listar(req, res) {
    try {
      const faqs = faqService.listar();
      res.json({ sucesso: true, dados: faqs });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  obterPorId(req, res) {
    try {
      const faq = faqService.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: faq });
    } catch (error) {
      res.status(404).json({ sucesso: false, erro: error.message });
    }
  },
};

module.exports = faqController;
