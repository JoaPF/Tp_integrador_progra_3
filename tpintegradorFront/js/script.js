const sectionProductos = document.querySelector(".cards-productos");

async function obtenerProductos() {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();
    
    data.payload.forEach(producto => {
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

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }

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



obtenerProductos();
renderizarCarrito();