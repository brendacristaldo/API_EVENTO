const express = require('express')
const router = express.Router()

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