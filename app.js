(function(){
const C=window.MILFOR_CONFIG;
const norm=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
function parseCSV(t){const rows=[];t.replace(/\r/g,"").split("\n").forEach((l,i)=>{if(!l.trim())return;
 const p=[];let c="",q=false;for(const ch of l){if(ch=='"')q=!q;else if((ch==","||ch==";")&&!q){p.push(c);c=""}else c+=ch}p.push(c);
 if(i==0&&norm(p[0])=="nombre")return;rows.push({nombre:p[0].trim(),mesa:parseInt(p[1])})});return rows.filter(r=>r.nombre&&r.mesa)}
function buscar(lista,q){const n=norm(q);if(n.length<2)return[];const w=n.split(" ");
 const ex=lista.filter(g=>norm(g.nombre)==n);if(ex.length)return ex;
 return lista.filter(g=>{const x=norm(g.nombre);return w.every(p=>x.includes(p))})}
function plano(m){let s='<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="396" height="496" fill="#fff" stroke="#0f1f3d"/>';
 C.elementos.forEach(e=>{s+=`<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="6" fill="${e.oscuro?'#0f1f3d':e.pista?'#f4ecd8':e.entrada?'#c9a24a':'#33456b'}"/><text x="${e.x+e.w/2}" y="${e.y+e.h/2+4}" font-size="11" text-anchor="middle" fill="${e.pista?'#8a6a24':'#fff'}" font-family="Georgia">${e.texto}</text>`});
 C.mesas.forEach(t=>{const on=t.mesa==m;s+=`<circle cx="${t.x}" cy="${t.y}" r="${on?30:24}" fill="${on?'#c9a24a':'#fff'}" stroke="${on?'#0f1f3d':'#c9a24a'}" stroke-width="${on?3:2}"/><text x="${t.x}" y="${t.y+6}" font-size="${on?20:16}" text-anchor="middle" fill="${on?'#fff':'#0f1f3d'}" font-family="Georgia" font-weight="bold">${t.mesa}</text>`;
 if(on)s+=`<text x="${t.x}" y="${t.y-38}" font-size="12" text-anchor="middle" fill="#c9a24a" font-family="Georgia">★ Tu mesa</text>`});
 return s+'</svg>'}
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function mostrar(g){const t=C.mesas.find(x=>x.mesa==g.mesa)||{};
 return `<div class="card"><div>Hola, <b>${esc(g.nombre)}</b></div><div class="msg">Tu mesa es la</div><div class="num">${g.mesa}</div><div>${esc(t.nombre||"")}</div>${plano(g.mesa)}<div class="msg">La mesa resaltada en dorado es la tuya. ¡Disfruta el evento!</div></div>`}
if(typeof module!="undefined"){module.exports={norm,parseCSV,buscar};return}
document.getElementById("b").textContent=C.bienvenida||"¡Bienvenidos!";document.getElementById("t").textContent=C.novios?((C.titulo?C.titulo+" ":"")+C.novios):(C.titulo||"");document.getElementById("d").textContent=C.fecha+(C.lugar?" · "+C.lugar:"");
const q=document.getElementById("q"),r=document.getElementById("r");let L=[];
function upd(){const res=buscar(L,q.value);
 if(norm(q.value).length<2){r.innerHTML="";return}
 if(!res.length){r.innerHTML='<div class="msg">No encontramos ese nombre. Revisa la ortografía o pregunta al personal de Milfor.</div>';return}
 if(res.length==1){r.innerHTML=mostrar(res[0]);return}
 r.innerHTML='<div class="msg">Hay varias coincidencias, elige tu nombre:</div>'+res.map((g,i)=>`<button class="op" data-i="${i}">${esc(g.nombre)}</button>`).join("");
 r.querySelectorAll("button").forEach(b=>b.onclick=()=>{const g=res[b.dataset.i];q.value=g.nombre;r.innerHTML=mostrar(g)})}
q.oninput=upd;
fetch((C.csvUrl||"invitados.csv")+(C.csvUrl?"":"?v="+Date.now())).then(x=>x.text()).then(t=>{L=parseCSV(t);
 const n=new URLSearchParams(location.search).get("n");if(n){q.value=n;}upd()}).catch(()=>{r.innerHTML='<div class="msg">No se pudo cargar la lista de invitados.</div>'});
})();
