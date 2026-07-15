// Middleware (de aplicacion) logger para analizar todas las solicitudes por consola (historial de consumo de nuestra API Rest en la consola)
const loggerURL = (req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);

    next(); // next() Da paso a que continue la respuesta o el siguiente Middleware (En caso de que haya uno)
};

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

//Para requerir inicio de sesión y proteger la ruta
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login")
    }
    next();
}


export {
    loggerURL,
    validateId,
    validateProduct,
    requireLogin
}