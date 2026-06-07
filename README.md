# Projeto Integrador: LabInvest - Plataforma de Agendamento de Serviços

> Solução backend end-to-end para gerenciamento de agendamentos de serviços especializados, conectando clientes com especialistas através de uma plataforma moderna e segura.

---

## Visão Geral

Este projeto implementa o backend de uma plataforma de agendamento de serviços especializados, desenvolvida como projeto integrador com foco em boas práticas de engenharia de software, arquitetura escalável e tecnologias modernas de desenvolvimento.

A solução abrange todo o ciclo de desenvolvimento: desde o levantamento de requisitos até a implementação, testes e disponibilização da aplicação, utilizando uma arquitetura robusta com Node.js, Prisma ORM e PostgreSQL.

---

## Problema de Negócio

### Contexto
A demanda por serviços especializados (consultoria, mentoria, assessoria, etc.) cresceu significativamente, mas faltam plataformas que integrem eficientemente:
- Agendamento de consultas
- Gestão de disponibilidade de especialistas
- Processamento de pagamentos
- Avaliações e reputação

### Desafio
Profissionais independentes e pequenas empresas enfrentam dificuldades para:
- Gerenciar agendamentos manualmente
- Manter controle de disponibilidade
- Processar pagamentos de forma segura
- Receber feedback estruturado de clientes
- Escalar seus negócios

### Impacto
A solução beneficia:
- **Especialistas**: Automação de agendamentos, gestão de disponibilidade e reputação
- **Clientes**: Fácil acesso a profissionais qualificados, segurança nas transações
- **Negócio**: Incremento de receita, redução de custos operacionais

---

## Solução Proposta

### Tipo de Sistema
API REST backend para plataforma de agendamento de serviços

### Principais Funcionalidades
-  **Autenticação e Autorização**: Sistema seguro com JWT e diferentes papéis (Cliente, Especialista, Admin)
-  **Gerenciamento de Usuários**: Cadastro, perfis, dados pessoais
-  **Catálogo de Serviços**: Registro e gerenciamento de serviços oferecidos
-  **Agendamento Inteligente**: Criar, confirmar, cancelar e consultar agendamentos
-  **Disponibilidade**: Gestão de horários disponíveis por especialista
-  **Avaliações e Reputação**: Sistema de classificação e comentários
-  **Processamento de Pagamentos**: Suporte para múltiplos métodos (cartão, PIX, boleto)
-  **Notificações**: Alertas em tempo real sobre agendamentos e eventos
-  **Auditoria**: Logs detalhados de todas as operações


### Tecnologias e Arquitetura

**Stack Tecnológico:**
- **Runtime**: Node.js com Express.js
- **ORM**: Prisma com PostgreSQL Adapter
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (jsonwebtoken)
- **Segurança**: bcryptjs para hash de senhas
- **CORS**: Suporte completo para múltiplos domínios
- **Documentação**: Swagger/OpenAPI
- **Infraestrutura**: Docker-ready, deploy em cloud

**Arquitetura em Camadas:**
```
Usuário → API REST (Express) → Services → Prisma ORM → PostgreSQL
```

**Padrão MVC Adaptado:**
- Controllers: Lógica de requisição/resposta
- Services: Regras de negócio
- Routes: Definição de endpoints
- Middleware: Autenticação, validações, logging

---

## Arquitetura da Solução

### Fluxo de Dados

```
Cliente Web/Mobile
        ↓
   API REST (Express)
   - Auth Routes
   - Agendamento Routes
   - Serviço Routes
   - Admin Routes
   - Notificação Routes
        ↓
   Middleware Layer
   - JWT Auth
   - Admin Verification
   - Error Handling
        ↓
   Business Logic Layer (Services)
   - Auth Service
   - Agendamento Service
   - Serviço Service
   - Admin Service
        ↓
   Prisma ORM
        ↓
   PostgreSQL Database
```

### Modelos Principais de Dados

