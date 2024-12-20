const { Router } = require('express');
const EventController = require('../controllers/EventController');
const { authMiddleware } = require('../middlewares/auth');

const eventRoutes = Router();

eventRoutes.use(authMiddleware);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Criar novo evento
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
 *               date:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 */
eventRoutes.post('/', EventController.create);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualizar evento
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
 *               date:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 */
eventRoutes.put('/:id', EventController.update);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Excluir evento
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
 *         description: Evento excluído com sucesso
 */
eventRoutes.delete('/:id', EventController.delete);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Buscar evento por ID
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
 *         description: Evento encontrado
 */
eventRoutes.get('/:id', EventController.show);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Listar todos os eventos do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
eventRoutes.get('/', EventController.index);

/**
 * @swagger
 * /events/{id}/guests/count:
 *   get:
 *     summary: Retorna o número total de convidados de um evento
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
 *         description: Total de convidados do evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventId:
 *                   type: integer
 *                 totalGuests:
 *                   type: integer
 */
eventRoutes.get('/:id/guests/count', EventController.getGuestCount);

module.exports = eventRoutes;