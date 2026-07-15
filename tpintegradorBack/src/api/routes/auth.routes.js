import { Router } from "express";
import { destroyLogin, loginView, processLoginInfo } from "../controllers/auth.controllers.js";
const router = Router();


// Mostrar la vista del login
router.get("/", loginView);


// Endpoint para poder recibir la info del <form> de login
// Aca gestionamos la info y buscamos el usuario y el password en la BBDD
router.post("/", processLoginInfo);


// Endpoint para cerrar la sesion desde el dashboard
router.post("/destroy", destroyLogin);

// Exportamos todas las rutas y las centralizamos en el archivo de barril -> index.js
export default router;