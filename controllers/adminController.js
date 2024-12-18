import bcrypt from 'bcryptjs';
import { CustomError } from '../utils/customError.js';

export const adminController = {
  // Criar um novo administrador
  criarAdmin: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, usuario, senha } = req.body;
      
      const usuarios = await readData('users');
      
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
        isAdmin: true
      };
      
      usuarios.push(novoAdmin);
      await writeData('users', usuarios);
      
      const { senha: _, ...adminSemSenha } = novoAdmin;
      res.status(201).json(adminSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Obter todos os usuários
  obterTodosUsuarios: async (req, res, next) => {
    try {
      const usuarios = await readData('users');
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
      const usuarios = await readData('users');
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
      const { nome, telefone, dataNascimento, isAdmin } = req.body;
      
      const usuarios = await readData('users');
      const indiceUsuario = usuarios.findIndex(u => u.id === userId);
      
      if (indiceUsuario === -1) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      usuarios[indiceUsuario] = {
        ...usuarios[indiceUsuario],
        nome: nome || usuarios[indiceUsuario].nome,
        telefone: telefone || usuarios[indiceUsuario].telefone,
        dataNascimento: dataNascimento || usuarios[indiceUsuario].dataNascimento,
        isAdmin: isAdmin !== undefined ? isAdmin : usuarios[indiceUsuario].isAdmin
      };
      
      await writeData('users', usuarios);
      
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
      
      const usuarios = await readData('users');
      const usuarioParaDeletar = usuarios.find(u => u.id === userId);
      
      if (!usuarioParaDeletar) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      if (usuarioParaDeletar.isAdmin) {
        throw new CustomError('Não é possível excluir um administrador', 403);
      }
      
      const usuariosAtualizados = usuarios.filter(u => u.id !== userId);
      await writeData('users', usuariosAtualizados);
      
      res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};