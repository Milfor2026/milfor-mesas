// ===== Vista del personal de Milfor (lista completa por mesa) =====
// La clave se revisa EN EL CELULAR (no hay servidor): sirve para que un invitado no la abra por accidente, no es seguridad real.
(function(){const A=window.MilforApp,C=window.MILFOR_CONFIG,EV=window.MILFOR_EV,BASE=window.MILFOR_BASE,$=id=>document.getElementById(id),m=$("m"),esc=A.esc,norm=A.norm;
A.setLang("es");
$("d").textContent=[C.evento?"Evento "+C.evento:"Evento principal",C.novios,C.fecha].filter(Boolean).join(" · ");
const KEY="milfor-pin-"+(EV||"raiz"),LLEGO="milfor-llego-"+(EV||"raiz");
async function hash(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("milfor:"+t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function evs(){return `<div class="evs">`+[["","Principal"],["a","A"],["b","B"],["c","C"]].map(([k,n])=>`<a href="?e=${k}" class="${k==EV?"on":""}">${n}</a>`).join("")+`</div>`}
function pedirPin(err){m.innerHTML=evs()+`<form class="pin" id="f"><label>Clave del personal</label><input id="pin" type="password" inputmode="numeric" autocomplete="off"><button>Entrar</button>${err?`<div class="err">${err}</div>`:""}</form>`;
 $("pin").focus();$("f").onsubmit=async ev=>{ev.preventDefault();const h=await hash($("pin").value.trim());
  if(h===String(C.pinPersonal||"").toLowerCase()){sessionStorage.setItem(KEY,h);abrir()}else pedirPin("Clave incorrecta.")}}
if(!C.pinPersonal){m.innerHTML=evs()+'<div class="msg">Este evento no tiene clave del personal. Póngala con: python3 preparar.py pin '+(EV||"raiz")+' 1234</div>';return}
if(!window.crypto||!crypto.subtle){m.innerHTML='<div class="msg">Abra esta página con https.</div>';return}
if(sessionStorage.getItem(KEY)===String(C.pinPersonal).toLowerCase())abrir();else pedirPin();
let L=[],vista="mesa",llego={};
function abrir(){try{llego=JSON.parse(localStorage.getItem(LLEGO)||"{}")}catch(e){llego={}}
 const cargar=C.csvUrl?fetch(C.csvUrl).then(x=>x.text()).then(A.parseCSV):fetch(BASE+"invitados.dat?v="+Date.now()).then(x=>{if(!x.ok)throw 0;return x.text()}).then(A.decodificar);
 cargar.then(l=>{L=l.map((g,i)=>Object.assign({id:norm(g.nombre)+"|"+g.mesa+"|"+(g.puesto||"")},g));base()}).catch(()=>{m.innerHTML='<div class="msg">No se pudo cargar la lista.</div>'})}
function base(){m.innerHTML=evs()+`<div class="bar"><input id="b" placeholder="Buscar nombre, grupo o nota" autocomplete="off">
 <button id="vm" class="on">Por mesa</button><button id="va">A–Z</button><button id="pr">🖨 Imprimir</button><button id="sal">Salir</button></div>
 <div class="stats" id="st"></div><div id="lista"></div><div class="nota">“Llegó” se guarda solo en este celular. Página privada del personal: no la comparta con invitados.</div>`;
 $("b").oninput=pintar;$("vm").onclick=()=>{vista="mesa";pintar()};$("va").onclick=()=>{vista="az";pintar()};$("pr").onclick=()=>window.print();
 $("sal").onclick=()=>{sessionStorage.removeItem(KEY);pedirPin()};pintar()}
const fila=(g,conMesa)=>`<tr class="${llego[g.id]?"llego":""}">${conMesa?`<td class="p">${g.mesa}</td>`:""}<td class="p">${g.puesto||"–"}</td><td class="n">${esc(g.nombre)}</td><td>${esc(g.grupo||"")}</td><td><i>${esc(g.nota||"")}</i></td><td class="ll"><input type="checkbox" data-id="${esc(g.id)}" ${llego[g.id]?"checked":""}></td></tr>`;
const cab=conMesa=>`<tr>${conMesa?"<th>MESA</th>":""}<th>PUESTO</th><th>NOMBRE</th><th>GRUPO</th><th>NOTA</th><th class="ll">LLEGÓ</th></tr>`;
function pintar(){$("vm").classList.toggle("on",vista=="mesa");$("va").classList.toggle("on",vista=="az");
 const f=norm($("b").value),vis=L.filter(g=>!f||norm(g.nombre+" "+(g.grupo||"")+" "+(g.nota||"")).includes(f));
 const n=L.filter(g=>llego[g.id]).length;$("st").textContent=`${L.length} invitados · ${new Set(L.map(g=>g.mesa)).size} mesas · llegaron ${n}`+(f?` · mostrando ${vis.length}`:"");
 let h="";
 if(vista=="az"){h=`<div class="mesa"><h3>Todos (A–Z)<small>${vis.length}</small></h3><table>${cab(true)}${vis.slice().sort((a,b)=>norm(a.nombre)<norm(b.nombre)?-1:1).map(g=>fila(g,true)).join("")}</table></div>`}
 else{const ms=[...new Set(C.mesas.map(t=>t.mesa).concat(L.map(g=>g.mesa)))].sort((a,b)=>a-b);
  ms.forEach(k=>{const gs=vis.filter(g=>g.mesa==k).sort((a,b)=>(a.puesto||99)-(b.puesto||99));if(!gs.length&&f)return;const t=A.mesaInfo(k),tot=L.filter(g=>g.mesa==k).length;
   h+=`<div class="mesa"><h3>Mesa ${k}${t.nombre?" · "+esc(t.nombre):""}<small>${t.forma} · ${tot}/${t.asientos} sillas</small></h3><table>${cab(false)}${gs.map(g=>fila(g,false)).join("")||'<tr><td colspan="6"><i>Sin invitados</i></td></tr>'}</table></div>`})}
 $("lista").innerHTML=h||'<div class="msg">Nadie coincide con la búsqueda.</div>';
 $("lista").querySelectorAll("input[type=checkbox]").forEach(c=>c.onchange=()=>{if(c.checked)llego[c.dataset.id]=1;else delete llego[c.dataset.id];localStorage.setItem(LLEGO,JSON.stringify(llego));pintar()})}
})();
