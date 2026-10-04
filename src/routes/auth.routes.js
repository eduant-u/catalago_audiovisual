import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerSchema } from "../schemas/auth.schema.js";
import validar from "../middlewares/validar.js";

const router = Router();

router.post("/register", validar(registerSchema), register);

export default router;