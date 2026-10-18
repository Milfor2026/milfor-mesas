(function(){
const C=(typeof window!="undefined"&&window.MILFOR_CONFIG)||(typeof global!="undefined"&&global.MILFOR_CONFIG)||{mesas:[],elementos:[]};
const norm=s=>(s||"").replace(/['’]/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9ñ ]+/g," ").replace(/\s+/g," ").trim();
// CSV: columnas nombre,mesa[,puesto][,grupo][,nota]. Acepta coma o punto y coma. Si hay encabezado, usa los nombres de columna.
function parseCSV(t){const rows=[];let ix={nombre:0,mesa:1,puesto:2,grupo:3,nota:4};
 t.replace(/^\uFEFF/,"").replace(/\r/g,"").split("\n").forEach((l,i)=>{if(!l.trim())return;
 const p=[];let c="",q=false;for(const ch of l){if(ch=='"')q=!q;else if((ch==","||ch==";")&&!q){p.push(c);c=""}else c+=ch}p.push(c);
 if(i==0&&norm(p[0])=="nombre"){const h=p.map(norm);ix={nombre:h.indexOf("nombre"),mesa:h.indexOf("mesa"),puesto:h.indexOf("puesto"),grupo:h.indexOf("grupo"),nota:h.indexOf("nota")};return}
 const pu=ix.puesto>=0?parseInt(p[ix.puesto]):NaN,cel=k=>ix[k]>=0?(p[ix[k]]||"").trim():"";
 const g={nombre:(p[ix.nombre]||"").trim(),mesa:parseInt(p[ix.mesa]),puesto:pu>0?pu:null};
 if(cel("grupo"))g.grupo=cel("grupo");if(cel("nota"))g.nota=cel("nota");rows.push(g)});
 return rows.filter(r=>r.nombre&&r.mesa)}
// Archivo invitados.dat: la lista codificada (ofuscada, NO cifrada) que genera preparar.py.
const CLAVE="Milfor·mesas";
function decodificar(b64){const bin=(typeof atob=="function")?atob(b64.trim()):Buffer.from(b64.trim(),"base64").toString("binary");
 const k=new TextEncoder().encode(CLAVE),u=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i)^k[i%k.length]^((i*7)&255);
 return JSON.parse(new TextDecoder().decode(u)).map(r=>{const g={nombre:r[0],mesa:r[1],puesto:r[2]||null};if(r[3])g.grupo=r[3];if(r[4])g.nota=r[4];return g})}
// Apodos comunes → nombre(s) completo(s)
const APODOS={pepe:["jose"],pepa:["josefa"],pepito:["jose"],paco:["francisco"],pancho:["francisco"],curro:["francisco"],paquita:["francisca"],
 lupe:["guadalupe"],lupita:["guadalupe"],chema:["jose maria"],josema:["jose maria"],chelo:["consuelo"],concha:["concepcion"],conchita:["concepcion"],
 nacho:["ignacio"],lola:["dolores"],lolita:["dolores"],charo:["rosario"],chayo:["rosario"],manolo:["manuel"],manu:["manuel"],quique:["enrique"],
 tono:["antonio"],tonio:["antonio"],memo:["guillermo"],guille:["guillermo"],beto:["alberto","roberto","humberto"],chucho:["jesus"],chuy:["jesus"],
 pili:["pilar"],maite:["maria teresa"],tere:["teresa"],lucho:["luis"],poncho:["alfonso"],rafa:["rafael"],fer:["fernando","fernanda"],
 alex:["alejandro","alejandra"],ale:["alejandro","alejandra"],dani:["daniel","daniela"],gabi:["gabriel","gabriela"],vale:["valentina","valeria"],
 sofi:["sofia"],juanma:["juan manuel"],juanca:["juan carlos"],nico:["nicolas"],santi:["santiago"],javi:["javier"],edu:["eduardo"],isa:["isabel"],
 pato:["patricia","patricio"],paty:["patricia"],nati:["natalia"],caro:["carolina"],cata:["catalina"],mari:["maria"],majo:["maria jose"],
 tina:["cristina","valentina"],cris:["cristina","cristian"],toni:["antonio"],tomi:["tomas"],seba:["sebastian"],sebas:["sebastian"],
 rigo:["rigoberto"],chepe:["jose"],licha:["alicia"],nena:[],
 mike:["michael","miguel"],bob:["robert","roberto"],bill:["william"],jim:["james"],jimmy:["james"],tom:["thomas","tomas"],kate:["katherine","catalina"],liz:["elizabeth","isabel"]};
const pals=q=>norm(q).split(" ").filter(Boolean);
// token coincide si alguna palabra del nombre empieza con él (sirve para nombre o apellido)
const empieza=(x,t)=>(" "+x).includes(" "+t);
function coincide(x,w){return w.every(t=>empieza(x,t)||(APODOS[t]||[]).some(a=>empieza(x,a)))}
function buscar(lista,q){const n=norm(q);if(n.length<2)return[];const w=pals(q);
 const ex=lista.filter(g=>norm(g.nombre)==n);if(ex.length)return ex;
 return lista.filter(g=>coincide(norm(g.nombre),w))}
// distancia de edición (con letras cambiadas de lugar)
function dist(a,b){const m=a.length,n=b.length,d=[];for(let i=0;i<=m;i++){d[i]=[i];for(let j=1;j<=n;j++)d[i][j]=i?0:j}
 for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){const c=a[i-1]==b[j-1]?0:1;d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);
  if(i>1&&j>1&&a[i-1]==b[j-2]&&a[i-2]==b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1)}return d[m][n]}
const tol=t=>t.length<=3?0:t.length<=5?1:2;
// Sugerencias "¿Quisiste decir…?": cada palabra escrita se parece a alguna palabra del nombre (o a su comienzo)
function sugerir(lista,q,max){const w=pals(q);if(!w.length)return[];const out=[];
 lista.forEach(g=>{const ws=norm(g.nombre).split(" ");let tot=0;
  for(const t of w){let b=99;for(const x of ws){b=Math.min(b,dist(t,x));if(x.length>t.length)b=Math.min(b,dist(t,x.slice(0,t.length))+0.5)}
   if(b>tol(t))return;tot+=b}
  out.push({g,tot})});
 out.sort((a,b)=>a.tot-b.tot);const seen=new Set();
 return out.filter(o=>{const k=norm(o.g.nombre)+o.g.mesa+o.g.puesto;if(seen.has(k))return false;seen.add(k);return true}).slice(0,max||3).map(o=>o.g)}
const MAX=5,MIN=3;
// Qué mostrar para lo que escribió el invitado
function resolver(lista,q){const n=norm(q);if(!n)return{tipo:"vacio",items:[]};if(n.replace(/ /g,"").length<MIN)return{tipo:"corto",items:[]};
 const r=buscar(lista,q);if(r.length==1)return{tipo:"uno",items:r};if(r.length>MAX)return{tipo:"muchos",items:[]};if(r.length)return{tipo:"varios",items:r};
 const s=sugerir(lista,q,3);return s.length?{tipo:"sugerencias",items:s}:{tipo:"nada",items:[]}}
// Pista para distinguir nombres repetidos
function pista(g,lista){const rep=lista.filter(x=>norm(x.nombre)==norm(g.nombre)).length>1;if(!rep)return"";return g.nota||g.grupo||("Mesa "+g.mesa)}
function expirado(c,ahora){if(!c.fechaExpira)return false;const p=String(c.fechaExpira).split("-").map(Number);if(p.length<3||p.some(isNaN))return false;
 return (ahora||new Date())>=new Date(p[0],p[1]-1,p[2]+1)}
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
const lugarTxt=g=>"Mesa "+g.mesa+(g.puesto?" · Puesto "+g.puesto:"");
function grupoHTML(g,lista){if(!g.grupo||!lista)return"";const m=lista.filter(x=>x.grupo&&norm(x.grupo)==norm(g.grupo));if(m.length<2)return"";
 return `<div class="grupo"><div class="sub">Tu grupo · ${esc(g.grupo)}</div>`+m.map(x=>{const yo=x===g;
  return `<button class="miembro${yo?" yo":""}" data-k="${lista.indexOf(x)}"><span>${esc(x.nombre)}${x.nota?` <i>(${esc(x.nota)})</i>`:""}</span><b>${lugarTxt(x)}</b></button>`}).join("")+
 `<div class="msg">Toca un nombre para ver su mesa.</div></div>`}
function mostrar(g,lista){const t=mesaInfo(g.mesa),nom=t.nombre?` · ${esc(t.nombre)}`:"";
 const okP=g.puesto&&g.puesto<=t.asientos,p=lista?pista(g,lista):"";
 const hola=`<div>Hola, <b>${esc(g.nombre)}</b>${p?`<div class="pista">${esc(p)}</div>`:""}</div>`,gr=grupoHTML(g,lista);
 // Sin puesto (columna vacía o inexistente): solo la mesa, con la mesa resaltada y ninguna silla marcada.
 if(!g.puesto)return `<div class="card">${hola}`+
 `<div class="lug"><div class="box solo"><small>TU MESA</small><div class="num">${g.mesa}</div></div></div>`+
 `<div class="tn">Mesa ${g.mesa}${nom}</div>`+
 deCerca(t,null)+`<div class="msg">Puedes sentarte en cualquier silla de tu mesa.</div>`+gr+
 `<div class="sub">Ubicación de tu mesa en el salón</div>${plano(g.mesa)}<div class="msg">La mesa resaltada en dorado es la tuya. ¡Disfruta el evento!</div></div>`;
 return `<div class="card">${hola}`+
 `<div class="lug"><div class="box"><small>MESA</small><div class="num">${g.mesa}</div></div><div class="box pu"><small>PUESTO</small><div class="num">${g.puesto}</div></div></div>`+
 `<div class="tn">Mesa ${g.mesa}${nom}</div>`+
 (okP?deCerca(t,g.puesto)+`<div class="msg">Tu silla es la dorada. El puesto 1 es el que mira hacia la ${esc((C.frente||"tarima").toLowerCase())} y los demás siguen como las agujas del reloj.</div>`:"")+gr+
 `<div class="sub">Ubicación de tu mesa en el salón</div>${plano(g.mesa)}<div class="msg">¡Disfruta el evento!</div></div>`}
function opciones(items,lista,titulo){return `<div class="msg${titulo[0]=="¿"?" sug":""}">${titulo}</div>`+items.map((g,i)=>{const p=pista(g,lista);
 return `<button class="op" data-i="${i}">${esc(g.nombre)}${p?` <span class="pista">· ${esc(p)}</span>`:""}</button>`}).join("")}
if(typeof module!="undefined"){module.exports={lados,norm,parseCSV,decodificar,buscar,sugerir,resolver,pista,expirado,dist,APODOS,sillas,mesaInfo,deCerca,mostrar,opciones,MAX,MIN};return}
if(C.evento){const e=document.createElement("div");e.textContent="Evento "+C.evento;e.setAttribute("style","position:fixed;top:8px;right:8px;font:600 11px/1 Georgia,serif;letter-spacing:1px;color:#0f1f3d;background:#c9a24a;border-radius:10px;padding:5px 8px;opacity:.85;z-index:9");document.body.appendChild(e);document.title+=" · Evento "+C.evento}
document.getElementById("b").textContent=C.bienvenida||"¡Bienvenidos!";document.getElementById("t").textContent=C.novios?((C.titulo?C.titulo+" ":"")+C.novios):(C.titulo||"");document.getElementById("d").textContent=(C.fecha||"")+(C.lugar?" · "+C.lugar:"");
const q=document.getElementById("q"),r=document.getElementById("r");let L=[];
if(expirado(C)){const m=document.querySelector("main");m.innerHTML=`<div class="card"><p class="bien" style="font-size:38px">¡Gracias!</p><div class="tn">${esc(C.mensajeGracias||"Gracias por acompañarnos en esta celebración.")}</div><div class="msg">Este evento ya terminó y la lista de mesas ya no está disponible.</div></div>`;return}
function ver(g){q.value=g.nombre;r.innerHTML=mostrar(g,L);
 r.querySelectorAll("button.miembro").forEach(b=>b.onclick=()=>{ver(L[b.dataset.k]);window.scrollTo({top:0,behavior:"smooth"})})}
function upd(){const x=resolver(L,q.value);
 if(x.tipo=="vacio"){r.innerHTML="";return}
 if(x.tipo=="corto"){r.innerHTML='<div class="msg">Escribe al menos 3 letras de tu nombre o apellido.</div>';return}
 if(x.tipo=="nada"){r.innerHTML='<div class="msg">No encontramos ese nombre. Revisa la ortografía, prueba solo con tu apellido o pregunta al personal de Milfor.</div>';return}
 if(x.tipo=="muchos"){r.innerHTML='<div class="msg">Hay muchas personas con ese nombre. Escribe también tu apellido.</div>';return}
 if(x.tipo=="uno"){ver(x.items[0]);return}
 r.innerHTML=opciones(x.items,L,x.tipo=="sugerencias"?"¿Quisiste decir…?":"Hay varias coincidencias, elige tu nombre:");
 r.querySelectorAll("button.op").forEach(b=>b.onclick=()=>ver(x.items[b.dataset.i]))}
q.oninput=upd;
const cargar=C.csvUrl?fetch(C.csvUrl).then(x=>x.text()).then(parseCSV):fetch("invitados.dat?v="+Date.now()).then(x=>{if(!x.ok)throw 0;return x.text()}).then(decodificar);
cargar.then(l=>{L=l;const n=new URLSearchParams(location.search).get("n");if(n){q.value=n;}upd()}).catch(()=>{r.innerHTML='<div class="msg">No se pudo cargar la lista de invitados.</div>'});
})();
