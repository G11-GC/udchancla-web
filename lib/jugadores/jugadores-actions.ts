import { Jugador } from "@prisma/client";
import { prisma } from "../prisma-singleton";

export async function getJugadores(): Promise<Jugador[]> {
    const jugadores: Jugador[] = await prisma.jugador.findMany();
    
    return jugadores;
}


export async function getJugador(id: number): Promise<Jugador | null> {
    const jugador: Jugador | null = await prisma.jugador.findUnique({
        where: {
            id: id
        }
    });

    return jugador;
}


export async function getJugadorByDorsal(dorsal: number): Promise<Jugador | null> {
    const jugador: Jugador | null = await prisma.jugador.findUnique({
        where: {
            dorsal: dorsal
        }
    });

    return jugador;
}