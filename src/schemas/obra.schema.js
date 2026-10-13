import { z } from "zod";

export const criarObraSchema = z.object({
  titulo: z.string().min(1),
  descricao: z.string().optional(),
  ano: z.number().int().min(1888).optional(),
});

export const atualizarObraSchema = criarObraSchema.partial();