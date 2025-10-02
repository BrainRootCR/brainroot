import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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

const enviar = document.getElementById("enviarCaso");
const misCasos = document.getElementById("misCasos");
const notif = document.getElementById("notifBubble");
const tecnicosOnline = document.getElementById("tecnicosOnline");

let usuarioActual = "";

enviar.addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if(!nombre || !ubicacion || !descripcion){ alert("Completa todos los campos"); return; }

    usuarioActual = nombre;

    await addDoc(collection(db, "casos"), {
        usuario: nombre,
        ubicacion,
        descripcion,
        estado: "Pendiente",
        tecnico: "",
        fecha: new Date(),
        calificacion: 0
    });

    notif.textContent = "✅ Caso enviado";
    notif.style.display = "block";
    setTimeout(() => { notif.style.display = "none"; }, 3000);

    document.getElementById("nombre").value = "";
    document.getElementById("ubicacion").value = "";
    document.getElementById("descripcion").value = "";
});

// Mostrar casos en tiempo real
onSnapshot(collection(db, "casos"), (snapshot) => {
    misCasos.innerHTML = "";
    snapshot.docs.forEach(docu => {
        const c = docu.data();
        const li = document.createElement("li");
        li.innerHTML = `<strong>#${docu.id}</strong> - ${c.descripcion} - Estado: <span style="color:${c.estado==='En Proceso'?'orange':c.estado==='Completo'?'green':'black'}">${c.estado}</span> ${c.tecnico ? `- Atendido por ${c.tecnico}` : ''}`;
        misCasos.appendChild(li);
    });
});

// Mostrar técnicos online
onSnapshot(collection(db, "Tecnicos"), snapshot => {
    tecnicosOnline.innerHTML = "";
    snapshot.docs.forEach(t => {
        const data = t.data();
        const li = document.createElement("li");
        const bolita = document.createElement("span");
        bolita.style.width = "12px";
        bolita.style.height = "12px";
        bolita.style.borderRadius = "50%";
        bolita.style.display = "inline-block";
        bolita.style.marginRight = "5px";
        bolita.style.backgroundColor = data.online ? "green" : "gray";

        li.appendChild(bolita);
        li.appendChild(document.createTextNode(data.nombre));
        tecnicosOnline.appendChild(li);
    });
});
