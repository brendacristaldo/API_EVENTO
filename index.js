const express = require ('express')
const app = express()
const port = 3000

EventoRouter = require('./routes/rotas')

app.use('/rotas', EventoRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})