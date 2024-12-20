const Event = require('../models/Event');
const AppError = require('../utils/AppError');

class EventController {
  async create(req, res) {
    const { name, date, location, type } = req.body;
    const userId = req.user.id;

    const event = Event.create({
      name,
      date,
      location,
      type,
      userId
    });

    return res.status(201).json({
      message: 'Evento criado com sucesso',
      event
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const eventData = req.body;

    const event = Event.findById(Number(id));

    if (!event) {
      throw new AppError('Evento não encontrado', 404);
    }

    if (event.userId !== userId) {
      throw new AppError('Você não tem permissão para atualizar este evento', 403);
    }

    const updatedEvent = Event.update(Number(id), eventData);

    return res.json({
      message: 'Evento atualizado com sucesso',
      event: updatedEvent
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const event = Event.findById(Number(id));

    if (!event) {
      throw new AppError('Evento não encontrado', 404);
    }

    if (event.userId !== userId) {
      throw new AppError('Você não tem permissão para excluir este evento', 403);
    }

    Event.delete(Number(id));

    return res.json({ message: 'Evento excluído com sucesso' });
  }

  async show(req, res) {
    const { id } = req.params;

    const event = Event.findById(Number(id));

    if (!event) {
      throw new AppError('Evento não encontrado', 404);
    }

    return res.json({ event });
  }

  async index(req, res) {
    const userId = req.user.id;
    const events = Event.findAll().filter(event => event.userId === userId);

    return res.json({ events });
  }
}

module.exports = new EventController();