import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export async function cadastrar(dados) {
  const { nome, email, senha } = dados;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    const erro = new Error("Email já cadastrado");
    erro.status = 409;
    throw erro;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      papel: true,
    },
  });

  return usuario;
}