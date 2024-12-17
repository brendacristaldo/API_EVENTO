import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/customError.js';

export const userController = {
  // Criar um novo usuario
  createUser: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, usuario, senha } = req.body;
      
      const users = await readData('users');
      
      if (users.some(u => u.usuario === usuario)) {
        throw new CustomError('Usuário já existe', 400);
      }

      const hashedPassword = await bcrypt.hash(senha, 10);
      
      const newUser = {
        id: Date.now().toString(),
        nome,
        telefone,
        dataNascimento,
        usuario,
        senha: hashedPassword,
        isAdmin: false
      };

      users.push(newUser);
      await writeData('users', users);
      
      const { senha: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },

  // Logar o usuario
  login: async (req, res, next) => {
    try {
      const { usuario, senha } = req.body;
      
      const users = await readData('users');
      const user = users.find(u => u.usuario === usuario);

      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        throw new CustomError('Credenciais inválidas', 401);
      }

      const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      next(error);
    }
  },

  // Get usuario 
  getProfile: async (req, res, next) => {
    try {
      const users = await readData('users');
      const user = users.find(u => u.id === req.user.id);
      
      if (!user) {
        throw new CustomError('Usuário não encontrado', 404);
      }

      const { senha: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },

  // Update usuario
  updateProfile: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, senha } = req.body;
      
      const users = await readData('users');
      const userIndex = users.findIndex(u => u.id === req.user.id);

      if (userIndex === -1) {
        throw new CustomError('Usuário não encontrado', 404);
      }

      const updatedUser = {
        ...users[userIndex],
        nome: nome || users[userIndex].nome,
        telefone: telefone || users[userIndex].telefone,
        dataNascimento: dataNascimento || users[userIndex].dataNascimento
      };

      if (senha) {
        updatedUser.senha = await bcrypt.hash(senha, 10);
      }

      users[userIndex] = updatedUser;
      await writeData('users', users);

      const { senha: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },

  // Deletar usuario
  deleteAccount: async (req, res, next) => {
    try {
      const users = await readData('users');
      const updatedUsers = users.filter(u => u.id !== req.user.id);
      
      if (users.length === updatedUsers.length) {
        throw new CustomError('Usuário não encontrado', 404);
      }

      await writeData('users', updatedUsers);
      res.json({ message: 'Conta excluída com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};