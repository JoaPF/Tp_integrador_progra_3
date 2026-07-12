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

    /*
    // Creo un objeto nativo del formData a partir del formulario del evento
    const formData = new FormData(event.target);

    console.log(formData);

    // Transformo mi objeto nativo FormData en un objeto normal de JS
    const data = Object.fromEntries(formData.entries());

    const idProd = data.idProd;
    */

    try {
        // Opt 3: Guardamos en una variable la URL para no hardcodearla aca
        const response = await fetch(`${urlBase}/${idProd}`);

        const data = await response.json();

        //Opt 4: Mostramos por pantalla el error que nos devuelve el servidor
        if (!response.ok) { 
            mostrarError(data.message);
            return;
        }

        console.log(data.payload[0]);

        const producto = data.payload[0];

        const htmlProducto = `
            <ul>
                <li class="lista-producto">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</p>
                </li>
            </ul>
        `;

        contenedorProductos.innerHTML = htmlProducto;

    } catch (error) {
        console.error(`Error al obtener productos: ${error}`);

        // Opt 5: Mostramos error de red (en el try...catch de fetch no capturamos error 400 o 500)
        mostrarError("Error de conexion con el servidor");
    }
});

function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje_error">${mensaje}</p>
    `;
}
