const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/autenticacao');
const { usuarios, definirUsuarios } = require('../dados/usuarios');

router.delete('/usuarios/:id', verificarToken, (req, res) => {
  if (!req.usuario.ehAdmin) {
    return res.status(403).json({ mensagem: 'Apenas administradores podem excluir usuários' });
  }

  const usuarioParaExcluir = usuarios.find(u => u.id === req.params.id);
  
  if (!usuarioParaExcluir) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  if (usuarioParaExcluir.ehAdmin) {
    return res.status(403).json({ mensagem: 'Não é possível excluir um administrador' });
  }

  const usuariosAtualizados = usuarios.filter(u => u.id !== req.params.id);
  definirUsuarios(usuariosAtualizados);
  
  res.json({ mensagem: 'Usuário excluído com sucesso' });
});

module.exports = router;