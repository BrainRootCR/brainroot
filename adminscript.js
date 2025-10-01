const auth = firebase.auth();
const db = firebase.database();

let adminActual = "";
let casos = [];

// LOGIN
function login() {
    let email = document.getElementById("adminUser").value.trim();
    let pass = document.getElementById("adminPass").value.trim();
    auth.signInWithEmailAndPassword(email, pass)
      .then(cred => {
        adminActual = cred.user.email;
        mostrarPanel();
        setTecnicoOnline(adminActual, true);
      })
      .catch(err => alert("Usuario o contraseña incorrectos"));
}

auth.onAuthStateChanged(user => {
    if (user) {
        adminActual = user.email;
        mostrarPanel();
        setTecnicoOnline(adminActual, true);
    }
});

// PANEL
function mostrarPanel() {
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
    document.getElementById("nombreAdmin").textContent = adminActual;
    refrescarPantalla();
}

function cerrarSesion() {
    auth.signOut();
    setTecnicoOnline(adminActual, false);
    adminActual = "";
    document.getElementById("panel").style.display = "none";
    document.getElementById("login").style.display = "block";
}

// CASOS
function refrescarPantalla() {
    db.ref("casos").once("value", snap => {
        casos = snap.val() ? Object.values(snap.val()) : [];
        mostrarCasos();
        mostrarCompletados();
        mostrarReseñas();
    });
}

function mostrarCasos() {
    let lista = document.getElementById("casosAdmin");
    lista.innerHTML = "";
    casos.forEach(c => {
        if(c.estado !== "Completo") {
            let item = document.createElement("li");
            item.innerHTML = `Caso #${c.id} - ${c.usuario} - ${c.descripcion} <span>(${c.estado})</span>
            <button onclick="cambiarEstado(${c.id},'En Proceso')">En Proceso</button>
            <button onclick="cambiarEstado(${c.id},'Completo')">Completo</button>
            <button onclick="eliminarCaso(${c.id})">Eliminar</button>`;
            lista.appendChild(item);
        }
    });
}

function cambiarEstado(id, estado) {
    db.ref("casos").once("value", snap => {
        let data = snap.val();
        for(let key in data) {
            if(data[key].id === id) {
                data[key].estado = estado;
                if(estado!=="Pendiente") data[key].tecnico = adminActual;
                db.ref("casos/"+key).set(data[key]);
            }
        }
        refrescarPantalla();
    });
}

function eliminarCaso(id) {
    if(confirm("⚠️ Vas a eliminar este caso")) {
        db.ref("casos").once("value", snap => {
            let data = snap.val();
            for(let key in data) {
                if(data[key].id === id) db.ref("casos/"+key).remove();
            }
            refrescarPantalla();
        });
    }
}

function mostrarCompletados() {
    let lista = document.getElementById("casosCompletados");
    lista.innerHTML = "";
    let completos = casos.filter(c=>c.estado==="Completo");
    document.getElementById("contadorCompletos").textContent = completos.length;
    completos.forEach(c=>{
        let item = document.createElement("li");
        let estrellas = c.calificacion>0 ? "⭐".repeat(c.calificacion) : "Pendiente";
        item.textContent = `Caso #${c.id} - ${c.usuario} - Técnico: ${c.tecnico || "-"} - Calificación: ${estrellas}`;
        lista.appendChild(item);
    });
}

function mostrarReseñas() {
    let lista = document.getElementById("reseñasAdmin");
    lista.innerHTML = "";
    casos.forEach(c=>{
        if(c.calificacion>0) lista.innerHTML += `<li>${c.usuario} calificó ${c.calificacion} ⭐</li>`;
    });
}

// ELIMINAR TODO
function eliminarTodosCasos() {
    if(confirm("⚠️ Vas a eliminar todos los casos y reseñas")) {
        db.ref("casos").remove();
        refrescarPantalla();
    }
}

// TECNICOS ONLINE
function setTecnicoOnline(nombre, estado) {
    db.ref("tecnicos/"+nombre.replace("@","_")).set({nombre, online: estado});
}
