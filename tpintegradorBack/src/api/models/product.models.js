// MODELOS DE PRODUCTOS

import connection from "../database/db.js";

// Traer todos los productos
const selectAllProducts = () => {
    const sql = "SELECT id, nombre, precio, imagen, activo FROM productos";
    return connection.query(sql);
}

// Consultar producto por ID
const selectProductById = (id) => {
    // Opt 4: Guardamos la consulta sql en una variable y optimizamos pidiendo solo los campos necesarios
    const sql = "SELECT id, nombre, precio, imagen, activo FROM productos where productos.id = ?"
    return  connection.query(sql, [id]);
}

// Crear producto
const insertNewProduct = (nombre, imagen, categoria, precio, activo) => {
    const sql = "INSERT INTO productos (nombre, imagen, categoria, precio, activo) VALUES (?, ?, ?, ?, ?)";

    return connection.query(sql, [nombre, imagen, categoria, precio, activo]);
}

// Modificar productos
const updateProduct = (nombre, imagen, categoria, precio, activo, id) => {
    const sql = "UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ?, activo = ? WHERE id = ?";

    // Opt: Verificamos si realmente se actualizo algo, guardando la respuesta de la BBDD
    return connection.query(sql, [nombre, imagen, categoria, precio, activo, id]);
}

// Eliminar un producto
const deleteProduct = (id) => {
    const sql = "DELETE FROM productos WHERE id = ?";

    return connection.query(sql, [id]);
}

export default {
    selectAllProducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct
}

