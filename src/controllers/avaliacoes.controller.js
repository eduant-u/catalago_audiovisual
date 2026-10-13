import * as avaliacoesService from "../services/avaliacoes.service.js";

// AJUSTAR: se o middleware de autenticação usa outro nome (ex.: req.user), mude só aqui
const usuarioLogado = (req) => req.usuario;

function lerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    const erro = new Error("ID inválido");
    erro.status = 400;
    throw erro;
  }
  return id;
}

export async function listarDaObra(req, res, next) {
  try {
    const avaliacoes = await avaliacoesService.listarPorObra(lerId(req));
    return res.json(avaliacoes);
  } catch (erro) {
    next(erro);
  }
}

export async function criar(req, res, next) {
  try {
    const avaliacao = await avaliacoesService.criarAvaliacao({
      obraId: lerId(req),
      usuarioId: usuarioLogado(req).id,
      nota: req.body.nota,
      comentario: req.body.comentario,
    });
    return res.status(201).json(avaliacao);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizar(req, res, next) {
  try {
    const avaliacao = await avaliacoesService.atualizarAvaliacao(
      lerId(req),
      usuarioLogado(req).id,
      req.body
    );
    return res.json(avaliacao);
  } catch (erro) {
    next(erro);
  }
}

export async function remover(req, res, next) {
  try {
    await avaliacoesService.removerAvaliacao(lerId(req), usuarioLogado(req).id);
    return res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}