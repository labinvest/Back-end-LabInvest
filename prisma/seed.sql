-- Senha de todos os usuários: senha123
-- Hash gerado com bcryptjs cost 10

INSERT INTO "User" (id, email, senha, role, ativo, "createdAt", "updatedAt") VALUES
  (1, 'admin@labinvest.com',           '$2a$10$KGsFEF6pAlZH8JX38v6UUeEliMiCH9HjpYBif9/3ivqHd9cGlRe3W', 'ADMIN',      true, NOW(), NOW()),
  (2, 'joao.silva@email.com',          '$2a$10$KGsFEF6pAlZH8JX38v6UUeEliMiCH9HjpYBif9/3ivqHd9cGlRe3W', 'CLIENTE',    true, NOW(), NOW()),
  (3, 'maria.oliveira@email.com',      '$2a$10$KGsFEF6pAlZH8JX38v6UUeEliMiCH9HjpYBif9/3ivqHd9cGlRe3W', 'CLIENTE',    true, NOW(), NOW()),
  (4, 'carlos.pereira@email.com',      '$2a$10$KGsFEF6pAlZH8JX38v6UUeEliMiCH9HjpYBif9/3ivqHd9cGlRe3W', 'CLIENTE',    true, NOW(), NOW()),
  (5, 'juliana.santos@voluntario.com', '$2a$10$KGsFEF6pAlZH8JX38v6UUeEliMiCH9HjpYBif9/3ivqHd9cGlRe3W', 'VOLUNTARIO', true, NOW(), NOW()),
  (6, 'marcos.costa@voluntario.com',   '$2a$10$KGsFEF6pAlZH8JX38v6UUeEliMiCH9HjpYBif9/3ivqHd9cGlRe3W', 'VOLUNTARIO', true, NOW(), NOW()),
  (7, 'fernanda.lima@voluntario.com',  '$2a$10$KGsFEF6pAlZH8JX38v6UUeEliMiCH9HjpYBif9/3ivqHd9cGlRe3W', 'VOLUNTARIO', true, NOW(), NOW());

INSERT INTO "Perfil" (id, "userId", nome, telefone, endereco, cpf, "createdAt", "updatedAt") VALUES
  (1, 1, 'Ana Admin',      '(11) 99999-0001', 'Rua A, 1 - Sao Paulo, SP',           '111.111.111-11', NOW(), NOW()),
  (2, 2, 'Joao Silva',     '(11) 98888-0002', 'Rua B, 2 - Sao Paulo, SP',           '222.222.222-22', NOW(), NOW()),
  (3, 3, 'Maria Oliveira', '(21) 97777-0003', 'Av. Atlantica, 3 - Rio de Janeiro, RJ', '333.333.333-33', NOW(), NOW()),
  (4, 4, 'Carlos Pereira', '(31) 96666-0004', 'Rua D, 4 - Belo Horizonte, MG',     '444.444.444-44', NOW(), NOW()),
  (5, 5, 'Juliana Santos', '(41) 95555-0005', 'Av. Batel, 5 - Curitiba, PR',        '555.555.555-55', NOW(), NOW()),
  (6, 6, 'Marcos Costa',   '(51) 94444-0006', 'Rua Garibaldi, 6 - Porto Alegre, RS','666.666.666-66', NOW(), NOW()),
  (7, 7, 'Fernanda Lima',  '(85) 93333-0007', 'Av. Beira Mar, 7 - Fortaleza, CE',  '777.777.777-77', NOW(), NOW());

INSERT INTO "Categoria" (id, nome, descricao, ativo, "createdAt", "updatedAt") VALUES
  (1, 'Investimentos',           'Orientacao sobre renda variavel, renda fixa e fundos', true, NOW(), NOW()),
  (2, 'Planejamento Financeiro', 'Controle de orcamento, metas e reserva de emergencia',  true, NOW(), NOW()),
  (3, 'Controle de Dividas',     'Estrategias de renegociacao e quitacao de dividas',      true, NOW(), NOW()),
  (4, 'Educacao Financeira',     'Conceitos e boas praticas financeiras para o cotidiano', true, NOW(), NOW()),
  (5, 'Aposentadoria',           'Planejamento previdenciario, PGBL, VGBL e longo prazo',  true, NOW(), NOW());

INSERT INTO "Voluntario" (id, "perfilId", "categoriaId", formacao, bio, experiencia, "avaliacaoMedia", ativo, "createdAt", "updatedAt") VALUES
  (1, 5, 1, 'Especialista em Investimentos (CEA - ANBIMA)',
    'Profissional certificada com 8 anos de experiencia em mercado financeiro e assessoria de investimentos.',
    8, 4.8, true, NOW(), NOW()),
  (2, 6, 2, 'Consultor de Financas Pessoais (CFP)',
    'Consultor com foco em planejamento financeiro familiar e controle de orcamento domestico.',
    6, 4.6, true, NOW(), NOW()),
  (3, 7, 4, 'Educadora Financeira (Mestre em Economia)',
    'Professora universitaria com 10 anos de experiencia em workshops comunitarios sobre financas pessoais.',
    10, 4.9, true, NOW(), NOW());

