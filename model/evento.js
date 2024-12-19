let ids = 0
let eventos = []

module.exports = {

  criarEvento(id, nome, data, endereco) {
    let novoEvento = { id: ++ids, nome: nome, data: data, endereco: endereco, n_participantes: n_participantes };
    eventos.push(novoEvento)
    return novoEvento
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