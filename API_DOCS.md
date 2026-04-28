# 📚 Documentação da API - LabInvest Backend

## 🚀 Endpoints Disponíveis

### Base URL
```
http://localhost:3000/api
```

---

## 1️⃣ Health Check

### Verificar se o servidor está rodando
```
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "mensagem": "Servidor está rodando"
}
```

---

## 2️⃣ Usuários

### Listar Todos os Usuários
```
GET /users
```

### Criar Usuário
```
POST /users
```

#### Exemplo 1 - Cliente
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "telefone": "11999999999",
  "endereco": "Rua X, 123",
  "role": "cliente",
  "ativo": true
}
```

#### Exemplo 2 - Especialista
```json
{
  "nome": "Dra. Maria Santos",
  "email": "maria.santos@invest.com",
  "senha": "senhaForte@2026",
  "telefone": "21987654321",
  "endereco": "Av. Paulista, 1000 - São Paulo",
  "role": "especialista",
  "ativo": true
}
```

#### Exemplo 3 - Admin
```json
{
  "nome": "Admin Sistema",
  "email": "admin@labinvest.com",
  "senha": "admin@secure123",
  "telefone": "1133334444",
  "endereco": "São Paulo - SP",
  "role": "admin",
  "ativo": true
}
```

---

## 3️⃣ Agendamentos

### Listar Todos os Agendamentos
```
GET /agendamentos
```

### Obter Agendamento por ID
```
GET /agendamentos/:id
```

### Criar Agendamento
```
POST /agendamentos
```

#### Exemplo 1 - Agendamento Hoje
```json
{
  "userId": 1,
  "data": "2026-04-27T10:00:00Z"
}
```

#### Exemplo 2 - Agendamento Próxima Semana
```json
{
  "userId": 2,
  "data": "2026-05-03T15:30:00Z"
}
```

### Atualizar Agendamento
```
PUT /agendamentos/:id
```

### Deletar Agendamento
```
DELETE /agendamentos/:id
```

---

## 4️⃣ Chats

### Listar Todos os Chats
```
GET /chats
```

### Obter Chat por ID
```
GET /chats/:id
```

### Criar Chat
```
POST /chats
```

#### Exemplo 1
```json
{
  "userId": 1,
  "message": "Qual é o melhor investimento para iniciantes?"
}
```

#### Exemplo 2
```json
{
  "userId": 2,
  "message": "Gostaria de saber mais sobre fundos de investimento"
}
```

### Atualizar Chat
```
PUT /chats/:id
```

### Deletar Chat
```
DELETE /chats/:id
```

---

## 5️⃣ Serviços

### Listar Todos os Serviços
```
GET /servicos
```

### Obter Serviço por ID
```
GET /servicos/:id
```

### Criar Serviço
```
POST /servicos
```

#### Exemplo 1 - Análise de Portfolio
```json
{
  "nome": "Análise de Portfolio",
  "descricao": "Análise completa de sua carteira de investimentos",
  "preco": 499.99
}
```

#### Exemplo 2 - Planejamento Tributário
```json
{
  "nome": "Planejamento Tributário",
  "descricao": "Estratégias para otimizar impostos em investimentos",
  "preco": 350.00
}
```

#### Exemplo 3 - Consultoria 1-on-1
```json
{
  "nome": "Consultoria 1-on-1",
  "descricao": "Sessão personalizada com especialista em investimentos",
  "preco": 150.00
}
```

### Atualizar Serviço
```
PUT /servicos/:id
```

### Deletar Serviço
```
DELETE /servicos/:id
```

---

## 6️⃣ Postagens

### Listar Todas as Postagens
```
GET /posts
```

### Obter Postagem por ID
```
GET /posts/:id
```

### Criar Postagem
```
POST /posts
```

#### Exemplo 1 - Erros Comuns
```json
{
  "userId": 1,
  "titulo": "5 Erros Comuns em Investimentos",
  "conteudo": "Evite estes erros que podem prejudicar seus investimentos a longo prazo..."
}
```

#### Exemplo 2 - Diversificação
```json
{
  "userId": 2,
  "titulo": "Diversificação: A Chave do Sucesso",
  "conteudo": "Entenda por que diversificar sua carteira é essencial para reduzir riscos..."
}
```

#### Exemplo 3 - Mercado de Ações
```json
{
  "userId": 1,
  "titulo": "Mercado de Ações: Guia Completo",
  "conteudo": "Um guia passo a passo para começar a investir em ações no mercado brasileiro..."
}
```

### Atualizar Postagem
```
PUT /posts/:id
```

### Deletar Postagem
```
DELETE /posts/:id
```

---

