import { Router } from "express";

import * as obrasController from "../controllers/obras.controller.js";

import {
  criarObraSchema,
  atualizarObraSchema,
} from "../schemas/obra.schema.js";

import validar from "../middlewares/validar.js";

import autenticar from "../middlewares/autenticar.js";

import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.get("/", obrasController.listar);

router.get("/:id", obrasController.buscar);

router.post(
  "/",
  autenticar,
  isAdmin,
  validar(criarObraSchema),
  obrasController.criar
);

router.put(
  "/:id",
  autenticar,
  isAdmin,
  validar(atualizarObraSchema),
  obrasController.atualizar
);

router.delete(
  "/:id",
  autenticar,
  isAdmin,
  obrasController.remover
);

export default router;