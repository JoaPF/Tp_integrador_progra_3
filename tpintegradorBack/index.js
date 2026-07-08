import express from "express";
const app = express(); // instancia de una aplicacion
import enviroments from "./src/api/config/enviroments.js";
import connection from "./src/api/database/db.js";
import cors from "cors"

// Config
const PORT = enviroments.port;

//======================Middlewares======================
app.use(cors());

// Middleware para parsear JSON en las solicitudes POST y PUT
app.use(express.json());

app.use((req, res, next) => { // Middleware logger para analizar todas las solicitudes por consola (historial de consumo de nuestra API Rest en la consola)
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);

    next(); // next() Da paso a que continue la respuesta o el siguiente Middleware (En caso de que haya uno)
});

//Middleware de ruta (se aplica en ciertos endpoints)
const validateId = (req, res, next) => {
    const id = Number(req.params.id); // Transformo el id a un numero

    if (!Number.isInteger(id) || id <= 0) { // Si no un entero o es 0 o inferior devuelvo 400 (Bad Request)
        return res.status(400).json({
            error: "El id debe ser un numero positivo"
        });
    }

    req.id = id;

    next();
}

// Middelware de ruta para validar los campos de un formulario de POST

const categoriasValidas = ["Electric", "Electroacustic"];
const validateProduct = (req, res, next) => {
    //Recogemos los datos del body
    const { nombre, imagen, categoria, precio, } = req.body;

    // array vacio de errores
    const errores = []

    // Validamos si se recibieron todos los campos
    if (!nombre || !imagen || !categoria || !precio) {
        errores.push ("Datos invalidos, asegurate de completar todos los campos pancho");
    }

    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (typeof imagen !== "string" || imagen.trim().length < 0) {
        errores.push("Tenes que poner una url de imagen");
    }

    if (typeof precio !== "number" || precio <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if (!categoriasValidas.includes(categoria)) {
        errores.push("Categoria  invalida");
    }

    // Detectamos que hay un error en la lista y lo devolvemos en un 400
    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos invalidos", errores
        });
    }

    next();
}


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//======================Endpoints======================
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

//===========Productos===========

//Endpoint GET para TODOS los productos
//devuelve el resultado de la consulta a la bbdd y el estatus 200(ok)
app.get("/api/products", async (req, res) => {
    try{
        const sql = "SELECT id, nombre, precio, imagen, activo FROM productos";
        const [rows] = await connection.query(sql);

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
});

// Endpoint GET por ID
app.get("/api/products/:id", validateId, async (req, res) => {
    // Opt 2: Manejamos posibles error con try...catch
    try {
        // Opt 1: Delegamos al middleware validateId recoger el valor y limpiarlo
        const id = req.params.id; // Obtengo valor que paso por la URL

        // Opt 4: Guardamos la consulta sql en una variable y optimizamos pidiendo solo los campos necesarios
        const sql = "SELECT id, nombre, precio, imagen, activo FROM productos where productos.id = ?"

        const [rows] = await connection.query(sql, [req.id]);

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
});

app.post("/api/products", validateProduct, async (req, res) => {
    // Gracias al Middleware app.use(express.json()); recibo el JSON como objeto JS al que le puedo aplicar el siguiente DESTRUCTURING
    try {
        const { nombre, imagen, categoria, precio, activo } = req.body; // DESTRUCTURING

        const sql = "INSERT INTO productos (nombre, imagen, categoria, precio, activo) VALUES (?, ?, ?, ?, ?)";

        const [rows] = await connection.query(sql, [nombre, imagen, categoria, precio, activo]);

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
})

app.delete("/api/products/:id", validateId, async (req, res) => {
    try {
        // const id = req.params.id;

        const sql = "DELETE FROM productos WHERE id = ?";

        await connection.query(sql, [req.id]);

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
});

app.put("/api/products/", async (req, res) => {
    // Gracias al middleware app.use(express.json()); ahora en lugar de un JSON, nuestro endpoint recibe un objeto
    try {
        const { id, nombre, imagen, categoria, precio, activo } = req.body;

        if (!nombre || !imagen || !categoria || !precio) {
            return res.status(400).json({
                message: "Todos los campos del formulario son requeridos"
            })
        }


        const sql = "UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ?, activo = ? WHERE id = ?";

        // Opt: Verificamos si realmente se actualizo algo, guardando la respuesta de la BBDD
        const [result] = await connection.query(sql, [nombre, imagen, categoria, precio, activo, id]);

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
})

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