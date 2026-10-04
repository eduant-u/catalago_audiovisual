import { cadastrar, entrar } from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const usuario = await cadastrar(req.body);

    return res.status(201).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

export async function login(req, res, next) {
  try {
    const resultado = await entrar(req.body);

    return res.status(200).json(resultado);
  } catch (erro) {
    next(erro);
  }
}

export function me(req, res) {
  return res.status(200).json({
    usuario: req.usuario,
  });
}