let ids = 0
let eventos = []

module.exports = {
  criarEvento(id, nome, data, endereco) {
    let novoEvento = { id: ++ids, nome: nome, data: data, endereco: endereco, n_participantes: n_participantes };
    eventos.push(novoEvento)
    return novoEvento
  },

  lerNomeEvento(nome) {
    let lista = []
    for (let i = 0; i < eventos.length; i++) {
      if (eventos[i].nome.toUpperCase().startsWith(nome.toUpperCase())) {
        lista.push(eventos[i])
      }
    }
    return lista
  },

  lerTipoEvento(tipo) {
    let lista = []
    for (let i = 0; i < eventos.length; i++) {
      if (eventos[i].tipo == tipo) {
        lista.push(eventos[i])
      }
    }
    return lista
  },

  lerTodosEventos() {
    return eventos;
  },

  atualizarEvento(id, nome, tipo, data, endereco) {
    let posicao = this.lerPosicaoPorId(id);
    if (posicao >= 0) {
      let novoEvento = { id: id, nome: nome, tipo: tipo, data: data, endereco: endereco, n_participantes: n_participantes };
      eventos[posicao] = novoEvento;
    }
    return novoEvento[posicao];
  },

  lerPosicaoPorId(id) {
    for (let i = 0; i < eventos.length; i++) {
      if (eventos[i].id == id) {
        return i;
      }
    }
    return -1;
  },

  deletarEvento(id) {
    let i = this.lerPosicaoPorId(id);
    if (i >= 0) {
      eventos.splice(i, 1);
      return true;
    }
    return false;
  },

}







const bodyParser = require("body-parser");
const express = require("express");
const app = express();

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