// MODELO DE VENTAS

import connection from "../database/db.js";

const insertNewSale = (usuario, fecha, precioTotal) => {
    const sql = "INSERT INTO ventas (nombre_usuario, fecha, precio_total) VALUES (?, ?, ?)";

    return connection.query(sql, [usuario, fecha, precioTotal]);
}

export default {
    insertNewSale
}