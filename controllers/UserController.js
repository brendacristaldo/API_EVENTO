const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

class UserController {
  async install(req, res) {
    const adminExists = User.findByUsername('admin');
    
    if (adminExists) {
      throw new AppError('Administrador já foi instalado', 400);
    }

    const hashedPassword = await bcrypt.hash('admin123', 8);
    
    const admin = User.create({
      name: 'Administrador',
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });

    return res.status(201).json({
      message: 'Administrador criado com sucesso',
      admin: { ...admin, password: undefined }
    });
  }

  async create(req, res) {
    const { name, username, password, role, phone, birthDate } = req.body;

    if (User.findByUsername(username)) {
      throw new AppError('Nome de usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = User.create({
      name,
      username,
      password: hashedPassword,
      role: role || 'common',
      phone,
      birthDate
    });

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { ...user, password: undefined }
    });
  }

  async login(req, res) {
    const { username, password } = req.body;

    const user = User.findByUsername(username);

    if (!user) {
      throw new AppError('Usuário ou senha inválidos', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Usuário ou senha inválidos', 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      user: { ...user, password: undefined },
      token
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const userData = req.body;

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 8);
    }

    const user = User.update(Number(id), userData);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return res.json({
      message: 'Usuário atualizado com sucesso',
      user: { ...user, password: undefined }
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deleted = User.delete(Number(id));

    if (!deleted) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return res.json({ message: 'Usuário excluído com sucesso' });
  }

  async show(req, res) {
    const { id } = req.params;

    const user = User.findById(Number(id));

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return res.json({ user: { ...user, password: undefined } });
  }
}

module.exports = new UserController();
