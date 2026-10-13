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
 
       document.getElementById("enlaceSeguimiento").addEventListener("click", (e) => {
        e.preventDefault();
        pintarTabla();
        modal.classList.remove("oculto");   
    });
 
    document.getElementById("btnCerrar").addEventListener("click", () => {
        modal.classList.add("oculto");      
    });
 
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("oculto");
        }
    });

    function nombreDeHabito(habitoId) {
    const habito = habitos.find(h => h.id === habitoId);
    if (habito) {
        return habito.nombre;
    }
    return "(hábito eliminado)";
}
 
function pintarTabla() {
    const cuerpo = document.getElementById("cuerpoTabla");
    cuerpo.innerHTML = "";
 
    if (registros.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="5" class="vacio">Aún no hay registros.</td></tr>`;
    }
 
    for (const r of registros) {
        const clase = r.cumplido ? "ok" : "ko";
        const texto = r.cumplido ? "✓ Cumplido" : "✗ Fallado";
 
        cuerpo.innerHTML += `
            <tr class="fila-${clase}">
                <td>${nombreDeHabito(r.habitoId)}</td>
                <td>${r.fecha}</td>
                <td>${r.observaciones || "—"}</td>
                <td><span class="estado ${clase}">${texto}</span></td>
                <td><button class="btn-cambiar" onclick="toggleCumplido(${r.id})">Cambiar</button></td>
            </tr>`;
    }
 
    const cumplidos = registros.filter(r => r.cumplido).length;
    const fallados = registros.length - cumplidos;
    document.getElementById("resumenTabla").textContent =
        `Resumen: ${cumplidos} cumplidos · ${fallados} fallados`;
}