const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/autenticacao');
const { usuarios } = require('../dados/usuarios');

router.put('/perfil', verificarToken, async (req, res) => {
  const { nome, dataNascimento, telefone } = req.body;
  const idUsuario = req.usuario.id;

  const indiceUsuario = usuarios.findIndex(u => u.id === idUsuario);
  if (indiceUsuario === -1) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  // Verifica se é admin ou atualizando próprio perfil
  if (!req.usuario.ehAdmin && usuarios[indiceUsuario].id !== idUsuario) {
    return res.status(403).json({ mensagem: 'Não autorizado' });
  }

  usuarios[indiceUsuario] = {
    ...usuarios[indiceUsuario],
    nome: nome || usuarios[indiceUsuario].nome,
    dataNascimento: dataNascimento || usuarios[indiceUsuario].dataNascimento,
    telefone: telefone || usuarios[indiceUsuario].telefone
  };

  res.json({ mensagem: 'Perfil atualizado com sucesso' });
});

module.exports = router;