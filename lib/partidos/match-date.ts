export default function MatchDate(fecha: Date) {

const fechaConHora: Date = new Date(fecha);
    fechaConHora.setHours(fechaConHora.getHours()-1); 
    const dia = fechaConHora.toLocaleDateString('es-ES', { 
  weekday: 'long',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
    const hora = fechaConHora.toLocaleTimeString('es-ES', { 
  hour: "2-digit", 
  minute: "2-digit",
  hour12: false,
  timeZone: 'Europe/Madrid' // Opcional: especificar zona horaria
});
return [dia, hora];
}