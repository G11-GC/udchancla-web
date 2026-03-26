export type Jugador = {
    dorsal: number;
    nombre: string;
    partidosJugados: number;
    goles: number;
    asistencias: number;
    porteriasACero: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
    partidosSancionado: number;
    apercibido: boolean;
}

export type Sancion = {
    id: number;
    jugador: string;
    inicioSancion: string; //en qué jornada empieza la sanción
    finSancion: string; //en qué jornada termina la sanción
}