INSERT INTO "Servico" (id, nome, descricao, preco, duracao, ativo, "createdAt", "updatedAt") VALUES
  (1, 'Consultoria em Investimentos',    'Analise do perfil de investidor e orientacao sobre carteira diversificada.',          0, 60,  true, NOW(), NOW()),
  (2, 'Planejamento de Orcamento',       'Criacao de planilha de controle financeiro e metas mensais e anuais.',                0, 60,  true, NOW(), NOW()),
  (3, 'Analise e Quitacao de Dividas',   'Diagnostico financeiro e estrategia de renegociacao de dividas.',                    0, 90,  true, NOW(), NOW()),
  (4, 'Educacao Financeira Basica',      'Sessao introdutoria sobre juros, investimentos e habitos financeiros saudaveis.',     0, 45,  true, NOW(), NOW()),
  (5, 'Planejamento para Aposentadoria', 'Orientacao sobre previdencia privada, PGBL vs VGBL e metas de longo prazo.',         0, 120, true, NOW(), NOW());

INSERT INTO "VoluntarioServico" (id, "voluntarioId", "servicoId", "createdAt", "updatedAt") VALUES
  (1, 1, 1, NOW(), NOW()),
  (2, 1, 5, NOW(), NOW()),
  (3, 2, 2, NOW(), NOW()),
  (4, 2, 3, NOW(), NOW()),
  (5, 3, 4, NOW(), NOW()),
  (6, 3, 2, NOW(), NOW());

-- diaSemana: 0=Dom 1=Seg 2=Ter 3=Qua 4=Qui 5=Sex 6=Sab
INSERT INTO "Disponibilidade" (id, "voluntarioId", "diaSemana", "horaInicio", "horaFim", "intervaloMinutos", ativo, "createdAt", "updatedAt") VALUES
  (1, 1, 1, '08:00', '12:00', 60, true, NOW(), NOW()),
  (2, 1, 3, '14:00', '18:00', 60, true, NOW(), NOW()),
  (3, 2, 2, '09:00', '13:00', 60, true, NOW(), NOW()),
  (4, 2, 4, '14:00', '17:00', 60, true, NOW(), NOW()),
  (5, 3, 5, '08:00', '12:00', 60, true, NOW(), NOW()),
  (6, 3, 6, '09:00', '12:00', 60, true, NOW(), NOW());

