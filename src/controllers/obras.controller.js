import * as obrasService from "../services/obras.service.js";

function lerId(req) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    const erro = new Error("ID inválido");
    erro.status = 400;
    throw erro;
  }

  return id;
}

export async function listar(req, res, next) {
  try {
    const obras = await obrasService.listarObras();

    return res.json(obras);
  } catch (erro) {
    next(erro);
  }
}

export async function buscar(req, res, next) {
  try {
    const id = lerId(req);

    const obra = await obrasService.buscarObra(id);

    if (!obra) {
      const erro = new Error("Obra não encontrada");
      erro.status = 404;
      throw erro;
    }

    return res.json(obra);
  } catch (erro) {
    next(erro);
  }
}

export async function criar(req, res, next) {
  try {
    const obra = await obrasService.criarObra(req.body);

    return res.status(201).json(obra);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizar(req, res, next) {
  try {
    const id = lerId(req);

    const obra = await obrasService.atualizarObra(id, req.body);

    if (!obra) {
      const erro = new Error("Obra não encontrada");
      erro.status = 404;
      throw erro;
    }

    return res.json(obra);
  } catch (erro) {
    next(erro);
  }
}

export async function remover(req, res, next) {
  try {
    const id = lerId(req);

    const removida = await obrasService.removerObra(id);

    if (!removida) {
      const erro = new Error("Obra não encontrada");
      erro.status = 404;
      throw erro;
    }

    return res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}