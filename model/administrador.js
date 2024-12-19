let ids = 0
let administradores = []

module.exports = {
//FUNÇÃO para criar um usuário administrador por padrão
    criarAdminPadrao () {
        const adminPadrao = {
            id: counter,
            nome: 'Admin',
            usuario: 'admin',
            senha: 'admin',
            papel: 'admin'
        };
        administradores.push(adminPadrao); 
    },

//função para um admin criar outro admin
    criarAdmin(nome, usuario, senha) {
    let novoAdmin = { id: ++ids, nome: nome, usuario: usuario, senha: senha };
    administradores.push(novoAdmin)
    return novoAdmin
  },

  lerTodos() {
    return administradores;
  },

  //função para deletar um usuario nao administrador
  deletarUsuario(id) {
    let i = this.lerPosicaoPorId(id);
    if (i >= 0) {
      usuarios.splice(i, 1);
      return true;
    }
    return false;
  },

}