import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
   apiKey: "AIzaSyDRVyUoL67VArRnvWU4RgcwnHfr3GiiXfU",
   authDomain: "brainroot-c2adb.firebaseapp.com",
   projectId: "brainroot-c2adb",
   storageBucket: "brainroot-c2adb.firebasestorage.app",
   messagingSenderId: "110853360073",
   appId: "1:110853360073:web:6d4d76d5f0ad33fb628018"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const loginDiv = document.getElementById("loginAdmin");
const adminPanel = document.getElementById("adminPanel");
const tecnicoNombreH2 = document.getElementById("tecnicoNombre");

let tecnicoLogueado = null;
let inactivityTimer = null;

// Función para iniciar sesión
btnLogin.addEventListener("click", async ()=>{
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try{
    const userCred = await signInWithEmailAndPassword(auth,email,password);
    tecnicoLogueado = userCred.user;

    // Guardar nombre bonito del técnico
    const nombreTecnico = email.split("@")[0].replace(/\d+/g,'') + " Técnico"; 
    tecnicoNombreH2.textContent = nombreTecnico;

    loginDiv.style.display="none";
    adminPanel.style.display="block";
    localStorage.setItem("tecnicoLogueado", JSON.stringify({uid: tecnicoLogueado.uid, nombre: nombreTecnico, lastActive: Date.now()}));

    mostrarCasos();
    startInactivityTimer();
  }catch(err){
    alert("Error login: "+err.message);
  }
});

// Cerrar sesión
btnLogout.addEventListener("click", async ()=>{
  await cerrarSesion();
});

async function cerrarSesion(){
  await signOut(auth);
  loginDiv.style.display="block";
  adminPanel.style.display="none";
  tecnicoLogueado = null;
  localStorage.removeItem("tecnicoLogueado");
}

// Mantener sesión 2 horas
function startInactivityTimer(){
  if(inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(()=>{ cerrarSesion(); alert("Sesión cerrada por inactividad"); }, 1000*60*60*2);
}

// Detectar actividad del técnico para reiniciar timer
document.body.addEventListener("mousemove", startInactivityTimer);
document.body.addEventListener("keydown", startInactivityTimer);

// Mostrar casos
function mostrarCasos(){
  onSnapshot(collection(db,"casos"), snapshot=>{
    const pendientes = document.getElementById("listaCasosPendientes");
    const completados = document.getElementById("listaCasosCompletados");
    pendientes.innerHTML="";
    completados.innerHTML="";

    snapshot.docs.forEach(docSnap=>{
      const c = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `#${docSnap.id} - ${c.descripcion} - Estado: ${c.estado} - Cliente: ${c.nombre} - Ubicación: ${c.lugar}`;

      if(c.estado==="Pendiente"){
        const btnProceso = document.createElement("button");
        btnProceso.textContent="En Proceso";
        btnProceso.style.backgroundColor="orange";
        btnProceso.onclick = async ()=>{
          await updateDoc(doc(db,"casos",docSnap.id), {
            estado:"En Proceso",
            tecnico: tecnicoNombreH2.textContent
          });
        };
        li.appendChild(btnProceso);
      }
      if(c.estado==="En Proceso"){
        const btnCompleto = document.createElement("button");
        btnCompleto.textContent="Completo";
        btnCompleto.style.backgroundColor="green";
        btnCompleto.onclick = async ()=>{
          await updateDoc(doc(db,"casos",docSnap.id), {estado:"Completo"});
        };
        li.appendChild(btnCompleto);
      }

      if(c.estado==="Completo"){
        completados.appendChild(li);
      } else {
        pendientes.appendChild(li);
      }
    });
  });
}
