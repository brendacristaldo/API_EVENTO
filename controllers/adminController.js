import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { CustomError } from '../utils/customError.js';

const ARQUIVO_USUARIOS = path.resolve(__dirname, '../dados/usuarios.json');

const readData = async () => {
  try {
    const dados = await fs.readFile(ARQUIVO_USUARIOS, 'utf8');
    return JSON.parse(dados);
  } catch (erro) {
    console.error('Erro ao ler dados:', erro);
    return [];
  }
};

const writeData = async (usuarios) => {
  try {
    await fs.writeFile(ARQUIVO_USUARIOS, JSON.stringify(usuarios, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar dados:', erro);
    throw new CustomError('Erro ao salvar dados', 500);
  }
};

export const adminController = {
  // Criar um novo administrador
  criarAdmin: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, usuario, senha } = req.body;
      
      // Validações de entrada
      if (!nome || !usuario || !senha) {
        throw new CustomError('Dados incompletos', 400);
      }
      
      const usuarios = await readData();
      
      if (usuarios.some(u => u.usuario === usuario)) {
        throw new CustomError('Usuário já existe', 400);
      }
      
      const senhaHasheada = await bcrypt.hash(senha, 10);
      
      const novoAdmin = {
        id: Date.now().toString(),
        nome,
        telefone,
        dataNascimento,
        usuario,
        senha: senhaHasheada,
        ehAdmin: true
      };
      
      usuarios.push(novoAdmin);
      await writeData(usuarios);
      
      const { senha: _, ...adminSemSenha } = novoAdmin;
      res.status(201).json(adminSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Obter todos os usuários
  obterTodosUsuarios: async (req, res, next) => {
    try {
      const usuarios = await readData();
      const usuariosSemSenhas = usuarios.map(usuario => {
        const { senha: _, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
      });
      
      res.json(usuariosSemSenhas);
    } catch (error) {
      next(error);
    }
  },
  
  // Obter usuário por ID
  obterUsuarioPorId: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const usuarios = await readData();
      const usuario = usuarios.find(u => u.id === userId);
      
      if (!usuario) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      const { senha: _, ...usuarioSemSenha } = usuario;
      res.json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Atualizar usuário
  atualizarUsuario: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { nome, telefone, dataNascimento, ehAdmin } = req.body;
      
      const usuarios = await readData();
      const indiceUsuario = usuarios.findIndex(u => u.id === userId);
      
      if (indiceUsuario === -1) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      // Impedir que não-admins mudem status de admin
      if (ehAdmin !== undefined && !req.usuario.ehAdmin) {
        throw new CustomError('Sem permissão para alterar status de admin', 403);
      }
      
      usuarios[indiceUsuario] = {
        ...usuarios[indiceUsuario],
        nome: nome || usuarios[indiceUsuario].nome,
        telefone: telefone || usuarios[indiceUsuario].telefone,
        dataNascimento: dataNascimento || usuarios[indiceUsuario].dataNascimento,
        ehAdmin: ehAdmin !== undefined ? ehAdmin : usuarios[indiceUsuario].ehAdmin
      };
      
      await writeData(usuarios);
      
      const { senha: _, ...usuarioSemSenha } = usuarios[indiceUsuario];
      res.json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Deletar usuário
  deletarUsuario: async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      const usuarios = await readData();
      const usuarioParaDeletar = usuarios.find(u => u.id === userId);
      
      if (!usuarioParaDeletar) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      // Impedir exclusão de si mesmo ou de outros admins
      if (usuarioParaDeletar.ehAdmin) {
        throw new CustomError('Não é possível excluir um administrador', 403);
      }
      
      const usuariosAtualizados = usuarios.filter(u => u.id !== userId);
      await writeData(usuariosAtualizados);
      
      res.json({ mensagem: 'Usuário excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};