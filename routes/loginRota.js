const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { usuarios } = require('../dados/usuarios');
const crypto = require('crypto');

router.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Validação de entrada
    if (!usuario || !senha) {
      return res.status(400).json({ mensagem: 'Usuário e senha são obrigatórios' });
    }

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario);
    if (!usuarioEncontrado) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    // Geração de um token seguro
    const segredoToken = process.env.JWT_SEGREDO || crypto.randomBytes(64).toString('hex');
    const token = jwt.sign(
      { 
        id: usuarioEncontrado.id, 
        ehAdmin: usuarioEncontrado.ehAdmin 
      },
      segredoToken,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
});

module.exports = router;