// CONTROLADORES DE PRODUCTOS

import ProductsModels from "../models/product.models.js";

// GET all products
export const getAllProducts =  async (req, res) => {
    try{

        const [rows] = await ProductsModels.selectAllProducts();

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos"
            })
        }

        res.status(200).json({
            payload: rows,
            total: rows.length
        });
        console.log(rows);

    } catch (error){
        console.log("Error obteniendo los producctos: ", error.message);

        res.status(500).json({
            message: "Error interno al obtener productos"
        });
        
    }
}

// GET product by ID
export const getProductById = async (req, res) => {
    // Opt 2: Manejamos errores con try...catch
    try {
        // const id = req.params.id; // Obtengo valor que paso por la URL (Con el middleware no hace falta)
        // Opt 1: Delegamos al middleware validateId recoger el valor y limpiarlo

        const [rows] = await ProductsModels.selectProductById(req.id);

        // Opt 5: Si no encontramos un producto con ese id devolvemos un status 404 (Not Found) 
        if (rows.length === 0) {
            return res.status(404).json({
                message: `No se encontro producto con id ${req.id}`
            });
        }

        res.status(200).json({
            payload: rows
        });
    } catch (error) {
        console.error(`Error obteniendo producto con id ${req.id}`, error.message);

        // Opt 3: Devolvemos un error 500
        res.status(500).json({
            message: `error interno al obtener un producto con id ${500}`
        }); 
    }
}

// POST product
export const createProduct = async (req, res) => {
    // Gracias al Middleware app.use(express.json()); recibo el JSON como objeto JS al que le puedo aplicar el siguiente DESTRUCTURING
    try {
        const { nombre, imagen, categoria, precio, activo } = req.body; // DESTRUCTURING

        const [rows] = await ProductsModels.insertNewProduct(nombre, imagen, categoria, precio, activo);

        // Opt: En logar de un status 200, devolvemos 201 "Created"
        res.status(201).json({
            message: "Producto creado con exito",
            productId: rows.insertId
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Error interno del servidor",
        });
    }
}

// DELETE product
export const removeProduct = async (req, res) => {
    try {
        // const id = req.params.id;

        await ProductsModels.deleteProduct(req.id);

        // La convencion REST habria que devolver para un delete exitoso, un codigo 204 No Content
        res.status(200).json({
            message: `Producto con id ${req.id} eliminado exitosamente`
        });
    } catch (error) {
        console.error("Error en peticion delete", error.message)

        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}

// PUT product
export const modifyProduct = async (req, res) => {
    // Gracias al middleware app.use(express.json()); ahora en lugar de un JSON, nuestro endpoint recibe un objeto
    try {
        const { id, nombre, imagen, categoria, precio, activo } = req.body;

        if (!nombre || !imagen || !categoria || !precio) {
            return res.status(400).json({
                message: "Todos los campos del formulario son requeridos"
            })
        }

        // Opt: Verificamos si realmente se actualizo algo, guardando la respuesta de la BBDD
        const [result] = await ProductsModels.updateProduct(nombre, imagen, categoria, precio, activo, id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "No se actualizo ningun campo"
            });
        }


        return res.status(200).json({
            message: "Producto actualizado correctamente",
        });
    } catch (error) {
        console.error("Error: ", error.message)

        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}