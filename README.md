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

## Tecnologias Utilizadas
- Node.js
- Express.js
- JSON
- Swagger
- Dotenv

## Instalação e Execução
- Clone o repositório
- Instale as dependências com npm install
- Execute o servidor com npm run dev
- Use a rota http://localhost:3000/users/install para criar um administrador
- Faça o login na rota http://localhost:3000/users/login com o usuário e senha do aministrador (admin, admin123) padrão para gerar o token
- Use o token do administrador padrão para usar as rotas que só podem ser usadas por um administrador
- Cadastre um usuário comum na rota http://localhost:3000/users/register
- Faça login com o usuário e senha do usuário comum para gerar o token dele
- Use o token para usar as rotas que só podem ser usadas por um usuário comum e divirta-se!


## Documentação
A documentação da API está disponível em http://localhost:3000/docs após a execução do servidor.

## Integrantes:
<ul>
  <li>Brenda Beatriz Cristaldo</li>
  <li>Nathalia Myiuki</li>
</ul>
