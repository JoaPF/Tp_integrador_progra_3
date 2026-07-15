// RUTAS DE PRODUCTOS

import { Router } from "express";
import { validateId, validateProduct, attachImagen, upload } from "../middlewares/middlewares.js";
import { removeProduct, getAllProducts, getProductById, createProduct, modifyProduct } from "../controllers/product.controllers.js";
const router = Router();


//GET all products
router.get("/", getAllProducts);

// GET by id
router.get("/:id", validateId, getProductById);

// POST product (acepta url o archivo)
router.post("/", upload.single('imagenFile'), attachImagen, validateProduct, createProduct);

// DELETE product
router.delete("/:id", validateId, removeProduct);

// UPDATE product (acepta url o archivo)
router.put("/", upload.single('imagenFile'), attachImagen, validateProduct, modifyProduct);

// Exportamos todas las rutas y las centralizamos en el archivo de barril -> index.js
export default router;