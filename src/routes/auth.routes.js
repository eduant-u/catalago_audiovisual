import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import {registerSchema, loginSchema} from "../schemas/auth.schema.js";
import validar from "../middlewares/validar.js";

const router = Router();

router.post("/register", validar(registerSchema), register);
router.post("/login", validar(loginSchema), login);

export default router;