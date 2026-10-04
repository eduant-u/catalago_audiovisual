import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import validar from "../middlewares/validar.js";
import autenticar from "../middlewares/autenticar.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.post("/register", validar(registerSchema), register);
router.post("/login", validar(loginSchema), login);

router.get("/me", autenticar, me);

router.get("/admin", autenticar, isAdmin, (req, res) => {
  return res.status(200).json({
    mensagem: "Acesso de administrador liberado",
  });
});

export default router;