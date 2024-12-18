const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/autenticacao');
const { usuarios } = require('../dados/usuarios');
const fs = require('fs').promises;
const path = require('path');

router.delete('/usuarios/:id', verificarToken, async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (!req.usuario.ehAdmin) {
      return res.status(403).json({ mensagem: 'Apenas administradores podem excluir usuários' });
    }

    const { id } = req.params;

    const usuarioParaExcluir = usuarios.find(u => u.id === id);
    
    if (!usuarioParaExcluir) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    // Impedir exclusão de administradores
    if (usuarioParaExcluir.ehAdmin) {
      return res.status(403).json({ mensagem: 'Não é possível excluir um administrador' });
    }

    // Excluir usuário
    const usuariosAtualizados = usuarios.filter(u => u.id !== id);
    
    // Salvar usuários atualizado
    await salvarUsuarios(usuariosAtualizados);
    
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (erro) {
    console.error('Erro ao excluir usuário:', erro);
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