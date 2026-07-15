const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
        window.location.href = "index.html";
    }

const bienvenidaUsuario = document.getElementById("usuario-bienvenida");

bienvenidaUsuario.innerHTML = `Bienvenido ${usuario}`;

const sectionProductos = document.querySelector(".cards-productos");


async function obtenerProductos() {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();
    
    data.payload.forEach(producto => {
        if (producto.activo === 1) {
        sectionProductos.innerHTML += `
            <div class="card-producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h4>${producto.nombre}</h4>
                <p>$${producto.precio}</p>
                <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}')">
                Agregar al carrito
            </button>
            </div>
        `;
        }
    });
}


// Sumar al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

    const productoExistente = carrito.find(p => p.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${nombre} agregado al carrito`);
    renderizarCarrito();
}

// Dibujar carrito
function renderizarCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("items-carrito");
    const botonTicket = document.querySelector(".imprimir-ticket");

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
        botonTicket.style.display = "none";  // oculta el botón
        return;
    }

    botonTicket.style.display = "block";  // muestra el botón

    contenedor.innerHTML = "";

    carrito.forEach(producto => {
        contenedor.innerHTML += `
            <div class="item-carrito">
                <span>${producto.nombre}</span>
                <span>Cantidad: ${producto.cantidad}</span>
                <span>$${producto.precio * producto.cantidad}</span>
                <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
            </div>
        `;
    });
}

// Eliminar del carrito
function eliminarDelCarrito(id) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    
    const producto = carrito.find(p => p.id === id);
    
    if (producto.cantidad > 1) {
        producto.cantidad--; 
    } else {
        carrito = carrito.filter(p => p.id !== id);
    }
    
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}

// Vaciar carrito
document.querySelector(".vaciar-carrito").addEventListener("click", () => {
    sessionStorage.removeItem("carrito");
    renderizarCarrito();
});


const botonImprimir = document.querySelector(".imprimir-ticket")

botonImprimir.addEventListener("click", imprimirTicket);



function imprimirTicket() {
    let carrito = JSON.parse(sessionStorage.getItem("carrito"));
    console.table(carrito);
    
    
    // Para registrar las ventas a posteriori, creamos un array vacio con idProductos
    let idProductos = [];

    // Gracias al CDN, extraemos la clase jsPDF del objeto global window
    const { jsPDF } = window.jspdf;

    // Creamos una nueva instancia del documento usando la clase jsPDF
    const doc = new jsPDF(); // En doc inicializamos todos los metodos para crear pdfs

    // Definimos el margen superior de 40 en el eje y -> eje vertical, el eje x -> eje hortizontal
    let y = 40;

    // Establecemos el tama;o de 32px para el primer texto
    doc.setFontSize(32);

    // Escribimos el texto ticket compra en la posicion x=80 | y=40
    doc.text("Ticket de compra:", 40, y);

    // Definimos el espacio despues del ticket
    y += 25;

    // Definimos el tama;o de fuente para los productos del ticket
    doc.setFontSize(16);

    // Iteramos el carrito e imprimimos nombre y precio
    carrito.forEach(producto => {
        idProductos.push(producto.id); // Llenamos el array de idProductos para registrar la venta despues

        doc.text(`${producto.nombre}  /  $${producto.precio * producto.cantidad} / Cantidad: ${producto.cantidad} `, 60, y); // Creamos el texto por cada producto

        y += 20; // Incrementamos la posicion vertical para evitar solapamiento
    });


    const precioTotal = carrito.reduce((total, producto) => total + parseInt(producto.precio * producto.cantidad) , 0);

    // A;adimos otro espacio de 10 para separar el precio total de los productos
    y += 10;

    // Establecemos un espacio mas grande para el precio
    doc.setFontSize(24);

    // Escribimos el precio total del ticket
    doc.text(`Total: ${precioTotal}`, 40, y);


    let nombreTicket = `pedido ${usuario}.pdf`

    // Imprimimos el ticket
    doc.save(nombreTicket);



    alert("Imprimiendo ticket");

    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("carrito");

    window.location.href = "index.html";


}


obtenerProductos();
renderizarCarrito();