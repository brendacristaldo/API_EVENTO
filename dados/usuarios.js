// Banco de dados simulado
let usuarios = [];

const obterUsuarios = () => usuarios;
const definirUsuarios = (novosUsuarios) => {
  usuarios = novosUsuarios;
};

module.exports = {
  usuarios,
  obterUsuarios,
  definirUsuarios
};