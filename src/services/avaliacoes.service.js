import prisma from "../lib/prisma.js";

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

export async function listarPorObra(obraId) {
  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra) throw criarErro("Obra não encontrada", 404);

  return prisma.avaliacao.findMany({
    where: { obraId },
    include: { usuario: { select: { id: true, nome: true } } },
    orderBy: { data: "desc" },
  });
}

export async function criarAvaliacao({ obraId, usuarioId, nota, comentario }) {
  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra) throw criarErro("Obra não encontrada", 404);

  const jaAvaliou = await prisma.avaliacao.findFirst({
    where: { obraId, usuarioId },
  });
  if (jaAvaliou) throw criarErro("Você já avaliou esta obra", 409);

  return prisma.avaliacao.create({
    data: { obraId, usuarioId, nota, comentario },
  });
}

export async function atualizarAvaliacao(id, usuarioId, dados) {
  const avaliacao = await prisma.avaliacao.findUnique({ where: { id } });
  if (!avaliacao) throw criarErro("Avaliação não encontrada", 404);
  if (avaliacao.usuarioId !== usuarioId)
    throw criarErro("Você só pode editar suas próprias avaliações", 403);

  return prisma.avaliacao.update({ where: { id }, data: dados });
}

export async function removerAvaliacao(id, usuarioId) {
  const avaliacao = await prisma.avaliacao.findUnique({ where: { id } });
  if (!avaliacao) throw criarErro("Avaliação não encontrada", 404);
  if (avaliacao.usuarioId !== usuarioId)
    throw criarErro("Você só pode excluir suas próprias avaliações", 403);

  await prisma.avaliacao.delete({ where: { id } });
}