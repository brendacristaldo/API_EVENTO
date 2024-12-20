# API de Gerenciamento de Eventos

## Descrição

Essa API é um sistema de gerenciamento de eventos desenvolvido em Node.js, utilizando o framework Express.js. Ela permite que usuários criem, editem e excluam eventos, além de gerenciar convidados e realizar autenticação e autorização.

## Funcionalidades
- Autenticação e autorização de usuários
- Gerenciamento de eventos (criação, edição, exclusão)
- Gerenciamento de convidados (criação, edição, exclusão)
- Sistema de permissões (admin/usuário)
- CRUD completo para usuários e eventos
- Persistência em arquivos JSON
- Tratamento de exceções personalizado

## Endpoints

### Usuários
- POST /users/login: Autenticar usuário
- GET /users/install: Criar usuário administrador padrão
GET /users/:id: Buscar usuário por ID
### Eventos
POST /events: Criar novo evento
GET /events: Listar todos os eventos do usuário
GET /events/:id: Buscar evento por ID
PUT /events/:id: Atualizar evento
DELETE /events/:id: Excluir evento
### Convidados
POST /guests: Adicionar novo convidado
GET /guests: Listar todos os convidados do evento
GET /guests/:id: Buscar convidado por ID
PUT /guests/:id: Atualizar convidado
DELETE /guests/:id: Excluir convidado

## Tecnologias Utilizadas

Node.js
Express.js
JSON
Swagger

## Instalação e Execução

Clone o repositório
Instale as dependências com npm install
Execute o servidor com npm start
Acesse a API em http://localhost:3000

## Documentação

A documentação da API está disponível em http://localhost:3000/docs após a execução do servidor.

## Integrantes:
<ul>
  <li>Brenda Beatriz Cristaldo</li>
  <li>Nathalia Myiuki</li>
</ul>
