const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não fornecido', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    throw new AppError('Token inválido', 401);
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    throw new AppError('Acesso negado. Apenas administradores podem acessar este recurso.', 403);
  }
  return next();
}

module.exports = { authMiddleware, adminMiddleware };