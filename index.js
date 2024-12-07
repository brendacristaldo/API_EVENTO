const express = require ('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

EventosRotas = require('./routes/rotas')
app.use('/admin', EventosRotas)

app.listen(3000, () => {
    console.log('Rodando na porta 3000')
})