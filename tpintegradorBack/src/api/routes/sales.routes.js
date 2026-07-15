// RUTAS DE VENTAS

import { Router } from "express";
import { createSale, descargarVentasExcel } from "../controllers/sales.controllers.js"

const router = Router();

router.post("/", createSale);
router.get("/excel", descargarVentasExcel);

export default router;