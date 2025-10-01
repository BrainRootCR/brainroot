let usuarioActual = "";
const db = firebase.database();
let casos = [];
let tecnicos = [];

// CREAR CASO
function crearCaso() {
    let usuario = document.getElementById("usuarioName").value.trim();
    let desc = document.getElementById("descripcionCaso").value.trim();
    if(!usuario || !desc) { alert("Debes poner nombre y descripción"); return; }
    usuarioActual = usuario;

    let nuevoCaso = { id: Date.now(), usuario, descripcion: desc, estado:"Pendiente", tecnico:"", calificacion:0 };
    db.ref("casos").push(nuevoCaso);
    document.getElementById("descripcionCaso").value="";
}

// MOSTRAR CASOS DEL USUARIO
db.ref("casos").on("value", snap=>{
    let data = snap.val();
    casos = data ? Object.values(data) : [];
    mostrarCasosUsuario();
});

// TECNICOS ONLINE
db.ref("tecnicos").on("value", snap=>{
    let data = snap.val();
    tecnicos = data ? Object.values(data) : [];
    mostrarTecnicosOnline();
});

function mostrarCasosUsuario() {
    let lista = document.getElementById("misCasos");
    lista.innerHTML = "";
    casos.forEach(c=>{
        if(c.usuario===usuarioActual){
            let li = document.createElement("li");
            let contenido = `Caso #${c.id} - ${c.descripcion} - Estado: ${c.estado}`;
            if(c.estado==="En Proceso") contenido += ` - Técnico: ${c.tecnico}`;
            if(c.estado==="Completo") {
                contenido += `<br>Califica el servicio: <div class="estrellas" id="estrellas-${c.id}">`;
                for(let i=1;i<=5;i++){
                    let marcado = (i<=c.calificacion)?"★":"☆";
                    contenido += `<span class="estrella" data-value="${i}">${marcado}</span>`;
                }
                contenido += `</div>`;
            }
            li.innerHTML = contenido;
            lista.appendChild(li);

            if(c.estado==="Completo"){
                let estrellas = li.querySelectorAll(".estrella");
                estrellas.forEach(s=>{
                    s.addEventListener("click", function(){
                        let valor = parseInt(this.getAttribute("data-value"));
                        c.calificacion = valor;
                        estrellas.forEach((e,index)=>{ e.innerHTML = (index<valor)?"★":"☆"; });
                        db.ref("casos").once("value", snap=>{
                            let data = snap.val();
                            for(let key in data){
                                if(data[key].id===c.id) db.ref("casos/"+key+"/calificacion").set(valor);
                            }
                        });
                    });
                });
            }
        }
    });
}

function mostrarTecnicosOnline() {
    let lista = document.getElementById("listaTecnicos");
    lista.innerHTML = "";
    tecnicos.forEach(t=>{
        let li = document.createElement("li");
        let bolita = document.createElement("div");
        bolita.style.width="15px"; bolita.style.height="15px"; bolita.style.borderRadius="50%";
        bolita.style.backgroundColor = t.online?"green":"gray";
        bolita.style.display="inline-block"; bolita.style.marginRight="5px";
        let nombre = document.createElement("span");
        nombre.textContent = t.nombre;
        li.appendChild(bolita);
        li.appendChild(nombre);
        lista.appendChild(li);
    });
}
