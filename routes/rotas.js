const express = require('express')
const router = express.Router()
const app = express()

module.exports = router

//ROTA para criar um novo admin
app.post('/admin/criar-admin', (req, res) => {
    const { nome, telefone, dataNascimento, usuario, senha } = req.body;
  
    // Valide os dados de entrada
    if (!nome || !usuario || !senha || !telefone || !dataNascimento) {
      return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' });
    }
  
    // Crie o novo administrador
    const novoAdmin = criarUsuarioAdmin({
      nome,
      telefone,
      dataNascimento,
      usuario,
      senha
    });
  
    // Retorne uma resposta de sucesso
    res.json({ mensagem: 'Administrador criado com sucesso'});
  });

  //ROTA para criar um usuário
  app.post('/admin/criar-usuario', (req, res) => {
    const { nome, telefone, dataNascimento, usuario, senha } = req.body;
  
    // Valide os dados de entrada
    if (!nome || !usuario || !senha || !telefone || !dataNascimento) {
      return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' });
    }
  
    // Crie o novo usuário
    const novoUsuario = criarUsuario({
      nome,
      telefone,
      dataNascimento,
      usuario,
      senha
    });
  
    // Retorne uma resposta de sucesso
    res.json({ mensagem: 'Usuário criado com sucesso'});
  });

  //ROTA para criar um evento
  app.post('/admin/criar-evento', (req, res) => {
    const { id, nome, data, endereco } = req.body;
  
    // Valide os dados de entrada
    if (!nome || !data || !endereco) {
      return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' });
    }
  
    // Crie o novo evento
    const novoEvento = criarEvento({
      id,
      nome,
      data,
      endereco
    });
  
    // Retorne uma resposta de sucesso
    res.json({ mensagem: 'Evento criado com sucesso'});
  });