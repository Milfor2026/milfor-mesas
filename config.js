// ===== CONFIGURACIÓN DEL EVENTO (editar aquí) =====
window.MILFOR_CONFIG = {
  titulo: "Evento de prueba Milfor",
  fecha: "Sábado 14 de noviembre de 2026 · 7:00 p.m.",
  lugar: "Salón principal",
  // Deje vacío para usar invitados.csv. O pegue la URL CSV publicada de Google Sheets
  // (Archivo > Compartir > Publicar en la web > CSV), columnas: nombre,mesa
  csvUrl: "",
  // Mesas: número, nombre opcional y posición (x,y) en el plano de 400x500
  mesas: [
    {mesa:1, nombre:"Mesa Rosa",     x:80,  y:200},
    {mesa:2, nombre:"Mesa Orquídea", x:80,  y:290},
    {mesa:3, nombre:"Mesa Lirio",    x:80,  y:380},
    {mesa:4, nombre:"Mesa Jazmín",   x:320, y:200},
    {mesa:5, nombre:"Mesa Gardenia", x:320, y:290},
    {mesa:6, nombre:"Mesa Tulipán",  x:320, y:380},
    {mesa:7, nombre:"Mesa Girasol",  x:160, y:430},
    {mesa:8, nombre:"Mesa Magnolia", x:240, y:430}
  ],
  // Elementos fijos del salón: x,y,ancho,alto
  elementos: [
    {texto:"TARIMA", x:120, y:20, w:160, h:50, oscuro:true},
    {texto:"PISTA DE BAILE", x:140, y:180, w:120, h:140, pista:true},
    {texto:"BAR", x:20, y:20, w:70, h:110},
    {texto:"ENTRADA", x:160, y:478, w:80, h:20, entrada:true}
  ]
};
