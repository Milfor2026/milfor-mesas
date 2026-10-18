// ===== CONFIGURACIÓN DEL EVENTO (editar aquí) =====
window.MILFOR_CONFIG = {
  // Letra fija de este código (no cambiar): se muestra como "Evento C"
  evento: "C",
  // Nombres de los novios (EJEMPLO: cámbielos por los reales). Deje "" si no es boda.
  novios: "Valentina & Daniel",
  bienvenida: "¡Bienvenidos!",
  titulo: "Boda de",  // se muestra antes de los novios; si novios está vacío se muestra solo

  fecha: "Sábado 5 de diciembre de 2026 · 7:30 p.m.",
  lugar: "Salón principal",
  // Fecha en que la página deja de mostrar la lista y muestra un "¡Gracias!" (formato "AAAA-MM-DD").
  // Desde ese día ya no se puede buscar a nadie. Deje "" para que no caduque.
  fechaExpira: "",
  mensajeGracias: "Gracias por acompañarnos en esta celebración.",
  // Wi-Fi del salón para el letrero A5 (opcional). Deje "" si no hay.
  wifi: {red: "", clave: ""},
  // Deje vacío para usar la lista de la carpeta (invitados.dat, que preparar.py genera desde invitados.csv).
  // OJO: con Google Sheets la lista publicada SÍ queda legible para quien tenga esa URL.
  // O pegue la URL CSV publicada de Google Sheets
  // (Archivo > Compartir > Publicar en la web > CSV), columnas: nombre,mesa,puesto (puesto es opcional)
  csvUrl: "",
  // Mesas: número, nombre opcional, posición (x,y) en el plano de 400x500,
  // asientos (sillas de la mesa) y forma: "redonda" (por defecto), "cuadrada" o "rectangular".
  // Numeración de puestos: el puesto 1 es el que queda del lado de la TARIMA
  // (arriba en el plano) y se sigue en el sentido de las agujas del reloj.
  asientosPorDefecto: 10,
  frente: "TARIMA",     // hacia dónde mira el puesto 1 (se muestra en el dibujo de la mesa)
  atras: "ENTRADA",     // lo que queda al lado opuesto (opcional, "" para ocultar)
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
    {texto:"TARIMA", x:120, y:20, w:160, h:50, oscuro:true},
    {texto:"PISTA DE BAILE", x:140, y:180, w:120, h:140, pista:true},
    {texto:"BAR", x:20, y:20, w:70, h:110},
    {texto:"ENTRADA", x:160, y:478, w:80, h:20, entrada:true}
  ]
};
