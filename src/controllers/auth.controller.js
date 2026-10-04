import { cadastrar } from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const usuario = await cadastrar(req.body);

    return res.status(201).json(usuario);
  } catch (erro) {
    next(erro);
  }
}