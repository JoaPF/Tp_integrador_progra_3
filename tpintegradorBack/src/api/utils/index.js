// Aca vamos a gestionar la logica para trabajar con archivos y rutas del proyecto

// Importar los modulos para trabajar con rutas
import { fileURLToPath } from "url"; // Convierte una url de archivo file: a una ruta del sistema de archivos
import { dirname, join } from "path"; // Dirname devuelve el directorio padre de una ruta y join une segmentos de ruta

// Obtener el nombre del archivo actual

const __filename = fileURLToPath(import.meta.url); 
/* Proporcionamos la url absoluta del modulo actual, con fileURLToPath convertimos esta URL a una ruta del sistema

    Pasamos de 
        file://ruta/al/archivo.js

    A
    /ruta/al/archivo.js

*/

// Obtenemos el directorio del archivo actual
const __dirname = join(dirname(__filename), "../../../"); // Salimos de las carpetas utils/api/src
/*
dirname(__filename): Obtiene el directorio del archivo actual
join("../../../") Retrocede tres niveles de la estructura de directorios

*/

export {
    __dirname,
    join
}

/*
Con estas dos nuevas variables, __dirname y filename (en Node.js las teniamos a disposicion con common.js)
Gracias a estas variables podremos:

    1. Trabajar con rutas absolutas
    2. Resolver correctamente rutas de archivos estaticos
    3. Contruir rutas para enviar HTML, CSS, Imagenes, etc.
    4. Evitar errores como "Cannot find module" o rutas rotas en produccion

*/

