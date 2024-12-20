const { Router } = require('express');
const UserController = require('controllers/UserController.js');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const userRoutes = Router();

/**
 * @swagger
 * /users/install:
 *   get:
 *     summary: Cria o usuário administrador padrão
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 */
userRoutes.get('/install', UserController.install);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autenticar usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
userRoutes.post('/login', UserController.login);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar novo usuário comum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
userRoutes.post('/register', UserController.create);

userRoutes.use(authMiddleware);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar novo usuário (apenas admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
userRoutes.post('/', adminMiddleware, UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário (apenas admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
userRoutes.put('/:id', adminMiddleware, UserController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Excluir usuário (apenas admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 */
userRoutes.delete('/:id', adminMiddleware, UserController.delete);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID (apenas admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
userRoutes.get('/:id', adminMiddleware, UserController.show);

module.exports = userRoutes;