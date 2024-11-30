const express = require ('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");

//// Função para criar um usuário administrador por padrão
const criarUsuarioAdmin = () => {
    
}

//middleware para processar json no corpo da requisição
app.use(bodyParser.json());

// Rota de cadastro de usuário
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    // Validação simples dos dados recebidos
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Simulando o cadastro de um usuário (poderia ser inserido em um banco de dados)
    const novoUsuario = {
        id: Date.now(), // Gera um ID único baseado no timestamp
        nome,
        email,
        senha // Em produção, nunca armazene senhas sem antes criptografá-las!
    };

    console.log('Usuário cadastrado:', novoUsuario);

    // Retorna a confirmação do cadastro
    res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        usuario: novoUsuario
    });
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})