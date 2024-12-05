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