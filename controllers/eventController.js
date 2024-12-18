import { CustomError } from '../utils/customError.js';

export const eventController = {
  // Criar novo evento
  criarEvento: async (req, res, next) => {
    try {
      const { nome, data, endereco } = req.body;
      
      const eventos = await readData('events');
      
      const novoEvento = {
        id: Date.now().toString(),
        nome,
        data,
        endereco,
        createdBy: req.user.id
      };
      
      eventos.push(novoEvento);
      await writeData('events', eventos);
      
      res.status(201).json(novoEvento);
    } catch (error) {
      next(error);
    }
  },
  
  // Obter todos os eventos
  obterTodosEventos: async (req, res, next) => {
    try {
      const eventos = await readData('events');
      res.json(eventos);
    } catch (error) {
      next(error);
    }
  },
  
  // Obter evento por ID
  obterEventoPorId: async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventos = await readData('events');
      const evento = eventos.find(e => e.id === id);
      
      if (!evento) {
        throw new CustomError('Evento não encontrado', 404);
      }
      
      res.json(evento);
    } catch (error) {
      next(error);
    }
  },
  
  // Atualizar evento
  atualizarEvento: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nome, data, endereco } = req.body;
      
      const eventos = await readData('events');
      const indiceEvento = eventos.findIndex(e => e.id === id);
      
      if (indiceEvento === -1) {
        throw new CustomError('Evento não encontrado', 404);
      }
      
      // Verificar se o usuário é admin ou criador do evento
      if (!req.user.isAdmin && eventos[indiceEvento].createdBy !== req.user.id) {
        throw new CustomError('Não autorizado', 403);
      }
      
      eventos[indiceEvento] = {
        ...eventos[indiceEvento],
        nome: nome || eventos[indiceEvento].nome,
        data: data || eventos[indiceEvento].data,
        endereco: endereco || eventos[indiceEvento].endereco
      };
      
      await writeData('events', eventos);
      res.json(eventos[indiceEvento]);
    } catch (error) {
      next(error);
    }
  },
  
  // Deletar o evento
  deletarEvento: async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventos = await readData('events');
      const evento = eventos.find(e => e.id === id);
      
      if (!evento) {
        throw new CustomError('Evento não encontrado', 404);
      }
      
      // Verificar se o usuário é admin ou criador do evento
      if (!req.user.isAdmin && evento.createdBy !== req.user.id) {
        throw new CustomError('Não autorizado', 403);
      }
      
      const eventosAtualizados = eventos.filter(e => e.id !== id);
      await writeData('events', eventosAtualizados);
      
      res.json({ message: 'Evento excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};