document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value.trim();
    
    sessionStorage.setItem("usuario", nombre);
    window.location.href = "productos.html";
});

const usuario = sessionStorage.getItem("usuario");
    if (usuario) {
        window.location.href = "productos.html";
    }