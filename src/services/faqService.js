const faqs = [
  {
    id: 1,
    pergunta: 'Como me inscrevo?',
    resposta: 'Você pode se inscrever clicando no botão de cadastro no topo da página e seguindo os passos.',
  },
  {
    id: 2,
    pergunta: 'Qual o prazo para resposta?',
    resposta: 'Normalmente respondemos em até 48 horas úteis.',
  },
  {
    id: 3,
    pergunta: 'Posso alterar meus dados depois de enviado?',
    resposta: 'Sim, entre em contato com o suporte e solicite a alteração dos seus dados.',
  },
  {
    id: 4,
    pergunta: 'Como funciona a consultoria?',
    resposta: 'A consultoria começa com uma avaliação detalhada da sua situação financeira, seguida pela elaboração de um plano personalizado.',
  },
  {
    id: 5,
    pergunta: 'As consultas são presenciais ou online?',
    resposta: 'Oferecemos somente atendimento online, para que você possa ser atendido de qualquer lugar.',
  },
  {
    id: 6,
    pergunta: 'Como me tornar um voluntário?',
    resposta: 'Basta acessar a página de cadastro de voluntários, preencher seus dados e aguardar a aprovação da equipe.',
  },
];

class FaqService {
  listar() {
    return faqs;
  }

  obterPorId(id) {
    const faq = faqs.find((f) => f.id === parseInt(id));
    if (!faq) throw new Error('FAQ não encontrada');
    return faq;
  }
}

module.exports = new FaqService();
