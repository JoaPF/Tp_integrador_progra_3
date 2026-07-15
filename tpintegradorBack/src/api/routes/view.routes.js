// Rutas de vistas

import { Router } from "express";
import { join, __dirname } from "../utils/index.js";
import { getProductView, indexView, postProductView, putProductView, deleteProductView } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

const router = Router();

router.get("/", requireLogin, indexView);

router.get("/consultar", requireLogin, getProductView);

router.get("/crear", requireLogin, postProductView);

router.get("/modificar", requireLogin, putProductView);

router.get("/eliminar", requireLogin, deleteProductView);

export default router;
