const express = require('express');
//const dotenv = require('dotenv');
const loginRota = require('./routes/loginRota');
const perfilRota = require('./routes/perfilRota');
const usuarioExcluirRota = require('./routes/usuarioExcluirRota');

//dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar rotas
app.use('/api', loginRota);
app.use('/api', perfilRota);
app.use('/api', usuarioExcluirRota);

app.listen(3000, () => {
    console.log('Rodando na porta 3000')
})