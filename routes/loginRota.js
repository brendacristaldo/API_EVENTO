const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { usuarios } = require('../dados/usuarios');

router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  const usuarioEncontrado = usuarios.find(u => u.usuario === usuario);
  if (!usuarioEncontrado) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

  const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);
  if (!senhaValida) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: usuarioEncontrado.id, ehAdmin: usuarioEncontrado.ehAdmin },
    process.env.JWT_SEGREDO || 'chave-secreta',
    { expiresIn: '24h' }
  );

  res.json({ token });
});

module.exports = router;