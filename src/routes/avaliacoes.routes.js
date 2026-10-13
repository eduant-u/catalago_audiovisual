import { Router } from "express";
import * as avaliacoesController from "../controllers/avaliacoes.controller.js";
import { atualizarAvaliacaoSchema } from "../schemas/avaliacao.schema.js";
import validar from "../middlewares/validar.js";
import autenticar from "../middlewares/autenticar.js";

const router = Router();

router.put(
  "/:id",
  autenticar,
  validar(atualizarAvaliacaoSchema),
  avaliacoesController.atualizar
);

router.delete("/:id", autenticar, avaliacoesController.remover);

export default router;