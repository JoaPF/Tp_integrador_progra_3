// Rutas de vistas

import { Router } from "express";
import { join, __dirname } from "../utils/index.js";
import { getProductView, indexView, postProductView, putProductView, deleteProductView } from "../controllers/view.controllers.js";

const router = Router();

router.get("/", indexView);

router.get("/consultar", getProductView);

router.get("/crear", postProductView);

router.get("/modificar", putProductView);

router.get("/eliminar", deleteProductView);

export default router;
