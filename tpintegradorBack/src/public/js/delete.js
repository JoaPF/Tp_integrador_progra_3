const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
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
        console.error(`Error al obtener productos: ${error}`)
    }
});

function renderizarProducto(producto) {
    const htmlProducto = `
            <ul>
                <li class="lista-producto">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</p>
                    <input type="button" id="deleteProduct-button" value="Eliminar Producto">
                </li>
            </ul>
        `;

    contenedorProductos.innerHTML = htmlProducto;
    
    const deleteProductButton = document.getElementById("deleteProduct-button");

    deleteProductButton.addEventListener("click", event => {
        event.stopPropagation();

        const confirmacion = confirm("Queres eliminar este producto?");

        if(!confirmacion) {
            alert("Eliminacion cancelada");
        } else {
            eliminarProducto(producto.id);
        }
    });
};

// Funcion para realizar una operacion delete
async function eliminarProducto(id) {
    try {
        const response = await fetch(`${urlBase}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        // Opt 6: Manejamos un error no ok
        if (!response.ok) {
            mostrarError(result.message);
            return;
        }

        // Opt 7: En lugar de un alert bloqueante mostramos un mensaje de exito
        mostrarExito(result.message);
        console.log(result.message);

        // Gracias a MostrarExito no hace falta limpiar la pantalla porque lo reemplazamos por un mensaje exitoso
        // contenedorProductos.innerHTML = "" // Limpiamos visualmente el producto que eliminamos de la pantalla

    } catch (error) {
        console.error("Error en la solicitud DELETE: ", error);
        alert("Ocurrio un error al eliminar un producto")
        // Opt 5: Mostramos error de red (en el try...catch de fetch no capturamos error 400 o 500)
        mostrarError("Error de conexion con el servidor");
    }
}

function mostrarExito(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje_exito">${mensaje}</p>
    `;
}
// TO DO: estas funciones sean mostrarMensaje()
function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje_error">${mensaje}</p>
    `;
}