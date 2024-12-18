const fs = require('fs').promises;
const path = require('path');

const ARQUIVO_USUARIOS = path.resolve(__dirname, 'usuarios.json');

// Banco de dados simulado
let usuarios = [];

const obterUsuarios = async () => {
  try {
    // Tenta ler do arquivo se existir
    const dadosArquivo = await fs.readFile(ARQUIVO_USUARIOS, 'utf8');
    usuarios = JSON.parse(dadosArquivo);
    return usuarios;
  } catch (erro) {
    // Se arquivo não existe, ent retorna array vazio
    if (erro.code === 'ENOENT') {
      return [];
    }
    throw erro;
  }
};

const definirUsuarios = async (novosUsuarios) => {
  try {
    usuarios = novosUsuarios;
    await fs.writeFile(ARQUIVO_USUARIOS, JSON.stringify(usuarios, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar usuários:', erro);
    throw erro;
  }
};

module.exports = {
  usuarios,
  obterUsuarios,
  definirUsuarios
};