const express = require ('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");

//middleware para processar json no corpo da requisição
app.use(bodyParser.json());

//FUNÇÃO para criar um usuário administrador por padrão
const criarUsuarioAdmin = () => {
    const adminPadrão = {
        nome: 'Admin',
        telefone: '',
        dataNascimento: '',
        usuario: 'admin',
        senha: 'admin'
      };
}

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})