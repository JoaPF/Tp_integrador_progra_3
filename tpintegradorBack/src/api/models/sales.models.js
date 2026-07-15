// MODELO DE VENTAS

import connection from "../database/db.js";

const insertNewSale = (usuario, fecha, precioTotal) => {
    const sql = "INSERT INTO ventas (nombre_usuario, fecha, precio_total) VALUES (?, ?, ?)";

    return connection.query(sql, [usuario, fecha, precioTotal]);
}

const selectAllSales = () => {
    const sql = "SELECT id, nombre_usuario, fecha, precio_total FROM ventas";

    return connection.query(sql);
}

export default {
    insertNewSale,
    selectAllSales
}