```
User (Usuários do sistema)
├── role: cliente, especialista, admin
├── autenticação e autorização
└── relacionamentos com agendamentos, postagens, etc.

Especialista
├── Formação, experiência, avaliação média
├── Disponibilidade (horários)
└── Serviços oferecidos

Serviço
├── Nome, descrição, preço
├── Duração (em minutos)
└── Especialistas que o oferecem

Agendamento
├── Cliente, Especialista, Serviço
├── Data/hora, status, duração
├── Pagamento relacionado
└── Histórico de mudanças

Pagamento
├── Método (cartão, PIX, boleto)
├── Status (pendente, pago, cancelado)
└── Rastreamento

Avaliação
├── Cliente avalia Especialista
├── Classificação (1-5 estrelas)
└── Comentários e feedback útil
```

---

## Documentação do Projeto

- **Confluence**: [Link do Confluence](#https://jose3roberto2.atlassian.net/wiki/spaces/LI/pages/590012/Proposta+Inicial+-+Lab+Invest)
- **Jira**: [Link do Jira](#https://jose3roberto2.atlassian.net/jira/software/projects/LAB/summary)
- **Requisitos**: [Documento de Requisitos](#)
- **API Documentation**: `http://localhost:3000/api-docs/#/` (Swagger UI)

---

## Sprints

| Nº Sprint | Objetivo | Data Início | Data Término |
|-----------|----------|------------|--------------|
| Sprint 1 | Autenticação, autorização e models de usuário | 01/04/2026 | 15/04/2026 |
| Sprint 2 | Gestão de serviços, categorias e especialistas | 16/04/2026 | 30/04/2026 |
| Sprint 3 | Agendamentos, disponibilidade e confirmações | 01/05/2026 | 15/05/2026 |
| Sprint 4 | Pagamentos e notificações | 16/05/2026 | 30/05/2026 |
| Sprint 5 | Avaliações e auditoria | 01/06/2026 | 15/06/2026 |
| Sprint 6 | Testes, otimização e deploy | 16/06/2026 | 30/06/2026 |

---

## Tecnologias Utilizadas

### Backend
- **Linguagem**: JavaScript (Node.js)
- **Framework**: Express.js 4.22.1
- **ORM**: Prisma 7.8.0
- **Banco de Dados**: PostgreSQL com pg 8.11.0
- **Autenticação**: JWT (jsonwebtoken 9.0.0)
- **Criptografia**: bcryptjs 2.4.3
- **CORS**: cors 2.8.5
- **Documentação API**: Swagger 6.2.8 + Swagger UI 5.0.1

### Desenvolvimento
- **Versionamento**: Git/GitHub
- **Gerenciamento**: Jira
- **Containerização**: Docker

### Infraestrutura
- **Runtime**: Node.js
- **Variáveis de Ambiente**: dotenv 16.0.3
- **Monitoramento**: Logs estruturados

---

## Funcionalidades

### Autenticação e Autorização
- Registro de novos usuários com verificação de email
- Login seguro com JWT
- Refresh tokens
- Diferentes papéis: Cliente, Especialista, Admin
- Middleware de autenticação

### Gerenciamento de Usuários
- Perfil de usuário (dados pessoais, foto, bio)
- Atualização de informações
- Desativação de conta
- Histórico de atividades

### Catálogo de Serviços
- Cadastro de serviços (nome, descrição, preço, duração)
- Categorização de serviços
- Vinculação de especialistas aos serviços
- Busca e filtros

### Agendamento de Serviços
- Criar novo agendamento
- Consultar disponibilidade do especialista
- Confirmar/cancelar agendamentos
- Historiar mudanças de status
- Lembretes automáticos

### Disponibilidade de Especialistas
- Definir horários disponíveis por dia da semana
- Intervalo configurável entre agendamentos
- Ativação/desativação de horários

### Pagamentos
- Suporte a múltiplos métodos (cartão, PIX, boleto)
- Rastreamento de status de pagamento
- Integração com gateways de pagamento
- Comprovantes e recibos

### Avaliações e Reputação
- Classificação do especialista (1-5 estrelas)
- Comentários e feedback
- Cálculo automático de média de avaliações
- Sistema de voto útil em comentários

### Notificações
- Alertas de novos agendamentos
- Confirmações de pagamento
- Lembretes de consultas
- Mensagens do sistema

### Auditoria e Compliance
- Log de todas as operações (CRUD)
- Rastreamento de IP e User-Agent
- Histórico de autenticação
- Conformidade com LGPD

---

## Resultados Esperados

 **Resolução do Problema de Negócio**
- Plataforma funcional e testada para agendamento de serviços

 **Melhoria na Eficiência**
- Redução de 80% no tempo de agendamento manual
- Automação de confirmações e lembretes
- Gestão centralizada de disponibilidade

 **Experiência do Usuário Aprimorada**
- Interface intuitiva para clientes e especialistas
- Segurança nas transações de pagamento
- Comunicação clara e frequente via notificações

 **Base Escalável para Evolução**
- Arquitetura preparada para crescimento
- Fácil adição de novos recursos
- Performance otimizada para volume de dados

---

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** v16 ou superior
- **npm** ou **yarn**
- **PostgreSQL** 12 ou superior
- **Git**

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/labinvest_db"

# Servidor
PORT=3000
NODE_ENV=development

# Autenticação
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Email (opcional para notificações)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# Pagamento (configurar com provider real)
PAYMENT_API_KEY=sua_chave_api_pagamento
```

### Instalação

#### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/back-end-labinvest.git
cd back-end-labinvest
```

#### 2. Instalar dependências
```bash
npm install
```

#### 3. Configurar banco de dados

Gerar prisma client:
```bash
npx prisma generate
```

Executar migrations:
```bash
npx prisma migrate dev --name init
```

Visualizar dados (Prisma Studio):
```bash
npx prisma studio
```

#### 4. Iniciar o servidor

**Modo desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

### Health Check

Verificar se o servidor está rodando:
```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "mensagem": "Servidor está rodando"
}
```

### Documentação da API

Acessar Swagger UI em: `http://localhost:3000/api/docs`

---

## Estrutura do Projeto

```
back-end-labinvest/
├── src/
│   ├── controllers/          # Controladores de requisição/resposta
│   │   ├── authController.js
│   │   ├── agendamentoController.js
│   │   ├── servicoController.js
│   │   ├── adminController.js
│   │   └── ...
│   ├── services/             # Lógica de negócio
│   │   ├── authService.js
│   │   ├── agendamentoService.js
│   │   ├── servicoService.js
│   │   └── ...
│   ├── routes/               # Definição de rotas
│   │   ├── authRoutes.js
│   │   ├── agendamentoRoutes.js
│   │   └── ...
│   ├── middleware/           # Middlewares customizados
│   │   ├── auth.js
│   │   └── admin.js
│   ├── lib/                  # Utilitários e configurações
│   │   └── prisma.js
│   ├── generated/            # Código gerado pelo Prisma
│   └── app.js               # Configuração Express
├── prisma/
│   ├── schema.prisma        # Definição do modelo de dados
│   └── migrations/          # Histórico de migrations
├── package.json
├── server.js                # Entry point
├── .env                     # Variáveis de ambiente
└── README.md
```

---

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh` - Renovar token

### Serviços
- `GET /api/servicos` - Listar serviços
- `POST /api/servicos` - Criar serviço (Admin)
- `PUT /api/servicos/:id` - Atualizar serviço (Admin)
- `DELETE /api/servicos/:id` - Deletar serviço (Admin)

### Agendamentos
- `GET /api/agendamentos` - Listar agendamentos
- `POST /api/agendamentos` - Criar agendamento
- `GET /api/agendamentos/:id` - Detalhes do agendamento
- `PUT /api/agendamentos/:id` - Atualizar agendamento
- `DELETE /api/agendamentos/:id` - Cancelar agendamento

### Admin
- `GET /api/admin/usuarios` - Listar usuários
- `GET /api/admin/agendamentos` - Relatório de agendamentos
- `GET /api/admin/pagamentos` - Relatório de pagamentos

---

## Contribuindo

1. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abrir um Pull Request

---

## Troubleshooting

### Erro de conexão com banco de dados
```bash
# Verificar se PostgreSQL está rodando
# Verificar DATABASE_URL no .env
# Re-executar prisma migrations
npx prisma migrate dev
```

### Prisma Client não encontrado
```bash
# Regenerar cliente Prisma
npx prisma generate
```

### Porta 3000 já em uso
```bash
# Usar outra porta
PORT=3001 npm run dev
```




## Autores

- **Desenvolvido em**: 2026
- **Instituição**: Fatec Votorantim
- **Membros**: José Roberto, Gustavo Lima, Henrique Vidoto, Guilher Oto, Claudio Willian
- **Status**: Em Desenvolvimento

---

**Última atualização**: Maio de 2026
