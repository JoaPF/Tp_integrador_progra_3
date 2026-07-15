import { Router } from "express";
import { createAdminUser } from "../controllers/user.controllers.js";
const router = Router();

router.post("/", createAdminUser);

// Exporto rutas a index.js
export default router;