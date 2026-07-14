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
                <button>Agregar al carrito</button>
            </div>
        `;
    });
}



obtenerProductos();