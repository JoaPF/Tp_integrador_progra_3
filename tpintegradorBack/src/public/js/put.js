const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const contenedorForm = document.getElementById("contenedor-form");
const urlBase = "http://localhost:3000/api/products";

getProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    // Opt 1: Para extraer solamente un valor, como el id en nuestro miniformulario, podemos saltarnos el FormData + Object.fromEntries

    const idProd = event.target.idProd.value.trim();

    // Opt 2: Nos aseguramos de que se haya enviado un id valido
    if (!idProd) {
        mostrarError("Ingrese un id valido");
        return;
    }

    try {
        const response = await fetch(`${urlBase}/${idProd}`);

        const data = await response.json();

        //Opt 4: Mostramos por pantalla el error que nos devuelve el servidor
        if (!response.ok) {
            mostrarError(data.message);
            return;
        }

        const producto = data.payload[0];

        renderizarProducto(producto);

    } catch (error) {
        console.error(`Error al obtener productos: ${error}`);

        // Opt 5: Mostramos error de red (en el try...catch de fetch no capturamos error 400 o 500)
        mostrarError("Error de conexion con el servidor");
    }
});

function renderizarProducto(producto) {
    const htmlProducto = `
            <ul>
                <li class="lista-producto">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</p>
                    <input type="button" id="updateProduct-button" value="Actualizar Producto">
                </li>
            </ul>
        `;

    contenedorProductos.innerHTML = htmlProducto;
    
    const updateProductButton = document.getElementById("updateProduct-button");

    updateProductButton.addEventListener("click", event => {
        event.stopPropagation();

        const confirmacion = confirm("Queres actualizar este producto?");

        if(!confirmacion) {
            alert("Actualizacion cancelada");
        } else {
            formularioPutProducto(event, producto);
        }
    });
};


async function formularioPutProducto(event, producto) {
    event.stopPropagation(); // Evitamos la propagacion de eventos

    const htmlForm = `
    <hr>
    <form id="putProduct-form" class="form-alta">

        <input type="hidden" name="id" value="${producto.id}">

        <label for="nameProd">Nombre del producto: </label>
        <input type="text" name="nombre" id="nameProd" value="${producto.nombre}" required>

        <label for="imageProd">Imagen del producto: </label>
        <input type="text" name="imagen" id="imageProd" value="${producto.imagen}" required>

        <label for="categoryProd">Categoria del producto: </label>
        <select name="categoria" id="categoryProd">
            <option value="Electric">Electrica</option>
            <option value="Electroacustic">Electroacustica</option>
        </select>

        <label for="priceProd">Precio del producto: </label>
        <input type="number" name="precio" id="priceProd" value="${producto.precio}" required>

        <label for="activeProd">Producto activo: </label>
        <select name="activo" id="activeProd" required>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
        </select>

        <div>
            <input type="submit" value="Actualizar producto">
        </div>
    </form>
    `;

    contenedorForm.innerHTML = htmlForm;

    // Selecciono el formulario de actualizacion
    const updateProductForm = document.getElementById("putProduct-form");

    updateProductForm.addEventListener("submit", event => {
        actualizarProducto(event);
    });
}

// Enviamos los datos del formulario al servidor

async function actualizarProducto(event) {
    event.preventDefault();
    
    // Agarro los datos del formulario (del evento) en un objeto FormData
    const formData = new FormData(event.target);

    // Transformamos el objeto FormData en un objeto JS, porque queremos parsear estos datos a JSON.stringify()
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch("http://localhost:3000/api/products/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            mostrarError(result.message);
            return;
        }

        mostrarExito(result.message);

    } catch (error) {
        console.error(error);

        // Opt 5: Mostramos error de red (en el try...catch de fetch no capturamos error 400 o 500)
        mostrarError("Error de conexion con el servidor");
    }
}

function mostrarError(mensaje) {
    contenedorForm.innerHTML = "";
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje_error">${mensaje}</p>
    `;
}
// TO DO: estas funciones sean mostrarMensaje()
function mostrarExito(mensaje) {
    contenedorForm.innerHTML = "";
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje_exito">${mensaje}</p>
    `;
}
