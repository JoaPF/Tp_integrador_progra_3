// RUTAS DE PRODUCTOS

import { Router } from "express";
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { removeProduct, getAllProducts, getProductById, createProduct, modifyProduct } from "../controllers/product.controllers.js";
const router = Router();


//GET all products
router.get("/", getAllProducts);

// GET by id
router.get("/:id", validateId, getProductById);

// POST product
router.post("/", validateProduct, createProduct);

// DELETE product
router.delete("/:id", validateId, removeProduct);

// UPDATE product
router.put("/", modifyProduct);

// Exportamos todas las rutas y las centralizamos en el archivo de barril -> index.js
export default router;