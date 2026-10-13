import prisma from "../lib/prisma.js";

export function listarObras() {
  return prisma.obra.findMany({
    orderBy: { id: "asc" },
  });
}

export function buscarObra(id) {
  return prisma.obra.findUnique({
    where: { id },
    include: { avaliacoes: true },
  });
}

export function criarObra(dados) {
  return prisma.obra.create({
    data: dados,
  });
}

export async function atualizarObra(id, dados) {
  const existe = await prisma.obra.findUnique({
    where: { id },
  });

  if (!existe) return null;

  return prisma.obra.update({
    where: { id },
    data: dados,
  });
}

export async function removerObra(id) {
  const existe = await prisma.obra.findUnique({
    where: { id },
  });

  if (!existe) return false;

  await prisma.$transaction([
    prisma.avaliacao.deleteMany({
      where: { obraId: id },
    }),
    prisma.obra.delete({
      where: { id },
    }),
  ]);

  return true;
}