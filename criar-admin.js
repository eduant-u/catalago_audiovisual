import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "./src/lib/prisma.js";

const senhaHash = await bcrypt.hash("123456", 10);

const admin = await prisma.usuario.create({
  data: {
    nome: "Admin",
    email: "admin@teste.com",
    senha: senhaHash,
    papel: "ADMIN",
  },
  select: {
    id: true,
    nome: true,
    email: true,
    papel: true,
  },
});

console.log(admin);

await prisma.$disconnect();