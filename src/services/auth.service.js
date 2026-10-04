import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

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

export async function entrar(dados) {
  const { email, senha } = dados;

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    const erro = new Error("Email ou senha inválidos");
    erro.status = 401;
    throw erro;
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    const erro = new Error("Email ou senha inválidos");
    erro.status = 401;
    throw erro;
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      papel: usuario.papel,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return { token };
}