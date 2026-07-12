// Controladores de vistas

import ProductModels from "../models/product.models.js";
import { join, __dirname } from "../utils/index.js";

// Vista principal dashboard
export const indexView = async (req, res) => {
    try {

        const [ rows ] = await ProductModels.selectAllProducts();

        res.render("index", {
            title: "Dashboard",
            about: "Nuestros productos",
            productsArray: rows
        });
    } catch (error) {
        console.log("Error obteniendo la informacion", error.message);

        res.status(500).json({
            message: "Error interno obteniendo la informacion"
        })
    }
}

// Vista obtener producto
export const getProductView = (req, res) => {
    res.render("get", {
        title: "Consultar",
        about: "Consultar productos por id: "
    }); 
}

// Vista Crear Producto
export const postProductView = (req, res) => {
    res.render("post", {
        title: "Crear",
        about: "Crear productos: "
    }); 
}

// Vista Actualizar Producto
export const putProductView = (req, res) => {
    res.render("put", {
        title: "Modificar",
        about: "Modificar productos: "
    }); 
}