// ===== CONFIGURACIÓN DEL EVENTO (editar aquí) =====
window.MILFOR_CONFIG = {
  // Nombres de los novios (EJEMPLO: cámbielos por los reales). Deje "" si no es boda.
  novios: "Laura & Andrés",
  bienvenida: "¡Bienvenidos!",
  bienvenida_en: "Welcome!",          // (opcional) cualquier texto con _en se usa cuando el invitado elige inglés
  titulo: "Boda de",  // se muestra antes de los novios; si novios está vacío se muestra solo
  titulo_en: "The wedding of",

  fecha: "Sábado 14 de noviembre de 2026 · 7:00 p.m.",
  fecha_en: "Saturday, November 14, 2026 · 7:00 p.m.",
  lugar: "Salón principal",
  lugar_en: "Main ballroom",
  // Fecha en que la página deja de mostrar la lista y muestra un "¡Gracias!" (formato "AAAA-MM-DD").
  // Desde ese día ya no se puede buscar a nadie. Deje "" para que no caduque.
  fechaExpira: "",
  // fechaGracias: desde ESE día se muestra "¡Gracias!" con botones de fotos y reseña (también ?gracias=1 para verlo de prueba).
  fechaGracias: "",
  mensajeGracias: "Gracias por acompañarnos en esta celebración.",
  mensajeGracias_en: "Thank you for celebrating with us.",
  // Wi-Fi del salón para el letrero A5 (opcional). Deje "" si no hay.
  wifi: {red: "", clave: ""},
  // Deje vacío para usar la lista de la carpeta (invitados.dat, que preparar.py genera desde invitados.csv).
  // OJO: con Google Sheets la lista publicada SÍ queda legible para quien tenga esa URL.
  // O pegue la URL CSV publicada de Google Sheets
  // (Archivo > Compartir > Publicar en la web > CSV), columnas: nombre,mesa,puesto (puesto es opcional)
  csvUrl: "",

  // ===== SECCIONES OPCIONALES (todo lo que esté vacío "" o [] no aparece) =====
  // Mensaje corto de los novios (EJEMPLO). fotoNovios: nombre de un archivo en esta carpeta (ej. "novios.jpg") o link; si no hay foto se ven sus iniciales.
  mensajeNovios: "Gracias por ser parte de este día tan especial. ¡Esta noche es para celebrar juntos! (mensaje de ejemplo)",
  mensajeNovios_en: "Thank you for being part of this special day. Tonight we celebrate together! (sample message)",
  fotoNovios: "",
  // Programa de la noche (EJEMPLO)
  programa: [
    {hora:"7:00 p.m.",  titulo:"Ceremonia",              titulo_en:"Ceremony"},
    {hora:"7:45 p.m.",  titulo:"Cóctel de bienvenida",   titulo_en:"Welcome cocktail"},
    {hora:"8:30 p.m.",  titulo:"Entrada de los novios",  titulo_en:"Grand entrance"},
    {hora:"9:00 p.m.",  titulo:"Cena",                   titulo_en:"Dinner"},
    {hora:"10:00 p.m.", titulo:"Primer baile y fiesta",  titulo_en:"First dance & party"},
    {hora:"11:30 p.m.", titulo:"Torta",                  titulo_en:"Cake cutting"}
  ],
  // Menú de la noche (EJEMPLO). Sin alergias: eso va solo en la hoja de los meseros.
  menu: [
    {tiempo:"Entrada",       tiempo_en:"Starter", plato:"Crema de calabaza (ejemplo)",  plato_en:"Butternut squash soup (sample)"},
    {tiempo:"Plato fuerte",  tiempo_en:"Main",    plato:"Lomo en salsa de vino (ejemplo)", plato_en:"Beef tenderloin in red wine sauce (sample)", detalle:"o pescado a la plancha", detalle_en:"or grilled fish"},
    {tiempo:"Postre",        tiempo_en:"Dessert", plato:"Torta de los novios (ejemplo)",  plato_en:"Wedding cake (sample)"}
  ],
  // Cómo llegar (EJEMPLO, dirección ficticia). mapsUrl: pegue el link de Google Maps; si está vacío se busca la dirección.
  llegar: {lugar:"Salón de ejemplo", lugar_en:"Sample venue", direccion:"123 Calle Ejemplo, Miami, FL (ficticia)", mapsUrl:"",
           parqueo:"Valet parking en la entrada principal (ejemplo).", parqueo_en:"Valet parking at the main entrance (sample)."},
  // Álbum de fotos compartido (ej. álbum de Google Fotos con "colaborar" activado). EJEMPLO:
  albumUrl: "https://photos.google.com/",
  // Compañeros de mesa: muestra SOLO el primer nombre de los demás de la mesa. false = no mostrar.
  companeros: true,
  // Vista del personal (/personal/): clave codificada. Cámbiela con:  python3 preparar.py pin raiz 1234
  // (clave de prueba actual: 2026). OJO: es una protección sencilla, no seguridad real.
  pinPersonal: "0f0e28b8c3dc0ed7add9d65410c8299fa4fa83f4fc07c7f561b99a7fd495aed3",
  // Mesas: número, nombre opcional, posición (x,y) en el plano de 400x500,
  // asientos (sillas de la mesa) y forma: "redonda" (por defecto), "cuadrada" o "rectangular".
  // Numeración de puestos: el puesto 1 es el que queda del lado de la TARIMA
  // (arriba en el plano) y se sigue en el sentido de las agujas del reloj.
  asientosPorDefecto: 10,
  frente: "TARIMA", frente_en: "STAGE",     // hacia dónde mira el puesto 1 (se muestra en el dibujo de la mesa)
  atras: "ENTRADA", atras_en: "ENTRANCE",     // lo que queda al lado opuesto (opcional, "" para ocultar)
  mesas: [
    {mesa:1, nombre:"Mesa Rosa",     x:80,  y:200, asientos:8},
    {mesa:2, nombre:"Mesa Orquídea", x:80,  y:290, asientos:8},
    {mesa:3, nombre:"Mesa Lirio",    x:80,  y:380, asientos:8},
    {mesa:4, nombre:"Mesa Jazmín",   x:320, y:200, asientos:8, forma:"cuadrada"},
    {mesa:5, nombre:"Mesa Gardenia", x:320, y:290, asientos:8},
    {mesa:6, nombre:"Mesa Tulipán",  x:320, y:380, asientos:8, forma:"cuadrada"},
    {mesa:7, nombre:"Mesa Girasol",  x:160, y:430, asientos:8},
    {mesa:8, nombre:"Mesa Magnolia", x:240, y:430, asientos:8, forma:"rectangular"}
  ],
  // Elementos fijos del salón: x,y,ancho,alto
  elementos: [
    {texto:"TARIMA", texto_en:"STAGE", x:120, y:20, w:160, h:50, oscuro:true},
    {texto:"PISTA DE BAILE", texto_en:"DANCE FLOOR", x:140, y:180, w:120, h:140, pista:true},
    {texto:"BAR", texto_en:"BAR", x:20, y:20, w:70, h:110},
    {texto:"ENTRADA", texto_en:"ENTRANCE", x:160, y:478, w:80, h:20, entrada:true}
  ]
};
