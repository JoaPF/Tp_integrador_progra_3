// CONTROLADORES DE AUTENTICACIÓN

import connection from "../database/db.js";
import bcrypt from "bcrypt";

// Renderizo la vista Login
export const loginView = async (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Introduci tus credenciales"
    });
}


// Procesamos los datos del login del <form>
export const processLoginInfo = async (req, res) => {

    try {
        // Recibimos los datos de los campos email y password
        // Estos datos, gracias al middleware de parseo de urlencoded ya entran a este endpoint como objetos JS
        const { email, password } = req.body;

        // Evitamos una consulta innecesaria
        if(!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Introduci tus credenciales",
                error: "Faltan campos en el formulario"
            });            
        }


        /*
        // TO DO, Crearemos el modelo de usuarios
        const sql = "SELECT * FROM users where email = ? AND password = ?";
        const [rows] = await connection.query(sql, [email, password]);
        */

        // Bcrypt 1 -> Traemos solamente el usuario por su email
        const sql = "SELECT id, nombre AS name, email, password FROM usuario WHERE email = ?";
        const [rows] = await connection.query(sql, [email]);

        // TO DO, mensaje de error si no existe el usuario admin
        if (rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Introduci tus credenciales",
                error: "No existe el usuario"
            });   
        }

        // ↓ datos del usuario en la variable rows
        // id, nombre, email, password

        const user = rows[0];
        console.table(user);

        // Bcrypt 2 -> Comparamos si el hasheo de este password es igual al hasheo de la BBDD
        const match = await bcrypt.compare(password, user.password);
        console.log(match);

        // Bcrypt 3 -> Si coinciden los hashes, match devuelve true y continuamos con el login
        if (match) {
            // Una vez que recibimos a nuestro usuario admin, vamos a creada una sesion
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            }
    
            // Ya con la nueva sesion creada, redirigimos al dashboard
            res.redirect("/dashboard");

        } else {
            return res.render("login", {
                title: "Login",
                about: "Introduci tus credenciales",
                error: "Password invalido"
            });
        }


    } catch (error) {
        console.error("Error en el login: ", error);
        res.status(500).json({
            error: "Erro interno del servidor"
        })
    }
}

// Cerramos la sesion
export const destroyLogin = (req, res) => {
    // Destruimos la sesion creada y redirigimos a login
    req.session.destroy((error) => {

        // En caso de error, mandamos un error 500
        if (error) {
            console.log("Error al destruir la sesion: ", error);

            return res.status(500).json({
                message: "Error al cerrar la sesion"
            });
        }

        res.redirect("/login"); // Destruida la sesion exitosamente, redirigimoa al login
    })
}