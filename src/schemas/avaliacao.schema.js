import { z } from "zod";

export const criarAvaliacaoSchema = z.object({
  nota: z.number().int().min(1).max(5),
  comentario: z.string().optional(),
});

export const atualizarAvaliacaoSchema = criarAvaliacaoSchema.partial();