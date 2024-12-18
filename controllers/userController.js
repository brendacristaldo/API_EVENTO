import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { CustomError } from '../utils/customError.js';

const ARQUIVO_USUARIOS = path.resolve(__dirname, '../dados/usuarios.json');

const readData = async () => {
  try {
    const dados = await fs.readFile(ARQUIVO_USUARIOS, 'utf8');
    return JSON.parse(dados);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      return [];
    }
    console.error('Erro ao ler usuários:', erro);
    throw new CustomError('Erro ao carregar usuários', 500);
  }
};

const writeData = async (usuarios) => {
  try {
    await fs.writeFile(ARQUIVO_USUARIOS, JSON.stringify(usuarios, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar usuários:', erro);
    throw new CustomError('Erro ao salvar usuários', 500);
  }
};

export const userController = {
  // Criar um novo usuário
  criarUsuario: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, usuario, senha } = req.body;
      
      // Validações de entrada
      if (!nome || !usuario || !senha) {
        throw new CustomError('Dados incompletos', 400);
      }
      
      const usuarios = await readData();
      
      if (usuarios.some(u => u.usuario === usuario)) {
        throw new CustomError('Usuário já existe', 400);
      }
      
      const senhaHasheada = await bcrypt.hash(senha, 10);
      
      const novoUsuario = {
        id: Date.now().toString(),
        nome,
        telefone,
        dataNascimento,
        usuario,
        senha: senhaHasheada,
        ehAdmin: false
      };
      
      usuarios.push(novoUsuario);
      await writeData(usuarios);
      
      const { senha: _, ...usuarioSemSenha } = novoUsuario;
      res.status(201).json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Logar o usuário
  login: async (req, res, next) => {
    try {
      const { usuario, senha } = req.body;
      
      // Validações de entrada
      if (!usuario || !senha) {
        throw new CustomError('Credenciais incompletas', 400);
      }
      
      const usuarios = await readData();
      const usuarioEncontrado = usuarios.find(u => u.usuario === usuario);
      
      if (!usuarioEncontrado || !(await bcrypt.compare(senha, usuarioEncontrado.senha))) {
        throw new CustomError('Credenciais inválidas', 401);
      }
      
      // Geração de token com chave secreta
      const token = jwt.sign(
        { 
          id: usuarioEncontrado.id, 
          ehAdmin: usuarioEncontrado.ehAdmin 
        },
        process.env.JWT_SEGREDO || 'chave-secreta-padrao',
        { expiresIn: '24h' }
      );
      
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
  
  // Obter perfil do usuário
  obterPerfil: async (req, res, next) => {
    try {
      const usuarios = await readData();
      const usuario = usuarios.find(u => u.id === req.usuario.id);
      
      if (!usuario) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      const { senha: _, ...usuarioSemSenha } = usuario;
      res.json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Atualizar perfil do usuário
  atualizarPerfil: async (req, res, next) => {
    try {
      const { nome, telefone, dataNascimento, senha } = req.body;
      
      const usuarios = await readData();
      const indiceUsuario = usuarios.findIndex(u => u.id === req.usuario.id);
      
      if (indiceUsuario === -1) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      const usuarioAtualizado = {
        ...usuarios[indiceUsuario],
        nome: nome || usuarios[indiceUsuario].nome,
        telefone: telefone || usuarios[indiceUsuario].telefone,
        dataNascimento: dataNascimento || usuarios[indiceUsuario].dataNascimento
      };
      
      // Atualizar senha se fornecida
      if (senha) {
        usuarioAtualizado.senha = await bcrypt.hash(senha, 10);
      }
      
      usuarios[indiceUsuario] = usuarioAtualizado;
      await writeData(usuarios);
      
      const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
      res.json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  },
  
  // Deletar conta do usuário
  deletarConta: async (req, res, next) => {
    try {
      const usuarios = await readData();
      const usuariosAtualizados = usuarios.filter(u => u.id !== req.usuario.id);
      
      if (usuarios.length === usuariosAtualizados.length) {
        throw new CustomError('Usuário não encontrado', 404);
      }
      
      await writeData(usuariosAtualizados);
      res.json({ mensagem: 'Conta excluída com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};