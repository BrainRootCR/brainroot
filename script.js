// ============================
// VARIABLES GLOBALES
// ============================
let usuarioActual = "";
let casos = JSON.parse(localStorage.getItem("casos")) || [];
let tecnicos = JSON.parse(localStorage.getItem("tecnicos")) || [];

// ============================
// FUNCIONES CASOS
// ============================
function crearCaso() {
    let usuario = document.getElementById("usuarioName").value.trim();
    let desc = document.getElementById("descripcionCaso").value.trim();
    if (!usuario || !desc) {
        alert("Debes poner nombre y descripción");
        return;
    }
    usuarioActual = usuario;

    let nuevoCaso = {
        id: Date.now(),
        usuario: usuario,
        descripcion: desc,
        estado: "Pendiente",
        tecnico: "",
        calificacion: 0
    };
    casos.push(nuevoCaso);
    localStorage.setItem("casos", JSON.stringify(casos));
    document.getElementById("descripcionCaso").value = "";
    mostrarCasosUsuario();
}

function mostrarCasosUsuario() {
    casos = JSON.parse(localStorage.getItem("casos")) || [];
    let lista = document.getElementById("misCasos");
    lista.innerHTML = "";

    casos.forEach(c => {
        if (c.usuario === usuarioActual) {
            let li = document.createElement("li");
            let contenido = `Caso #${c.id} - ${c.descripcion} - Estado: ${c.estado}`;

            if (c.estado === "En Proceso") {
                contenido += ` - Revisado por: ${c.tecnico}`;
                mostrarNotificacion(`Tu caso #${c.id} está siendo revisado por ${c.tecnico}`);
            }

            if (c.estado === "Completo") {
                contenido += `<br>Califica el servicio: `;
                contenido += `<div class="estrellas" id="estrellas-${c.id}">`;
                for (let i = 1; i <= 5; i++) {
                    let marcado = (i <= c.calificacion) ? "★" : "☆";
                    contenido += `<span class="estrella" data-value="${i}">${marcado}</span>`;
                }
                contenido += `</div>`;
            }

            li.innerHTML = contenido;
            lista.appendChild(li);

            if (c.estado === "Completo") {
                let estrellas = li.querySelectorAll(".estrella");
                estrellas.forEach(s => {
                    s.addEventListener("click", function () {
                        let valor = parseInt(this.getAttribute("data-value"));
                        c.calificacion = valor;
                        estrellas.forEach((e, index) => {
                            e.innerHTML = (index < valor) ? "★" : "☆";
                        });
                        localStorage.setItem("casos", JSON.stringify(casos));
                    });
                });
            }
        }
    });
}

// ============================
// FUNCIONES NOTIFICACIÓN
// ============================
function mostrarNotificacion(mensaje) {
    let bubble = document.getElementById("notifBubble");
    bubble.textContent = mensaje;
    bubble.style.display = "block";
    setTimeout(() => { bubble.style.display = "none"; }, 5000);
}

// ============================
// FUNCIONES TÉCNICOS ONLINE
// ============================
function agregarTecnico(nombre, online = false) {
    // Evita duplicados
    if (!tecnicos.find(t => t.nombre === nombre)) {
        tecnicos.push({ nombre: nombre, online: online });
        localStorage.setItem("tecnicos", JSON.stringify(tecnicos));
    }
}

function setTecnicoEstado(nombre, estado) {
    let tecnico = tecnicos.find(t => t.nombre === nombre);
    if (tecnico) {
        tecnico.online = estado;
        localStorage.setItem("tecnicos", JSON.stringify(tecnicos));
    }
}

function mostrarTecnicosOnline() {
    tecnicos = JSON.parse(localStorage.getItem("tecnicos")) || [];
    let lista = document.getElementById("listaTecnicos");
    lista.innerHTML = "";

    tecnicos.forEach(t => {
        let li = document.createElement("li");

        let bolita = document.createElement("div");
        bolita.style.backgroundColor = t.online ? "green" : "gray";

        let nombre = document.createElement("span");
        nombre.textContent = t.nombre;

        li.appendChild(bolita);
        li.appendChild(nombre);
        lista.appendChild(li);
    });
}

// ============================
// ACTUALIZACIÓN AUTOMÁTICA
// ============================
setInterval(() => {
    if (usuarioActual) mostrarCasosUsuario();
    mostrarTecnicosOnline();
}, 2000);

// ============================
// INICIALIZACIÓN
// ============================
window.onload = function () {
    let usuarioInput = document.getElementById("usuarioName").value.trim();
    if (usuarioInput) usuarioActual = usuarioInput;
    mostrarCasosUsuario();
    mostrarTecnicosOnline();
}
