// ============================
// CONFIGURACIÓN FIREBASE
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyD4GnLJqdCTWjSRInA7WK6hy8jV9Uqd8cc",
  authDomain: "byteroot-75694.firebaseapp.com",
  databaseURL: "https://byteroot-75694-default-rtdb.firebaseio.com",
  projectId: "byteroot-75694",
  storageBucket: "byteroot-75694.appspot.com",
  messagingSenderId: "573793964877",
  appId: "1:573793964877:web:344fb4cdff5cf03c9b9d04"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let usuarioActual = "";

// ============================
// CREAR CASO (USUARIO)
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

  db.ref("casos/" + nuevoCaso.id).set(nuevoCaso);
  document.getElementById("descripcionCaso").value = "";
  mostrarCasosUsuario();
}

// ============================
// MOSTRAR CASOS DEL USUARIO
// ============================
function mostrarCasosUsuario() {
  if (!usuarioActual) return;
  db.ref("casos").on("value", snapshot => {
    let lista = document.getElementById("misCasos");
    if (!lista) return;
    lista.innerHTML = "";

    snapshot.forEach(child => {
      let c = child.val();
      if (c.usuario === usuarioActual) {
        let li = document.createElement("li");
        li.textContent = `Caso #${c.id} - ${c.descripcion} - Estado: ${c.estado}`;
        lista.appendChild(li);
      }
    });
  });
}

// ============================
// MOSTRAR CASOS (ADMIN)
// ============================
function mostrarCasosAdmin() {
  db.ref("casos").on("value", snapshot => {
    let lista = document.getElementById("listaCasos");
    if (!lista) return;
    lista.innerHTML = "";

    snapshot.forEach(child => {
      let c = child.val();
      let li = document.createElement("li");
      li.innerHTML = `#${c.id} - ${c.descripcion} - Estado: ${c.estado}`;
      lista.appendChild(li);
    });
  });
}

// ============================
// TÉCNICOS ONLINE
// ============================
function agregarTecnico(nombre, online = false) {
  db.ref("tecnicos/" + nombre).set({ nombre, online });
}

function mostrarTecnicosOnline() {
  db.ref("tecnicos").on("value", snapshot => {
    let lista = document.getElementById("listaTecnicos");
    if (!lista) return;
    lista.innerHTML = "";

    snapshot.forEach(child => {
      let t = child.val();
      let li = document.createElement("li");
      let bolita = document.createElement("span");
      bolita.style.width = "10px";
      bolita.style.height = "10px";
      bolita.style.borderRadius = "50%";
      bolita.style.display = "inline-block";
      bolita.style.marginRight = "5px";
      bolita.style.backgroundColor = t.online ? "green" : "gray";
      li.appendChild(bolita);
      li.appendChild(document.createTextNode(t.nombre));
      lista.appendChild(li);
    });
  });
}

// ============================
// INICIALIZACIÓN
// ============================
window.onload = function () {
  mostrarCasosUsuario();
  mostrarCasosAdmin();
  mostrarTecnicosOnline();
};