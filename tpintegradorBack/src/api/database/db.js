import mysql2 from "mysql2/promise";

// Importamos la informacion de la conexion a la BBDD
import environments from "../config/enviroments.js";

// Extraemos solo el objeto database
const { database } = environments;

//pool de conexiones a la bbdd
const connection = mysql2.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection;