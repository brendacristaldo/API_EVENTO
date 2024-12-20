const Guest = require('../models/Guest');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');

class GuestController {
  async create(req, res) {
    const { name, phone, eventId } = req.body;
    const userId = req.user.id;

    const event = Event.findById(Number(eventId));

    if (!event) {
      throw new AppError('Evento não encontrado', 404);
    }

    if (event.userId !== userId) {
      throw new AppError('Você não tem permissão para adicionar convidados a este evento', 403);
    }

    const guest = Guest.create({
      name,
      phone,
      eventId: Number(eventId)
    });

    return res.status(201).json({
      message: 'Convidado adicionado com sucesso',
      guest
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const guestData = req.body;

    const guest = Guest.findById(Number(id));

    if (!guest) {
      throw new AppError('Convidado não encontrado', 404);
    }

    const event = Event.findById(guest.eventId);

    if (event.userId !== userId) {
      throw new AppError('Você não tem permissão para atualizar este convidado', 403);
    }

    const updatedGuest = Guest.update(Number(id), guestData);

    return res.json({
      message: 'Convidado atualizado com sucesso',
      guest: updatedGuest
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const guest = Guest.findById(Number(id));

    if (!guest) {
      throw new AppError('Convidado não encontrado', 404);
    }

    const event = Event.findById(guest.eventId);

    if (event.userId !== userId) {
      throw new AppError('Você não tem permissão para excluir este convidado', 403);
    }

    Guest.delete(Number(id));

    return res.json({ message: 'Convidado excluído com sucesso' });
  }

  async show(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const guest = Guest.findById(Number(id));

    if (!guest) {
      throw new AppError('Convidado não encontrado', 404);
    }

    const event = Event.findById(guest.eventId);

    if (event.userId !== userId) {
      throw new AppError('Você não tem permissão para visualizar este convidado', 403);
    }

    return res.json({ guest });
  }

  async index(req, res) {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = Event.findById(Number(eventId));

    if (!event) {
      throw new AppError('Evento não encontrado', 404);
    }

    if (event.userId !== userId) {
      throw new AppError('Você não tem permissão para visualizar os convidados deste evento', 403);
    }

    const guests = Guest.findByEvent(Number(eventId));

    return res.json({ guests });
  }
}

module.exports = new GuestController();