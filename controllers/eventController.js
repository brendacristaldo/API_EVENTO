import { CustomError } from '../utils/customError.js';

export const eventController = {
  // Criar novo evento
  createEvent: async (req, res, next) => {
    try {
      const { nome, data, endereco } = req.body;
      
      const events = await readData('events');
      
      const newEvent = {
        id: Date.now().toString(),
        nome,
        data,
        endereco,
        createdBy: req.user.id
      };

      events.push(newEvent);
      await writeData('events', events);
      
      res.status(201).json(newEvent);
    } catch (error) {
      next(error);
    }
  },

  // Get todos os eventos
  getAllEvents: async (req, res, next) => {
    try {
      const events = await readData('events');
      res.json(events);
    } catch (error) {
      next(error);
    }
  },

  // Get evento por ID
  getEventById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const events = await readData('events');
      const event = events.find(e => e.id === id);

      if (!event) {
        throw new CustomError('Evento não encontrado', 404);
      }

      res.json(event);
    } catch (error) {
      next(error);
    }
  },

  // Update evento
  updateEvent: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nome, data, endereco } = req.body;
      
      const events = await readData('events');
      const eventIndex = events.findIndex(e => e.id === id);

      if (eventIndex === -1) {
        throw new CustomError('Evento não encontrado', 404);
      }

      // Verificar se o usuário é admin ou criador do evento
      if (!req.user.isAdmin && events[eventIndex].createdBy !== req.user.id) {
        throw new CustomError('Não autorizado', 403);
      }

      events[eventIndex] = {
        ...events[eventIndex],
        nome: nome || events[eventIndex].nome,
        data: data || events[eventIndex].data,
        endereco: endereco || events[eventIndex].endereco
      };

      await writeData('events', events);
      res.json(events[eventIndex]);
    } catch (error) {
      next(error);
    }
  },

  // Deletar o evento
  deleteEvent: async (req, res, next) => {
    try {
      const { id } = req.params;
      const events = await readData('events');
      const event = events.find(e => e.id === id);

      if (!event) {
        throw new CustomError('Evento não encontrado', 404);
      }

      // Verificar se o usuário é admin ou criador do evento
      if (!req.user.isAdmin && event.createdBy !== req.user.id) {
        throw new CustomError('Não autorizado', 403);
      }

      const updatedEvents = events.filter(e => e.id !== id);
      await writeData('events', updatedEvents);

      res.json({ message: 'Evento excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};