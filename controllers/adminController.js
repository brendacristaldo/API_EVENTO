import bcrypt from 'bcryptjs';
import { CustomError } from '../utils/customError.js';

export const adminController = {
  // Criaar um novo admin
  createAdmin: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, usuario, senha } = req.body;
      
      const users = await readData('users');
      
      if (users.some(u => u.usuario === usuario)) {
        throw new CustomError('Usuário já existe', 400);
      }

      const hashedPassword = await bcrypt.hash(senha, 10);
      
      const newAdmin = {
        id: Date.now().toString(),
        nome,
        telefone,
        dataNascimento,
        usuario,
        senha: hashedPassword,
        isAdmin: true
      };

      users.push(newAdmin);
      await writeData('users', users);
      
      const { senha: _, ...adminWithoutPassword } = newAdmin;
      res.status(201).json(adminWithoutPassword);
    } catch (error) {
      next(error);
    }
  },

  // Get todos os usuarios
  getAllUsers: async (req, res, next) => {
    try {
      const users = await readData('users');
      const usersWithoutPasswords = users.map(user => {
        const { senha: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json(usersWithoutPasswords);
    } catch (error) {
      next(error);
    }
  },

  // Get usuario por ID
  getUserById: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const users = await readData('users');
      const user = users.find(u => u.id === userId);

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
  updateUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { nome, telefone, dataNascimento, isAdmin } = req.body;

      const users = await readData('users');
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        throw new CustomError('Usuário não encontrado', 404);
      }

      users[userIndex] = {
        ...users[userIndex],
        nome: nome || users[userIndex].nome,
        telefone: telefone || users[userIndex].telefone,
        dataNascimento: dataNascimento || users[userIndex].dataNascimento,
        isAdmin: isAdmin !== undefined ? isAdmin : users[userIndex].isAdmin
      };

      await writeData('users', users);

      const { senha: _, ...userWithoutPassword } = users[userIndex];
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },

  // Deletar usuario
  deleteUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      const users = await readData('users');
      const userToDelete = users.find(u => u.id === userId);

      if (!userToDelete) {
        throw new CustomError('Usuário não encontrado', 404);
      }

      if (userToDelete.isAdmin) {
        throw new CustomError('Não é possível excluir um administrador', 403);
      }

      const updatedUsers = users.filter(u => u.id !== userId);
      await writeData('users', updatedUsers);

      res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};