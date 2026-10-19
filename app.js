(function(){
const C=(typeof window!="undefined"&&window.MILFOR_CONFIG)||(typeof global!="undefined"&&global.MILFOR_CONFIG)||{mesas:[],elementos:[]};
// ===== Idiomas: español (por defecto) e inglés =====
const TXT={es:{label:"Escribe tu nombre o apellido para encontrar tu mesa",ph:"Ej.: Ana Prueba",corto:"Escribe al menos 3 letras de tu nombre o apellido.",
 nada:"No encontramos ese nombre. Revisa la ortografía, prueba solo con tu apellido o pregunta al personal de Milfor.",muchos:"Hay muchas personas con ese nombre. Escribe también tu apellido.",
 varios:"Hay varias coincidencias, elige tu nombre:",sug:"¿Quisiste decir…?",carga:"No se pudo cargar la lista de invitados.",hola:"Hola",MESA:"MESA",PUESTO:"PUESTO",TUMESA:"TU MESA",
 mesa:"Mesa",puesto:"Puesto",tuPuesto:"Tu puesto: ",estrella:"★ Tu mesa",cualquier:"Puedes sentarte en cualquier silla de tu mesa.",
 dorada:f=>`Tu silla es la dorada. El puesto 1 es el que mira hacia la ${f} y los demás siguen como las agujas del reloj.`,ubic:"Ubicación de tu mesa en el salón",
 resaltada:"La mesa resaltada en dorado es la tuya. ¡Disfruta el evento!",disfruta:"¡Disfruta el evento!",grupo:"Tu grupo",toca:"Toca un nombre para ver su mesa.",
 companeros:"En tu mesa también están",programa:"Programa de la noche",menu:"Menú de la noche",llegar:"Cómo llegar",mapa:"Abrir en Google Maps",parqueo:"Estacionamiento",
 fotos:"Sube tus fotos",fotosSub:"Comparte tus fotos del evento con los novios",mensaje:"Unas palabras para ti",gracias:"¡Gracias!",graciasDef:"Gracias por acompañarnos en esta celebración.",
 termino:"Este evento ya terminó y la lista de mesas ya no está disponible.",resena:"Déjanos tu reseña en Google",resenaSub:"¿Te gustó la organización? Nos encantaría leerte.",
 organizado:"Evento organizado por",planea:"Planea tu evento con nosotros",evento:"Evento",demoTag:"Demostración / ejemplo",fotoDe:"Foto de",fotoNov:"Foto de los anfitriones",demoNota:"Página de ejemplo con datos ficticios: así la verán los invitados de tu evento.",fotosDemo:"En cada evento, este botón abre el álbum de fotos propio de ese evento.",otro:"English",bienvenida:"¡Bienvenidos!",tarima:"TARIMA",vista:"Vista previa de la pantalla final",ubicacion:"Ubicación"},
en:{label:"Type your first or last name to find your table",ph:"e.g. Ana Prueba",corto:"Please type at least 3 letters of your first or last name.",
 nada:"We couldn't find that name. Check the spelling, try just your last name, or ask the Milfor staff.",muchos:"Many guests match that name. Please add your last name.",
 varios:"Several guests match — please choose your name:",sug:"Did you mean…?",carga:"The guest list could not be loaded.",hola:"Hello",MESA:"TABLE",PUESTO:"SEAT",TUMESA:"YOUR TABLE",
 mesa:"Table",puesto:"Seat",tuPuesto:"Your seat: ",estrella:"★ Your table",cualquier:"You may sit in any chair at your table.",
 dorada:f=>`Your chair is the gold one. Seat 1 faces the ${f}; the others follow clockwise.`,ubic:"Where your table is in the room",
 resaltada:"Your table is highlighted in gold. Enjoy the celebration!",disfruta:"Enjoy the celebration!",grupo:"Your group",toca:"Tap a name to see their table.",
 companeros:"Also at your table",programa:"Tonight's schedule",menu:"Tonight's menu",llegar:"Getting there",mapa:"Open in Google Maps",parqueo:"Parking",
 fotos:"Upload your photos",fotosSub:"Share your photos of the celebration with the couple",mensaje:"A few words for you",gracias:"Thank you!",graciasDef:"Thank you for celebrating with us.",
 termino:"This event has ended and the seating list is no longer available.",resena:"Leave us a Google review",resenaSub:"Did you enjoy the event? We'd love to hear from you.",
 organizado:"Event organized by",planea:"Plan your event with us",evento:"Event",demoTag:"Demo / example",fotoDe:"Photo of",fotoNov:"Photo of the hosts",demoNota:"Sample page with fictional data: this is what the guests at your event will see.",fotosDemo:"At each event, this button opens that event's own photo album.",otro:"Español",bienvenida:"Welcome!",tarima:"STAGE",vista:"Preview of the closing screen",ubicacion:"Location"}};
let LANG="es";
const tr=(k,...a)=>{const v=(TXT[LANG]||TXT.es)[k];return typeof v=="function"?v(...a):(v==null?TXT.es[k]:v)};
// Texto de la configuración en el idioma actual: usa campo_en si existe, si no el español
const tc=(o,k)=>(o&&((LANG=="en"&&o[k+"_en"])||o[k]))||"";
function setLang(l){LANG=l=="en"?"en":"es"}
function idiomaInicial(){try{const p=new URLSearchParams(location.search).get("lang");if(p)return p;const s=localStorage.getItem("milfor-lang");if(s)return s}catch(e){}
 const n=(typeof navigator!="undefined"&&(navigator.languages||[navigator.language]))||[];const f=n.find(x=>/^(en|es)/i.test(x||""))||"es";return /^en/i.test(f)?"en":"es"}
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
function pista(g,lista){const rep=lista.filter(x=>norm(x.nombre)==norm(g.nombre)).length>1;if(!rep)return"";return g.nota||g.grupo||(tr("mesa")+" "+g.mesa)}
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
 const fr=tc(C,"frente")||tr("tarima");s+=`<rect x="${g.cx-70}" y="6" width="140" height="22" rx="11" fill="#0f1f3d"/><text x="${g.cx}" y="21.5" font-size="12" text-anchor="middle" fill="#fff" font-family="${F}" letter-spacing="1">▲ ${esc(fr)}</text>`;
 if(tc(C,"atras"))s+=`<text x="${g.cx}" y="${g.H-10}" font-size="11" text-anchor="middle" fill="#8a8f9c" font-family="${F}" letter-spacing="1">${esc(tc(C,"atras"))} ▼</text>`;
 if(g.mesa.r)s+=`<circle cx="${g.cx}" cy="${g.cy}" r="${g.mesa.r}" fill="#f4ecd8" stroke="#c9a24a" stroke-width="2"/>`;
 else s+=`<rect x="${g.cx-g.mesa.w/2}" y="${g.cy-g.mesa.h/2}" width="${g.mesa.w}" height="${g.mesa.h}" rx="6" fill="#f4ecd8" stroke="#c9a24a" stroke-width="2"/>`;
 s+=`<text x="${g.cx}" y="${g.cy-3}" font-size="15" text-anchor="middle" fill="#0f1f3d" font-family="${F}" font-weight="bold">${tr("mesa")} ${t.mesa}</text><text x="${g.cx}" y="${g.cy+15}" font-size="12" text-anchor="middle" fill="#8a6a24" font-family="${F}">${p?tr("tuPuesto")+p:tr("estrella")}</text>`;
 g.s.forEach(c=>{const on=c.n==p;
  s+=`<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${on?g.r+3:g.r}" fill="${on?'#c9a24a':'#fff'}" stroke="${on?'#0f1f3d':'#c9a24a'}" stroke-width="${on?3:1.5}"/><text x="${c.x.toFixed(1)}" y="${(c.y+4.5).toFixed(1)}" font-size="${on?15:13}" text-anchor="middle" fill="${on?'#fff':'#0f1f3d'}" font-family="${F}" font-weight="bold">${c.n}</text>`});
 return s+'</svg>'}
function plano(m){let s='<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="396" height="496" fill="#fff" stroke="#0f1f3d"/>';
 C.elementos.forEach(e=>{s+=`<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="6" fill="${e.oscuro?'#0f1f3d':e.pista?'#f4ecd8':e.entrada?'#c9a24a':'#33456b'}"/><text x="${e.x+e.w/2}" y="${e.y+e.h/2+4}" font-size="11" text-anchor="middle" fill="${e.pista?'#8a6a24':'#fff'}" font-family="Georgia">${esc(tc(e,"texto"))}</text>`});
 C.mesas.forEach(t=>{const on=t.mesa==m,f=on?'#c9a24a':'#fff',st=on?'#0f1f3d':'#c9a24a',sw=on?3:2;
 if(t.forma=="rectangular"){const w=on?76:64,h=on?40:34;s+=`<rect x="${t.x-w/2}" y="${t.y-h/2}" width="${w}" height="${h}" rx="5" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`}
 else if(t.forma=="cuadrada"){const w=on?52:44;s+=`<rect x="${t.x-w/2}" y="${t.y-w/2}" width="${w}" height="${w}" rx="5" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`}
 else s+=`<circle cx="${t.x}" cy="${t.y}" r="${on?30:24}" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`;
 s+=`<text x="${t.x}" y="${t.y+6}" font-size="${on?20:16}" text-anchor="middle" fill="${on?'#fff':'#0f1f3d'}" font-family="Georgia" font-weight="bold">${t.mesa}</text>`;
 if(on)s+=`<text x="${t.x}" y="${t.y-38}" font-size="12" text-anchor="middle" fill="#c9a24a" font-family="Georgia">${tr("estrella")}</text>`});
 return s+'</svg>'}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const url=u=>/^(https?:|mailto:|tel:)/i.test(u||"")||/^[\w./-]+$/.test(u||"")?u:"";   // solo enlaces normales
const lugarTxt=g=>tr("mesa")+" "+g.mesa+(g.puesto?" · "+tr("puesto")+" "+g.puesto:"");
const primerNombre=n=>String(n||"").trim().split(/\s+/)[0];
function grupoHTML(g,lista){if(!g.grupo||!lista)return"";const m=lista.filter(x=>x.grupo&&norm(x.grupo)==norm(g.grupo));if(m.length<2)return"";
 return `<div class="grupo"><div class="sub">${tr("grupo")} · ${esc(g.grupo)}</div>`+m.map(x=>{const yo=x===g;
  return `<button class="miembro${yo?" yo":""}" data-k="${lista.indexOf(x)}"><span>${esc(x.nombre)}${x.nota?` <i>(${esc(x.nota)})</i>`:""}</span><b>${lugarTxt(x)}</b></button>`}).join("")+
 `<div class="msg">${tr("toca")}</div></div>`}
// Compañeros de mesa: SOLO primeros nombres (privacidad). Se apaga con companeros:false en config.js
function companeros(g,lista){if(C.companeros===false||!lista)return[];return lista.filter(x=>x!==g&&x.mesa==g.mesa).sort((a,b)=>(a.puesto||99)-(b.puesto||99)).map(x=>primerNombre(x.nombre))}
function companerosHTML(g,lista){const c=companeros(g,lista);if(!c.length)return"";return `<div class="comp"><div class="sub">${tr("companeros")}</div><div class="nombres">${c.map(esc).join(" · ")}</div></div>`}
function mostrar(g,lista){const t=mesaInfo(g.mesa),tn=tc(t,"nombre"),nom=tn?` · ${esc(tn)}`:"";
 const okP=g.puesto&&g.puesto<=t.asientos,p=lista?pista(g,lista):"";
 const hola=`<div>${tr("hola")}, <b>${esc(g.nombre)}</b>${p?`<div class="pista">${esc(p)}</div>`:""}</div>`,gr=grupoHTML(g,lista),cm=companerosHTML(g,lista);
 // Sin puesto (columna vacía o inexistente): solo la mesa, con la mesa resaltada y ninguna silla marcada.
 if(!g.puesto)return `<div class="card">${hola}`+
 `<div class="lug"><div class="box solo"><small>${tr("TUMESA")}</small><div class="num">${g.mesa}</div></div></div>`+
 `<div class="tn">${tr("mesa")} ${g.mesa}${nom}</div>`+
 deCerca(t,null)+`<div class="msg">${tr("cualquier")}</div>`+cm+gr+
 `<div class="sub">${tr("ubic")}</div>${plano(g.mesa)}<div class="msg">${tr("resaltada")}</div></div>`;
 return `<div class="card">${hola}`+
 `<div class="lug"><div class="box"><small>${tr("MESA")}</small><div class="num">${g.mesa}</div></div><div class="box pu"><small>${tr("PUESTO")}</small><div class="num">${g.puesto}</div></div></div>`+
 `<div class="tn">${tr("mesa")} ${g.mesa}${nom}</div>`+
 (okP?deCerca(t,g.puesto)+`<div class="msg">${tr("dorada",esc((tc(C,"frente")||tr("tarima")).toLowerCase()))}</div>`:"")+cm+gr+
 `<div class="sub">${tr("ubic")}</div>${plano(g.mesa)}<div class="msg">${tr("disfruta")}</div></div>`}
function opciones(items,lista,titulo,sug){return `<div class="msg${sug?" sug":""}">${titulo}</div>`+items.map((g,i)=>{const p=pista(g,lista);
 return `<button class="op" data-i="${i}">${esc(g.nombre)}${p?` <span class="pista">· ${esc(p)}</span>`:""}</button>`}).join("")}
// ===== Secciones opcionales (se ocultan si no están configuradas) =====
const E=()=>Object.assign({},(typeof window!="undefined"&&window.MILFOR_EMPRESA)||(typeof global!="undefined"&&global.MILFOR_EMPRESA)||{},C.milfor||{});
function iniciales(n){const p=String(n||"").split(/\s*(?:&|\by\b|\band\b)\s*/i).filter(Boolean);return p.length>1?p.slice(0,2).map(x=>x.trim()[0].toUpperCase()).join(" & "):""}
function mensajeHTML(){const m=tc(C,"mensajeNovios");if(!m)return"";const f=url(C.fotoNovios),ini=iniciales(C.novios);
 return `<div class="card nov">${f?`<img class="foto" src="${esc(f)}" alt="${esc(C.novios?tr("fotoDe")+" "+C.novios:tr("fotoNov"))}">`:ini?`<div class="mono">${esc(ini)}</div>`:""}<div class="sub">${tr("mensaje")}</div><p class="carta">“${esc(m)}”</p>${C.novios?`<div class="firma">${esc(C.novios)}</div>`:""}</div>`}
function seccion(id,tit,html){return `<details class="sec" id="sec-${id}"><summary><span>✦</span> ${tit}</summary><div class="cont">${html}</div></details>`}
function programaHTML(){const p=(C.programa||[]).filter(x=>tc(x,"titulo"));if(!p.length)return"";
 return seccion("programa",tr("programa"),`<ul class="prog">${p.map(x=>`<li><b>${esc(tc(x,"hora"))}</b><span>${esc(tc(x,"titulo"))}</span></li>`).join("")}</ul>`)}
function menuHTML(){const m=(C.menu||[]).filter(x=>tc(x,"plato"));if(!m.length)return"";
 return seccion("menu",tr("menu"),m.map(x=>`<div class="plato">${tc(x,"tiempo")?`<small>${esc(tc(x,"tiempo"))}</small>`:""}<div>${esc(tc(x,"plato"))}</div>${tc(x,"detalle")?`<i>${esc(tc(x,"detalle"))}</i>`:""}</div>`).join(""))}
function mapsUrl(l){return url(l.mapsUrl)||(l.direccion?"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(l.direccion):"")}
function llegarHTML(){const l=C.llegar||{};if(!l.direccion&&!l.mapsUrl&&!tc(l,"parqueo"))return"";const m=mapsUrl(l);
 return seccion("llegar",tr("llegar"),(tc(l,"lugar")?`<div class="tn">${esc(tc(l,"lugar"))}</div>`:"")+(l.direccion?`<p>${esc(l.direccion)}</p>`:"")+
  (m?`<a class="btn" href="${esc(m)}" target="_blank" rel="noopener">${tr("mapa")}</a>`:"")+(tc(l,"parqueo")?`<p><b>${tr("parqueo")}:</b> ${esc(tc(l,"parqueo"))}</p>`:""))}
function albumHTML(){if(!C.albumUrl&&C.demo)return `<div class="card demo-fotos"><div class="sub">📷 ${tr("fotos")}</div><p class="aviso">${tr("fotosDemo")}</p></div>`;const a=url(C.albumUrl);if(!a)return"";return `<a class="btn grande" href="${esc(a)}" target="_blank" rel="noopener">📷 ${tr("fotos")}<small>${tr("fotosSub")}</small></a>`}
function resenaHTML(){const r=url(E().resenaUrl);if(!r)return"";return `<a class="btn grande oscuro" href="${esc(r)}" target="_blank" rel="noopener">★ ${tr("resena")}<small>${tr("resenaSub")}</small></a>`}
function extrasHTML(){return mensajeHTML()+albumHTML()+programaHTML()+menuHTML()+llegarHTML()}
function pieHTML(pre){const e=E(),w=String(e.whatsapp||"").replace(/\D/g,""),links=[],wt=tc(e,"whatsappTexto");
 if(w)links.push(`<a href="https://wa.me/${w}${wt?"?text="+encodeURIComponent(wt):""}" target="_blank" rel="noopener">WhatsApp</a>`);
 if(e.instagram){const ig=/^https?:/.test(e.instagram)?e.instagram:"https://www.instagram.com/"+String(e.instagram).replace(/^@/,"")+"/";links.push(`<a href="${esc(ig)}" target="_blank" rel="noopener">Instagram</a>`)}
 if(url(e.web))links.push(`<a href="${esc(e.web)}" target="_blank" rel="noopener">Web</a>`);
 const mp=url(e.mapsUrl)||(e.direccion?"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(e.direccion):"");
 if(mp)links.push(`<a href="${esc(mp)}" target="_blank" rel="noopener">${tr("ubicacion")}</a>`);
 return `<div class="pie"><small>${tr("organizado")}</small><img src="${pre||""}logo.png" alt="${esc(e.nombre||"Milfor Bodas & Eventos")}">${links.length?`<div class="planea">${tr("planea")}</div><div class="links">${links.join(" ")}</div>`:""}${e.direccion?`<div class="dir">${esc(e.direccion)}</div>`:""}</div>`}
function graciasHTML(vista){return (vista?`<div class="msg aviso">${tr("vista")}</div>`:"")+`<div class="card"><p class="bien" style="font-size:44px;margin:0">${tr("gracias")}</p><div class="tn">${esc(tc(C,"mensajeGracias")||tr("graciasDef"))}</div>${C.novios?`<div class="firma">${esc(C.novios)}</div>`:""}<div class="msg">${tr("termino")}</div></div>`+albumHTML()+resenaHTML()}
// Fecha "AAAA-MM-DD": fechaGracias = desde ESE día se muestra "¡Gracias!"; fechaExpira = desde el día SIGUIENTE
function fechaLocal(s,mas){const p=String(s||"").split("-").map(Number);if(p.length<3||p.some(isNaN))return null;return new Date(p[0],p[1]-1,p[2]+(mas||0))}
function expirado(c,ahora){const n=ahora||new Date(),a=fechaLocal(c.fechaExpira,1),b=fechaLocal(c.fechaGracias,0);return !!((a&&n>=a)||(b&&n>=b))}
const API={lados,norm,parseCSV,decodificar,buscar,sugerir,resolver,pista,expirado,dist,APODOS,sillas,mesaInfo,deCerca,plano,mostrar,opciones,companeros,iniciales,
 extrasHTML,mensajeHTML,programaHTML,menuHTML,llegarHTML,albumHTML,resenaHTML,pieHTML,graciasHTML,setLang,tr,tc,TXT,MAX,MIN,esc};
if(typeof module!="undefined"){module.exports=API;return}
if(window.MILFOR_SOLO_FUNCIONES){window.MilforApp=API;return}
// ===== Página del invitado =====
const $=id=>document.getElementById(id),PRE=document.querySelector('script[src*="app.js"]').getAttribute("src").startsWith("../")?"../":"";
const params=new URLSearchParams(location.search),q=$("q"),r=$("r");let L=[],actual=null,cargado=false;
setLang(idiomaInicial());
function cabecera(){document.documentElement.lang=LANG;$("b").textContent=tc(C,"bienvenida")||tr("bienvenida");
 const ti=tc(C,"titulo");$("t").textContent=C.novios?((ti?ti+" ":"")+C.novios):ti;$("d").textContent=(tc(C,"fecha"))+(tc(C,"lugar")?" · "+tc(C,"lugar"):"");
 $("lang").textContent=tr("otro");if(C.evento)$("ev").textContent=tr("evento")+" "+C.evento;else if(C.demo)$("ev").textContent=tr("demoTag");
 if(C.demo){let d=$("demo");if(!d){d=document.createElement("div");d.id="demo";d.className="demo-banda";d.setAttribute("role","note");document.querySelector("main").prepend(d)}d.innerHTML=`<b>${esc(tr("demoTag"))}</b> · ${esc(tr("demoNota"))}`}$("pie").innerHTML=pieHTML(PRE)}
const fin=expirado(C)||params.get("gracias")=="1";
function pintar(){cabecera();
 if(fin){$("buscar").style.display="none";$("b").style.display="none";$("extra").innerHTML=graciasHTML(!expirado(C));return}
 $("lq").textContent=tr("label");q.placeholder=tr("ph");
 const ab=[...document.querySelectorAll("details.sec[open]")].map(d=>d.id);$("extra").innerHTML=extrasHTML();ab.forEach(i=>{const d=$(i);if(d)d.open=true});
 if(actual)ver(actual);else if(cargado)upd()}
$("lang").onclick=()=>{setLang(LANG=="es"?"en":"es");try{localStorage.setItem("milfor-lang",LANG)}catch(e){}pintar()};
if(C.evento){$("ev").style.display="block";document.title+=" · Evento "+C.evento}
function ver(g){actual=g;q.value=g.nombre;r.innerHTML=mostrar(g,L);
 r.querySelectorAll("button.miembro").forEach(b=>b.onclick=()=>{ver(L[b.dataset.k]);window.scrollTo({top:0,behavior:"smooth"})})}
function upd(){actual=null;const x=resolver(L,q.value);
 if(x.tipo=="vacio"){r.innerHTML="";return}
 if(["corto","nada","muchos"].includes(x.tipo)){r.innerHTML=`<div class="msg">${tr(x.tipo)}</div>`;return}
 if(x.tipo=="uno"){ver(x.items[0]);return}
 r.innerHTML=opciones(x.items,L,tr(x.tipo=="sugerencias"?"sug":"varios"),x.tipo=="sugerencias");
 r.querySelectorAll("button.op").forEach(b=>b.onclick=()=>ver(x.items[b.dataset.i]))}
q.oninput=upd;pintar();
if(!fin){const cargar=C.csvUrl?fetch(C.csvUrl).then(x=>x.text()).then(parseCSV):fetch("invitados.dat?v="+Date.now()).then(x=>{if(!x.ok)throw 0;return x.text()}).then(decodificar);
 cargar.then(l=>{L=l;cargado=true;const n=params.get("n");if(n){q.value=n;}upd()}).catch(()=>{r.innerHTML=`<div class="msg">${tr("carga")}</div>`})}
})();