-- clientePerfilId e voluntarioPerfilId referenciam Perfil.id
INSERT INTO "Agendamento" (id, "clientePerfilId", "voluntarioPerfilId", "servicoId", titulo, descricao, "dataInicio", "dataFim", status, local, notas, "createdAt", "updatedAt") VALUES
  (1, 2, 5, 1,
    'Consultoria Inicial de Investimentos',
    'Primeira consulta para analise do perfil de investidor do Joao.',
    '2026-06-10 09:00:00', '2026-06-10 10:00:00',
    'AGENDADO', 'Online - Google Meet', 'Trazer extrato bancario e lista de ativos atuais',
    NOW(), NOW()),
  (2, 3, 6, 2,
    'Planejamento de Orcamento Familiar',
    'Sessao de criacao de planilha orcamentaria para a Maria.',
    '2026-06-12 10:00:00', '2026-06-12 11:00:00',
    'CONFIRMADO', 'Online - Zoom', NULL,
    NOW(), NOW()),
  (3, 4, 5, 5,
    'Orientacao sobre Previdencia Privada',
    'Sessao de planejamento previdenciario para o Carlos.',
    '2026-05-20 14:00:00', '2026-05-20 16:00:00',
    'REALIZADO', 'Online - Google Meet', 'Cliente optou por VGBL.',
    NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

INSERT INTO "AgendamentoServico" (id, "agendamentoId", "servicoId", "createdAt", "updatedAt") VALUES
  (1, 1, 1, NOW(), NOW()),
  (2, 2, 2, NOW(), NOW()),
  (3, 3, 5, NOW(), NOW());

INSERT INTO "Avaliacao" (id, "perfilId", "voluntarioId", "agendamentoId", classificacao, comentario, "createdAt", "updatedAt") VALUES
  (1, 4, 1, 3, 5,
    'Juliana explicou as opcoes de PGBL e VGBL com muita clareza. Sai da sessao sabendo o que fazer.',
    NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  (2, 3, 2, NULL, 4,
    'Marcos e muito atencioso e conhece bem o assunto de planejamento financeiro. Recomendo!',
    NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  (3, 2, 3, NULL, 5,
    'Fernanda tem um jeito incrivel de ensinar. Aprendi mais em 45 minutos do que em anos sozinho.',
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

UPDATE "Voluntario" SET "avaliacaoMedia" = 5.0 WHERE id = 1;
UPDATE "Voluntario" SET "avaliacaoMedia" = 4.0 WHERE id = 2;
UPDATE "Voluntario" SET "avaliacaoMedia" = 5.0 WHERE id = 3;

INSERT INTO "Postagem" (id, "voluntarioId", titulo, conteudo, "createdAt", "updatedAt") VALUES
  (1, 1,
    'Como comecar a investir com pouco dinheiro?',
    'Muitas pessoas acreditam que precisam de muito dinheiro para comecar a investir, mas isso e um mito. Com R$ 100 ja e possivel dar os primeiros passos no Tesouro Direto ou em fundos de renda fixa. O importante e comecar e ser consistente. Nessa consultoria voluntaria atendi o Joao, que tinha esse mesmo pensamento, e ao final da sessao ele ja sabia exatamente por onde comecar sua jornada financeira.',
    NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
  (2, 2,
    'A planilha que mudou minha relacao com o dinheiro',
    'Durante minha trajetoria como voluntario, percebi que a maioria das pessoas nunca teve contato com uma planilha de orcamento. Criei um modelo simples que ajudou dezenas de familias a enxergarem para onde vai seu dinheiro todo mes. Em 3 meses, uma das clientes quitou duas dividas e formou uma reserva de emergencia de R$ 2.000.',
    NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
  (3, 3,
    'Educacao financeira nas comunidades: relato de uma acao voluntaria',
    'No ultimo mes participei de uma roda de conversa no bairro Jardim Europa com 30 moradores. Falamos sobre orcamento domestico, crédito rotativo e reserva de emergencia. Foi emocionante ver o engajamento. Essa e a essencia do voluntariado financeiro: transformar vidas por meio do conhecimento.',
    NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days');

INSERT INTO "Notificacao" (id, "perfilId", titulo, mensagem, tipo, lido, "createdAt", "updatedAt") VALUES
  (1, 2, 'Agendamento confirmado',
    'Sua consultoria de investimentos com Juliana Santos esta agendada para 10/06/2026 as 09h.',
    'AGENDAMENTO', false, NOW(), NOW()),
  (2, 3, 'Agendamento confirmado',
    'Sua sessao de planejamento de orcamento com Marcos Costa esta confirmada para 12/06/2026.',
    'AGENDAMENTO', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  (3, 4, 'Avalie sua sessao',
    'Sua sessao sobre previdencia privada foi concluida. Que tal deixar uma avaliacao?',
    'AVALIACAO', true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  (4, 5, 'Nova avaliacao recebida',
    'O cliente Carlos Pereira avaliou sua sessao com nota 5 estrelas. Parabens!',
    'AVALIACAO', false, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  (5, 1, 'Nova solicitacao de voluntario',
    'Joao Silva enviou uma solicitacao para tornar-se voluntario. Acesse o painel admin.',
    'SISTEMA', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

INSERT INTO "TipoDocumento" (id, nome, obrigatorio, ativo, "createdAt", "updatedAt") VALUES
  (1, 'CPF',                      true,  true, NOW(), NOW()),
  (2, 'Diploma ou Certificado',    true,  true, NOW(), NOW()),
  (3, 'Certificacao Profissional', false, true, NOW(), NOW()),
  (4, 'Comprovante de Residencia', false, true, NOW(), NOW());

INSERT INTO "Documento" (id, "voluntarioId", "tipoDocumentoId", "caminhoArquivo", "nomeArquivo", "statusValidacao", "createdAt", "updatedAt") VALUES
  (1, 1, 1, '/uploads/voluntarios/1/cpf.pdf',         'cpf_juliana.pdf',        'APROVADO', NOW(), NOW()),
  (2, 1, 2, '/uploads/voluntarios/1/diploma.pdf',     'diploma_juliana.pdf',    'APROVADO', NOW(), NOW()),
  (3, 1, 3, '/uploads/voluntarios/1/cea.pdf',         'cea_anbima_juliana.pdf', 'APROVADO', NOW(), NOW()),
  (4, 2, 1, '/uploads/voluntarios/2/cpf.pdf',         'cpf_marcos.pdf',         'APROVADO', NOW(), NOW()),
  (5, 2, 3, '/uploads/voluntarios/2/cfp.pdf',         'cfp_marcos.pdf',         'PENDENTE', NOW(), NOW()),
  (6, 3, 1, '/uploads/voluntarios/3/cpf.pdf',         'cpf_fernanda.pdf',       'APROVADO', NOW(), NOW()),
  (7, 3, 2, '/uploads/voluntarios/3/diploma.pdf',     'mestrado_fernanda.pdf',  'APROVADO', NOW(), NOW());

INSERT INTO "SolicitacaoVoluntario" (id, "perfilId", "categoriaId", formacao, bio, experiencia, documentos, status, "createdAt", "updatedAt") VALUES
  (1, 2, 3,
    'Advogado especialista em Direito do Consumidor',
    'Tenho experiencia ajudando pessoas a negociar dividas. Quero contribuir como voluntario na area de controle de dividas.',
    5,
    '{"enviados": ["cpf.pdf", "oab_registro.pdf"]}',
    'PENDENTE',
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

INSERT INTO "AuditoriaLog" (id, "perfilId", acao, tabela, dados, "createdAt") VALUES
  (1, 1, 'CREATE', 'Voluntario',  '{"voluntarioId": 1, "perfilId": 5}',         NOW() - INTERVAL '30 days'),
  (2, 1, 'CREATE', 'Voluntario',  '{"voluntarioId": 2, "perfilId": 6}',         NOW() - INTERVAL '25 days'),
  (3, 1, 'CREATE', 'Voluntario',  '{"voluntarioId": 3, "perfilId": 7}',         NOW() - INTERVAL '20 days'),
  (4, 1, 'UPDATE', 'Agendamento', '{"agendamentoId": 3, "status": "REALIZADO"}',NOW() - INTERVAL '10 days'),
  (5, 1, 'CREATE', 'Categoria',   '{"categoriaId": 5, "nome": "Aposentadoria"}',NOW() - INTERVAL '60 days');

INSERT INTO "Contato" (id, nome, email, mensagem, lido, "createdAt") VALUES
  (1, 'Pedro Alves',    'pedro.alves@email.com',    'Gostaria de saber como agendar uma consultoria. Sou autonomo e nunca investi antes.', false, NOW() - INTERVAL '1 day'),
  (2, 'Lucia Ferreira', 'lucia.ferreira@email.com', 'Tenho dividas acumuladas e nao sei por onde comecar. Os atendimentos sao gratuitos?', true,  NOW() - INTERVAL '3 days'),
  (3, 'Ricardo Souza',  'ricardo.souza@email.com',  'Quero ser voluntario. Sou economista com 12 anos de experiencia. Qual o processo?',  false, NOW() - INTERVAL '2 days');

-- Resetar sequences
SELECT setval(pg_get_serial_sequence('"User"',                  'id'), (SELECT MAX(id) FROM "User"));
SELECT setval(pg_get_serial_sequence('"Perfil"',                'id'), (SELECT MAX(id) FROM "Perfil"));
SELECT setval(pg_get_serial_sequence('"Categoria"',             'id'), (SELECT MAX(id) FROM "Categoria"));
SELECT setval(pg_get_serial_sequence('"Voluntario"',            'id'), (SELECT MAX(id) FROM "Voluntario"));
SELECT setval(pg_get_serial_sequence('"Servico"',               'id'), (SELECT MAX(id) FROM "Servico"));
SELECT setval(pg_get_serial_sequence('"VoluntarioServico"',     'id'), (SELECT MAX(id) FROM "VoluntarioServico"));
SELECT setval(pg_get_serial_sequence('"Disponibilidade"',       'id'), (SELECT MAX(id) FROM "Disponibilidade"));
SELECT setval(pg_get_serial_sequence('"Agendamento"',           'id'), (SELECT MAX(id) FROM "Agendamento"));
SELECT setval(pg_get_serial_sequence('"AgendamentoServico"',    'id'), (SELECT MAX(id) FROM "AgendamentoServico"));
SELECT setval(pg_get_serial_sequence('"Avaliacao"',             'id'), (SELECT MAX(id) FROM "Avaliacao"));
SELECT setval(pg_get_serial_sequence('"Postagem"',              'id'), (SELECT MAX(id) FROM "Postagem"));
SELECT setval(pg_get_serial_sequence('"Notificacao"',           'id'), (SELECT MAX(id) FROM "Notificacao"));
SELECT setval(pg_get_serial_sequence('"TipoDocumento"',         'id'), (SELECT MAX(id) FROM "TipoDocumento"));
SELECT setval(pg_get_serial_sequence('"Documento"',             'id'), (SELECT MAX(id) FROM "Documento"));
SELECT setval(pg_get_serial_sequence('"SolicitacaoVoluntario"', 'id'), (SELECT MAX(id) FROM "SolicitacaoVoluntario"));
SELECT setval(pg_get_serial_sequence('"AuditoriaLog"',          'id'), (SELECT MAX(id) FROM "AuditoriaLog"));
SELECT setval(pg_get_serial_sequence('"Contato"',               'id'), (SELECT MAX(id) FROM "Contato"));
