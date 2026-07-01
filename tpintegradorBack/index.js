import express from "express";
const app = express();
import enviroments from "./src/api/config/enviroments.js";



const PORT = enviroments.port;

//Endpoints
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.get("/api/products", (req, res) => {
    res.send("Aca devolveremos el JSON que me devuelva la consulta SELECT * FROM products");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});