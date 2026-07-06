import express from "express";
const app = express();
import enviroments from "./src/api/config/enviroments.js";
import connection from "./src/api/database/db.js";
import cors from "cors"

// Config
const PORT = enviroments.port;

//Middleware
app.use(cors());

// Middleware para parsear JSON en las solicitudes POST y PUT
app.use(express.json());

app.use((req, res, next) => { // Middleware logger para analizar todas las solicitudes por consola (historial de consumo de nuestra API Rest en la consola)
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);

    next(); // next() Da paso a que continue la respuesta o el siguiente Middleware (En caso de que haya uno)
});


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

        res.status(200).json({
            payload: rows
        });
        console.log(rows);

    } catch (error){
        console.log("Error: ", error.message);
        
    }
});

// Endpoint get por id
app.get("/api/products/:id", async (req, res) => {
    try {
    const id = req.params.id; // Obtengo valor que paso por la URL

    const [rows] = await connection.query("SELECT * FROM productos where productos.id = ?", [id]);

    res.status(200).json({
        payload: rows
    });
    } catch (error) {
        console.error("Error: ", error.message)
    }
});

app.post("/api/products", async (req, res) => {
    // Gracias al Middleware app.use(express.json()); recibo el JSON como objeto JS al que le puedo aplicar el siguiente DESTRUCTURING
    try {
        const { nombre, imagen, categoria, precio, activo } = req.body; // DESTRUCTURING

        const sql = "INSERT INTO productos (nombre, imagen, categoria, precio, activo) VALUES (?, ?, ?, ?, ?)";

        await connection.query(sql, [nombre, imagen, categoria, precio, activo]);

        res.status(200).json({
            message: "Producto creado con exito"
        });
    } catch (error) {
        console.error("Error: ", error.message)
    }
})

app.delete("/api/products/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await connection.query("DELETE FROM productos WHERE id = ?", [id]);

        res.status(200).json({
            message: `Producto con id ${id} eliminado exitosamente`
        });
    } catch (error) {
        console.error("Error: ", error.message)
    }
});

app.put("/api/products/", async (req, res) => {
    // Gracias al middleware app.use(express.json()); ahora en lugar de un JSON, nuestro endpoint recibe un objeto
    try {
        const { id, nombre, imagen, categoria, precio, activo } = req.body;

        const sql = "UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ?, activo = ? WHERE id = ?";

        await connection.query(sql, [nombre, imagen, categoria, precio, activo, id]);

        return res.status(200).json({
            message: "Producto actualizado correctamente"
        });
    } catch (error) {
        console.error("Error: ", error.message)
    }
})

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