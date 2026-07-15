import express from "express";
const app = express(); // instancia de una aplicacion
import enviroments from "./src/api/config/enviroments.js";
import { productRoutes, salesRouter, viewRoutes } from "./src/api/routes/index.js";
import connection from "./src/api/database/db.js"; // TO DO: Despues de modularizar users hay q sacar la conexion de la BBDD de index.js
import cors from "cors"
import { loggerURL, validateId, validateProduct } from "./src/api/middlewares/middlewares.js"; // TO DO: Despues de modularizar users hay que sacar validateId y Validate Product
import { join, __dirname } from "./src/api/utils/index.js"; // Importamos la configuracion para trabajar con rutas de /utils

// Config
const PORT = enviroments.port;

//======================Middlewares======================
app.use(cors());

// Middleware para parsear JSON en las solicitudes POST y PUT
app.use(express.json());

app.use(loggerURL);

app.use(express.static(join(__dirname, "src/public"))); // Middleware para servir archivos estaticos
// Gracias a esta configuracion, ya puedo acceder a http://localhost:3000/css/styles.css y obtener el archivo css que se encuentra en la ruta src/public/css/styles.css

// Configuramos EJS como motor de plantillas
app.set("view engine", "ejs"); // Motor de vistas
app.set("views", join(__dirname, "src/views")); // Desde la raiz del servidor apuntamos a / + /src + /views


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//======================Endpoints======================
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

// Rutas
app.use("/api/products", productRoutes);
app.use("/dashboard", viewRoutes);
app.use("/api/sales", salesRouter);

//===========Productos===========


//===========Usuarios===========

//endpoint para devolver TODOS los usuarios
app.get("/api/users/all", async (req, res) => {
    try{
        const sql = "SELECT * FROM usuario";
        const [rows] = await connection.query(sql);

        res.status(200).json({rows});
        console.log(rows);

    } catch (error){
        console.log("Error: ", error.message);
        
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});

//GET por ID
app.get("/api/users/:id", validateId, async (req, res) => {
    // Opt 2: Manejamos posibles error con try...catch
    try {
        const id = req.params.id; // Obtengo valor que paso por la URL

        const sql = "SELECT * FROM usuario where usuario.id = ?"

        const [rows] = await connection.query(sql, [req.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: `No se encontro un usuario con id ${req.id}`
            });
        }

        //ok
        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.error(`Error obteniendo usuario con id ${req.id}`, error.message);

        res.status(500).json({
            message: `error interno al obtener un usuario con id ${500}`
        }); 
    }
});