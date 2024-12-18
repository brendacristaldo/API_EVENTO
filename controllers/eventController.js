import fs from 'fs/promises';
import path from 'path';
import { CustomError } from '../utils/customError.js';

const ARQUIVO_EVENTOS = path.resolve(__dirname, '../dados/eventos.json');

const readData = async () => {
  try {
    const dados = await fs.readFile(ARQUIVO_EVENTOS, 'utf8');
    return JSON.parse(dados);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      return [];
    }
    console.error('Erro ao ler eventos:', erro);
    throw new CustomError('Erro ao carregar eventos', 500);
  }
};

const writeData = async (eventos) => {
  try {
    await fs.writeFile(ARQUIVO_EVENTOS, JSON.stringify(eventos, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar eventos:', erro);
    throw new CustomError('Erro ao salvar eventos', 500);
  }
};

export const eventController = {
  // Criar novo evento
  criarEvento: async (req, res, next) => {
    try {
      const { nome, data, endereco } = req.body;
      
      // Validações de entrada
      if (!nome || !data || !endereco) {
        throw new CustomError('Dados do evento incompletos', 400);
      }
      
      const eventos = await readData();
      
      const novoEvento = {
        id: Date.now().toString(),
        nome,
        data,
        endereco,
        criadoPor: req.usuario.id
      };
      
      eventos.push(novoEvento);
      await writeData(eventos);
      
      res.status(201).json(novoEvento);
    } catch (error) {
      next(error);
    }
  },
  
  // Obter todos os eventos
  obterTodosEventos: async (req, res, next) => {
    try {
      const eventos = await readData();
      
      // Se não for admin, mostra apenas eventos do usuário
      if (!req.usuario.ehAdmin) {
        return res.json(eventos.filter(e => e.criadoPor === req.usuario.id));
      }
      
      res.json(eventos);
    } catch (error) {
      next(error);
    }
  },
  
  // Obter evento por ID
  obterEventoPorId: async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventos = await readData();
      const evento = eventos.find(e => e.id === id);
      
      if (!evento) {
        throw new CustomError('Evento não encontrado', 404);
      }
      
      // Verificar permissão
      if (!req.usuario.ehAdmin && evento.criadoPor !== req.usuario.id) {
        throw new CustomError('Não autorizado', 403);
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
      
      const eventos = await readData();
      const indiceEvento = eventos.findIndex(e => e.id === id);
      
      if (indiceEvento === -1) {
        throw new CustomError('Evento não encontrado', 404);
      }
      
      // Verificar se o usuário é admin ou criador do evento
      if (!req.usuario.ehAdmin && eventos[indiceEvento].criadoPor !== req.usuario.id) {
        throw new CustomError('Não autorizado', 403);
      }
      
      eventos[indiceEvento] = {
        ...eventos[indiceEvento],
        nome: nome || eventos[indiceEvento].nome,
        data: data || eventos[indiceEvento].data,
        endereco: endereco || eventos[indiceEvento].endereco
      };
      
      await writeData(eventos);
      res.json(eventos[indiceEvento]);
    } catch (error) {
      next(error);
    }
  },
  
  // Deletar o evento
  deletarEvento: async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventos = await readData();
      const evento = eventos.find(e => e.id === id);
      
      if (!evento) {
        throw new CustomError('Evento não encontrado', 404);
      }
      
      // Verificar se o usuário é admin ou criador do evento
      if (!req.usuario.ehAdmin && evento.criadoPor !== req.usuario.id) {
        throw new CustomError('Não autorizado', 403);
      }
      
      const eventosAtualizados = eventos.filter(e => e.id !== id);
      await writeData(eventosAtualizados);
      
      res.json({ mensagem: 'Evento excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};