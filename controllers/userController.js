import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/customError.js';

export const userController = {
  // Criar um novo usuário
  criarUsuario: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, usuario, senha } = req.body;
      
      const usuarios = await readData('users');
      
      if (usuarios.some(u => u.usuario === usuario)) {
        throw new CustomError('Usuário já existe', 400);
      }
      
      const senhaHasheada = await bcrypt.hash(senha, 10);
      
      const novoUsuario = {
        id: Date.now().toString(),
        nome,
        telefone,
        dataNascimento,
        usuario,
        senha: senhaHasheada,
        isAdmin: false
      };
      
      usuarios.push(novoUsuario);
      await writeData('users', usuarios);
      
      const { senha: _, ...usuarioSemSenha } = novoUsuario;
      res.status(201).json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Logar o usuário
  login: async (req, res, next) => {
    try {
      const { usuario: nomeUsuario, senha } = req.body;
      
      const usuarios = await readData('users');
      const usuarioEncontrado = usuarios.find(u => u.usuario === nomeUsuario);
      
      if (!usuarioEncontrado || !(await bcrypt.compare(senha, usuarioEncontrado.senha))) {
        throw new CustomError('Credenciais inválidas', 401);
      }
      
      const token = jwt.sign(
        { id: usuarioEncontrado.id, isAdmin: usuarioEncontrado.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
  
  // Obter perfil do usuário
  obterPerfil: async (req, res, next) => {
    try {
      const usuarios = await readData('users');
      const usuario = usuarios.find(u => u.id === req.user.id);
      
      if (!usuario) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      const { senha: _, ...usuarioSemSenha } = usuario;
      res.json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Atualizar perfil do usuário
  atualizarPerfil: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, senha } = req.body;
      
      const usuarios = await readData('users');
      const indiceUsuario = usuarios.findIndex(u => u.id === req.user.id);
      
      if (indiceUsuario === -1) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      const usuarioAtualizado = {
        ...usuarios[indiceUsuario],
        nome: nome || usuarios[indiceUsuario].nome,
        telefone: telefone || usuarios[indiceUsuario].telefone,
        dataNascimento: dataNascimento || usuarios[indiceUsuario].dataNascimento
      };
      
      if (senha) {
        usuarioAtualizado.senha = await bcrypt.hash(senha, 10);
      }
      
      usuarios[indiceUsuario] = usuarioAtualizado;
      await writeData('users', usuarios);
      
      const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
      res.json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Deletar conta do usuário
  deletarConta: async (req, res, next) => {
    try {
      const usuarios = await readData('users');
      const usuariosAtualizados = usuarios.filter(u => u.id !== req.user.id);
      
      if (usuarios.length === usuariosAtualizados.length) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      await writeData('users', usuariosAtualizados);
      res.json({ message: 'Conta excluída com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};