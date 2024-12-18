const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/autenticacao');
const { usuarios } = require('../dados/usuarios');
const fs = require('fs').promises;
const path = require('path');

router.put('/perfil', verificarToken, async (req, res) => {
  try {
    const { nome, dataNascimento, telefone } = req.body;
    const idUsuario = req.usuario.id;

    const indiceUsuario = usuarios.findIndex(u => u.id === idUsuario);
    if (indiceUsuario === -1) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    // Verificação de permissão 
    const usuarioLogado = usuarios[indiceUsuario];
    const temPermissao = req.usuario.ehAdmin || usuarioLogado.id === idUsuario;
    
    if (!temPermissao) {
      return res.status(403).json({ mensagem: 'Não autorizado' });
    }

    // Atualização de campos
    usuarios[indiceUsuario] = {
      ...usuarios[indiceUsuario],
      nome: nome || usuarios[indiceUsuario].nome,
      dataNascimento: dataNascimento || usuarios[indiceUsuario].dataNascimento,
      telefone: telefone || usuarios[indiceUsuario].telefone
    };

    // Salvar usuários em arquivo
    await salvarUsuarios(usuarios);

    res.json({ 
      mensagem: 'Perfil atualizado com sucesso',
      usuario: {
        nome: usuarios[indiceUsuario].nome,
        dataNascimento: usuarios[indiceUsuario].dataNascimento,
        telefone: usuarios[indiceUsuario].telefone
      }
    });
  } catch (erro) {
    console.error('Erro ao atualizar perfil:', erro);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
});

// Função para salvar usuários
async function salvarUsuarios(usuarios) {
  try {
    const caminhoArquivo = path.resolve(__dirname, '../dados/usuarios.json');
    await fs.writeFile(caminhoArquivo, JSON.stringify(usuarios, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar usuários:', erro);
    throw new Error('Não foi possível salvar os usuários');
  }
}

module.exports = router;