function guardarCookie(nombre, valor) {
    const maxAge = 365 * 24 * 60 * 60;
    const json = JSON.stringify(valor);
    document.cookie = `${nombre}=${encodeURIComponent(json)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}
 
function leerCookie(nombre) {
    try {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [clave, valor] = cookie.split("=");
            if (clave === nombre) {
                return JSON.parse(decodeURIComponent(valor));
            }
        }
        return null;
    } catch (error) {
        console.log("Cookie corrupta:", nombre);
        return null;
    }
}
 
function borrarCookie(nombre) {
    document.cookie = `${nombre}=; max-age=0; path=/`;
}
 

let habitos = leerCookie("habitos") || [];
let registros = leerCookie("registros") || [];
 
function guardarTodo() {
    guardarCookie("habitos", habitos);
    guardarCookie("registros", registros);
}

formHabito.addEventListener("submit", (e) => {
        e.preventDefault();
 
        const nombre = document.getElementById("nombre").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const categoria = document.getElementById("categoria").value;
 
        if (nombre === "") {
            document.getElementById("errorNombre").textContent = "Escribe un nombre para el hábito.";
            return;
        }
        document.getElementById("errorNombre").textContent = "";
 
        const habito = { id: Date.now(), nombre: nombre, descripcion: descripcion, categoria: categoria };
        habitos.push(habito);
 
        guardarTodo();
        formHabito.reset();
        rellenarDesplegable();      
        actualizarEstadisticas();
    });