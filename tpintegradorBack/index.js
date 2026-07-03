import express from "express";
const app = express();
import enviroments from "./src/api/config/enviroments.js";
import connection from "./src/api/database/db.js";

const PORT = enviroments.port;

//Endpoints
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//endpoint para devolver TODOS los productos
//devuelve el resultado de la consulta a la bbdd y el estatus 200(ok)
app.get("/api/products", async (req, res) => {
    try{
        const sql = "SELECT * FROM productos";
        const [rows] = await connection.query(sql);

        res.status(200).json({rows});
        console.log(rows);

    } catch (error){
        console.log("Error: ", error.message);
        
    }
});

//endpoint para devolver TODOS los usuarios
app.get("/api/users", async (req, res) => {
    try{
        const sql = "SELECT * FROM usuario";
        const [rows] = await connection.query(sql);

        res.status(200).json({rows});
        console.log(rows);

    } catch (error){
        console.log("Error: ", error.message);
        
    }
});