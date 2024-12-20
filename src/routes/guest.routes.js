const { Router } = require('express');
const GuestController = require('../controllers/GuestController');
const { authMiddleware } = require('../middlewares/auth');

const guestRoutes = Router();

guestRoutes.use(authMiddleware);

/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Adicionar novo convidado
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
 *               phone:
 *                 type: string
 *               eventId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Convidado adicionado com sucesso
 */
guestRoutes.post('/', GuestController.create);

/**
 * @swagger
 * /guests/{id}:
 *   put:
 *     summary: Atualizar convidado
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
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Convidado atualizado com sucesso
 */
guestRoutes.put('/:id', GuestController.update);

/**
 * @swagger
 * /guests/{id}:
 *   delete:
 *     summary: Excluir convidado
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
 *         description: Convidado excluído com sucesso
 */
guestRoutes.delete('/:id', GuestController.delete);

/**
 * @swagger
 * /guests/{id}:
 *   get:
 *     summary: Buscar convidado por ID
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
 *         description: Convidado encontrado
 */
guestRoutes.get('/:id', GuestController.show);

/**
 * @swagger
 * /guests/event/{eventId}:
 *   get:
 *     summary: Listar todos os convidados de um evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de convidados
 */
guestRoutes.get('/event/:eventId', GuestController.index);

module.exports = guestRoutes;