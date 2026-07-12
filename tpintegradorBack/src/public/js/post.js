const contenedorProducto = document.getElementById("contenedor-productos");
const postProductForm = document.getElementById("postProduct-form");

// Opt: Validamos previamente los datos en el cliente
function validarFormulario(data) {
    const errores = [];

    if (!data.nombre || data.nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres \n");
    }

    if (!data.precio || isNaN(data.precio) || Number(data.precio) < 0) {
        errores.push("El precio debe ser un numero mayor a 0 \n");
    }

    if (!data.categoria) {
        errores.push("Debe seleccionarse una categoria \n");
    }

    return errores;
}

// Opt: Mensaje de exito/error al crear un producto
function mostrarMensaje(tipo, mensaje) {
    contenedorProducto.innerHTML = `
    <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}

postProductForm.addEventListener("submit", async event => {
    event.preventDefault();
    
    const formularioAlta = event.target;
    
    // Obtenemos la data del formulario

    const formData = new FormData(event.target);

    // Parseamos el objeto FormData a un objeto JS normal para enviarlo en el body con JSON.stringify()
    const data = Object.fromEntries(formData.entries());
    
    // Opt: Parseamos precio antes de enviarlo, FormData devuelve todo como strings y el back espera que precio sea numero
    data.precio = Number(data.precio);

    // Hacemos la llamada a la funcion para validar datos del formulario
    const errores = validarFormulario(data);
    if (errores.length > 0) {
        mostrarMensaje("error", errores);
        return; // No pasamos a ejecutar el codigo de abajo
    }

    try {
        // Aca guardamos la respuesta cruda del servidor que es la que nos proporciona el fetch una vez que la promesa devolvio Fulfilled
        const response = await fetch("http://localhost:3000/api/products/", {
            method: "POST", // Metodo de envio
            headers: { // Que tipo de contenido le vas a mandar al servidor | Cabecera
                "Content-Type": "application/json" // Contenido JSON vamos a enviar al servidor
            },
            body: JSON.stringify(data) // El contenido que enviamos | enviado en JSON
        }); // Segundo parametro de fetch es un objeto donde aclaramos que metodo vamos a usar | hay que armar todo el paquete(?

        const result = await response.json();

        // Opt: Manejamos respuestas no ok del servidor
        if (!response.ok) {
            mostrarMensaje("error", result.message);
            return;
        }
        
        // Mostramos el mensaje de exito y reseteamos el form
        const infoProducto = `${result.message} con id ${result.productId}`;
        mostrarMensaje("exito", infoProducto)
        console.log(infoProducto);

        formularioAlta.reset();

    } catch (error) {
        console.error("Error al enviar los datos", error);
    }
});