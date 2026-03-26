import MatchCard from "./match-card";
import { prisma } from "@/lib/prisma-singleton";
import Image from "next/image";

export async function MatchListWrapper() {
    const partidos = await prisma.partido.findMany({
         select: {
            jornada: true,
            fecha: true,
            instalaciones: true,
            campo: true,
            equipoA: {
                select: {
                    nombre: true,
                    escudo: true
                }
            },
            equipoB: {
                select: {
                    nombre: true,
                    escudo: true
                }
            }
        },
        orderBy: [
            { jornada: 'asc' },
            { fecha: 'asc' }
        ]
    });
        
  return (
    <div className="container mx-auto p-6">
      
        <div className="flex items-center justify-center gap-4">
          <Image src="/icons/pitch_edit2.svg" alt="Pitch" width={32} height={32} />
          <h1 className="text-4xl font-bold">Partidos</h1>

        </div>
        <div className="items-center justify-center p-3 m-4 flex flex-row flex-wrap gap-6 transition">
        
        {partidos.map((partido, index) => (
            
            <MatchCard key={index} partido={partido} />
        ))}
        </div>

        </div>
)
}