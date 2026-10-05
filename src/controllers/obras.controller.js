import * as obrasService from "../services/obras.service.js";

function lerId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ erro: "ID inválido" });
    return null;
  }

  return id;
}

export async function listar(req, res) {
  res.json(await obrasService.listarObras());
}

export async function buscar(req, res) {
  const id = lerId(req, res);

  if (id === null) return;

  const obra = await obrasService.buscarObra(id);

  if (!obra) {
    return res.status(404).json({ erro: "Obra não encontrada" });
  }

  res.json(obra);
}

export async function criar(req, res) {
  const obra = await obrasService.criarObra(req.body);

  res.status(201).json(obra);
}

export async function atualizar(req, res) {
  const id = lerId(req, res);

  if (id === null) return;

  const obra = await obrasService.atualizarObra(id, req.body);

  if (!obra) {
    return res.status(404).json({ erro: "Obra não encontrada" });
  }

  res.json(obra);
}

export async function remover(req, res) {
  const id = lerId(req, res);

  if (id === null) return;

  const removida = await obrasService.removerObra(id);

  if (!removida) {
    return res.status(404).json({ erro: "Obra não encontrada" });
  }

  res.status(204).send();
}