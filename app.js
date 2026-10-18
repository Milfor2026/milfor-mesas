(function(){
const C=(typeof window!="undefined"&&window.MILFOR_CONFIG)||(typeof global!="undefined"&&global.MILFOR_CONFIG)||{mesas:[],elementos:[]};
const norm=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
// CSV: columnas nombre,mesa[,puesto]. Acepta coma o punto y coma. Si hay encabezado, usa los nombres de columna.
function parseCSV(t){const rows=[];let ix={nombre:0,mesa:1,puesto:2};
 t.replace(/^\uFEFF/,"").replace(/\r/g,"").split("\n").forEach((l,i)=>{if(!l.trim())return;
 const p=[];let c="",q=false;for(const ch of l){if(ch=='"')q=!q;else if((ch==","||ch==";")&&!q){p.push(c);c=""}else c+=ch}p.push(c);
 if(i==0&&norm(p[0])=="nombre"){const h=p.map(norm);ix={nombre:h.indexOf("nombre"),mesa:h.indexOf("mesa"),puesto:h.indexOf("puesto")};return}
 const pu=ix.puesto>=0?parseInt(p[ix.puesto]):NaN;
 rows.push({nombre:(p[ix.nombre]||"").trim(),mesa:parseInt(p[ix.mesa]),puesto:pu>0?pu:null})});
 return rows.filter(r=>r.nombre&&r.mesa)}
function buscar(lista,q){const n=norm(q);if(n.length<2)return[];const w=n.split(" ");
 const ex=lista.filter(g=>norm(g.nombre)==n);if(ex.length)return ex;
 return lista.filter(g=>{const x=norm(g.nombre);return w.every(p=>x.includes(p))})}
const mesaInfo=m=>{const t=C.mesas.find(x=>x.mesa==m)||{mesa:m};return Object.assign({asientos:C.asientosPorDefecto||10,forma:"redonda"},t)};
// Posiciones de sillas en el dibujo de cerca. Arriba = lado de la tarima.
// Puesto 1 = el del lado de la tarima; luego sentido de las agujas del reloj.
// Mesa cuadrada: sillas por lado [arriba(tarima), derecha, abajo, izquierda]. Lo que sobra va a arriba, abajo, derecha.
function lados(N){const b=Math.floor(N/4),r=N%4;return [b+(r>0),b+(r>2),b+(r>1),b]}
function sillas(t){const N=Math.max(1,t.asientos|0);
 if(t.forma=="rectangular"){const k=Math.ceil(N/2),b=N-k,sp=42,w=Math.max(k,1)*sp,h=58,W=Math.max(300,w+70),cx=W/2,cy=40+30+h/2+6;
  const s=[];for(let i=0;i<k;i++)s.push({n:i+1,x:cx-w/2+sp/2+i*sp,y:cy-h/2-22});
  const wb=b*sp;for(let i=0;i<b;i++)s.push({n:k+i+1,x:cx+wb/2-sp/2-i*sp,y:cy+h/2+22});
  return {W,H:cy+h/2+22+16+34,cx,cy,mesa:{w,h},s,r:15}}
 if(t.forma=="cuadrada"){const L=lados(N),m=Math.max(...L,1),sp=42,S=Math.max(110,m*sp+16),d=22,W=Math.max(300,S+2*d+2*15+40),cx=W/2,cy=34+15+d+S/2+6,h=S/2;
  const s=[];let n=1;const off=(k,i)=>(i-(k-1)/2)*(S/k>sp?S/k:sp);
  for(let i=0;i<L[0];i++)s.push({n:n++,x:cx+off(L[0],i),y:cy-h-d});        // arriba (tarima): izq→der
  for(let i=0;i<L[1];i++)s.push({n:n++,x:cx+h+d,y:cy+off(L[1],i)});        // derecha: arriba→abajo
  for(let i=0;i<L[2];i++)s.push({n:n++,x:cx-off(L[2],i),y:cy+h+d});        // abajo: der→izq
  for(let i=0;i<L[3];i++)s.push({n:n++,x:cx-h-d,y:cy-off(L[3],i)});        // izquierda: abajo→arriba
  return {W,H:cy+h+d+15+38,cx,cy,mesa:{w:S,h:S},s,r:15}}
 const R=Math.max(80,N*36/(2*Math.PI)),r=N>14?12:15,W=Math.max(300,2*R+2*r+40),cx=W/2,cy=34+r+R+6;
 const s=[];for(let i=0;i<N;i++){const a=-Math.PI/2+i*2*Math.PI/N;s.push({n:i+1,x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)})}
 return {W,H:cy+R+r+38,cx,cy,mesa:{r:R-r-14},s,r}}
function deCerca(t,p){const g=sillas(t),F="Georgia";
 let s=`<svg class="cerca" viewBox="0 0 ${g.W.toFixed(0)} ${g.H.toFixed(0)}" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="${g.W-2}" height="${g.H-2}" rx="8" fill="#fff"/>`;
 const fr=C.frente||"TARIMA";s+=`<rect x="${g.cx-70}" y="6" width="140" height="22" rx="11" fill="#0f1f3d"/><text x="${g.cx}" y="21.5" font-size="12" text-anchor="middle" fill="#fff" font-family="${F}" letter-spacing="1">▲ ${esc(fr)}</text>`;
 if(C.atras)s+=`<text x="${g.cx}" y="${g.H-10}" font-size="11" text-anchor="middle" fill="#8a8f9c" font-family="${F}" letter-spacing="1">${esc(C.atras)} ▼</text>`;
 if(g.mesa.r)s+=`<circle cx="${g.cx}" cy="${g.cy}" r="${g.mesa.r}" fill="#f4ecd8" stroke="#c9a24a" stroke-width="2"/>`;
 else s+=`<rect x="${g.cx-g.mesa.w/2}" y="${g.cy-g.mesa.h/2}" width="${g.mesa.w}" height="${g.mesa.h}" rx="6" fill="#f4ecd8" stroke="#c9a24a" stroke-width="2"/>`;
 s+=`<text x="${g.cx}" y="${g.cy-3}" font-size="15" text-anchor="middle" fill="#0f1f3d" font-family="${F}" font-weight="bold">Mesa ${t.mesa}</text><text x="${g.cx}" y="${g.cy+15}" font-size="12" text-anchor="middle" fill="#8a6a24" font-family="${F}">${p?"Tu puesto: "+p:"★ Tu mesa"}</text>`;
 g.s.forEach(c=>{const on=c.n==p;
  s+=`<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${on?g.r+3:g.r}" fill="${on?'#c9a24a':'#fff'}" stroke="${on?'#0f1f3d':'#c9a24a'}" stroke-width="${on?3:1.5}"/><text x="${c.x.toFixed(1)}" y="${(c.y+4.5).toFixed(1)}" font-size="${on?15:13}" text-anchor="middle" fill="${on?'#fff':'#0f1f3d'}" font-family="${F}" font-weight="bold">${c.n}</text>`});
 return s+'</svg>'}
function plano(m){let s='<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="396" height="496" fill="#fff" stroke="#0f1f3d"/>';
 C.elementos.forEach(e=>{s+=`<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="6" fill="${e.oscuro?'#0f1f3d':e.pista?'#f4ecd8':e.entrada?'#c9a24a':'#33456b'}"/><text x="${e.x+e.w/2}" y="${e.y+e.h/2+4}" font-size="11" text-anchor="middle" fill="${e.pista?'#8a6a24':'#fff'}" font-family="Georgia">${e.texto}</text>`});
 C.mesas.forEach(t=>{const on=t.mesa==m,f=on?'#c9a24a':'#fff',st=on?'#0f1f3d':'#c9a24a',sw=on?3:2;
 if(t.forma=="rectangular"){const w=on?76:64,h=on?40:34;s+=`<rect x="${t.x-w/2}" y="${t.y-h/2}" width="${w}" height="${h}" rx="5" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`}
 else if(t.forma=="cuadrada"){const w=on?52:44;s+=`<rect x="${t.x-w/2}" y="${t.y-w/2}" width="${w}" height="${w}" rx="5" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`}
 else s+=`<circle cx="${t.x}" cy="${t.y}" r="${on?30:24}" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`;
 s+=`<text x="${t.x}" y="${t.y+6}" font-size="${on?20:16}" text-anchor="middle" fill="${on?'#fff':'#0f1f3d'}" font-family="Georgia" font-weight="bold">${t.mesa}</text>`;
 if(on)s+=`<text x="${t.x}" y="${t.y-38}" font-size="12" text-anchor="middle" fill="#c9a24a" font-family="Georgia">★ Tu mesa</text>`});
 return s+'</svg>'}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function mostrar(g){const t=mesaInfo(g.mesa),nom=t.nombre?` · ${esc(t.nombre)}`:"";
 const okP=g.puesto&&g.puesto<=t.asientos;
 // Sin puesto (columna vacía o inexistente): solo la mesa, con la mesa resaltada y ninguna silla marcada.
 if(!g.puesto)return `<div class="card"><div>Hola, <b>${esc(g.nombre)}</b></div>`+
 `<div class="lug"><div class="box solo"><small>TU MESA</small><div class="num">${g.mesa}</div></div></div>`+
 `<div class="tn">Mesa ${g.mesa}${nom}</div>`+
 deCerca(t,null)+`<div class="msg">Puedes sentarte en cualquier silla de tu mesa.</div>`+
 `<div class="sub">Ubicación de tu mesa en el salón</div>${plano(g.mesa)}<div class="msg">La mesa resaltada en dorado es la tuya. ¡Disfruta el evento!</div></div>`;
 return `<div class="card"><div>Hola, <b>${esc(g.nombre)}</b></div>`+
 `<div class="lug"><div class="box"><small>MESA</small><div class="num">${g.mesa}</div></div><div class="box pu"><small>PUESTO</small><div class="num">${g.puesto}</div></div></div>`+
 `<div class="tn">Mesa ${g.mesa}${nom}</div>`+
 (okP?deCerca(t,g.puesto)+`<div class="msg">Tu silla es la dorada. El puesto 1 es el que mira hacia la ${esc((C.frente||"tarima").toLowerCase())} y los demás siguen como las agujas del reloj.</div>`:"")+
 `<div class="sub">Ubicación de tu mesa en el salón</div>${plano(g.mesa)}<div class="msg">¡Disfruta el evento!</div></div>`}
if(typeof module!="undefined"){module.exports={lados,norm,parseCSV,buscar,sillas,mesaInfo,deCerca,mostrar};return}
if(C.evento){const e=document.createElement("div");e.textContent="Evento "+C.evento;e.setAttribute("style","position:fixed;top:8px;right:8px;font:600 11px/1 Georgia,serif;letter-spacing:1px;color:#0f1f3d;background:#c9a24a;border-radius:10px;padding:5px 8px;opacity:.85;z-index:9");document.body.appendChild(e);document.title+=" · Evento "+C.evento}
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
