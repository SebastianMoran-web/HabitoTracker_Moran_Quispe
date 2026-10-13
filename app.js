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

function rellenarDesplegable() {
    const select = document.getElementById("selectHabito");
    select.innerHTML = "";
 
    if (habitos.length === 0) {
        select.innerHTML = `<option value="">Primero crea un hábito</option>`;
        return;
    }
 
    for (const h of habitos) {
        select.innerHTML += `<option value="${h.id}">${h.nombre} (${h.categoria})</option>`;
    }
}

 formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
 
        const habitoId = Number(document.getElementById("selectHabito").value);
        const fecha = document.getElementById("fecha").value;
        const observaciones = document.getElementById("observaciones").value.trim();
        const cumplido = document.getElementById("cumplido").checked;
 
        let valido = true;
        document.getElementById("errorHabito").textContent = "";
        document.getElementById("errorFecha").textContent = "";
 
        if (habitoId === 0) {
            document.getElementById("errorHabito").textContent = "Elige un hábito (créalo antes si no hay ninguno).";
            valido = false;
        }
        if (fecha === "") {
            document.getElementById("errorFecha").textContent = "Elige una fecha.";
            valido = false;
        }
        if (!valido) {
            return;
        }
 
        const registro = {
            id: Date.now(),
            habitoId: habitoId,
            fecha: fecha,
            observaciones: observaciones,
            cumplido: cumplido
        };
        registros.push(registro);
 
        guardarTodo();
        document.getElementById("observaciones").value = "";
        document.getElementById("cumplido").checked = false;
        actualizarEstadisticas();
    });
 