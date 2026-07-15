// Modelos de usuario
import connection from "../database/db.js";

// Crear usuario admin
const insertAdminUser = (name, email, password) => {
    const sql = "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)";

    return connection.query(sql, [name, email, password]);
}

export default {
    insertAdminUser
}