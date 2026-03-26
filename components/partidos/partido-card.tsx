import Image from "next/image"
import { cn } from "@/lib/utils";

interface PartidoCardProps {
  equipoLocal: {
    nombre: string
    escudo: string
    posicion?: number
  }
  equipoVisitante: {
    nombre: string
    escudo: string
    posicion?: number
  }
  golesLocal?: number | null
  golesVisitante?: number | null
  fecha: string // formato ISO o legible
  hora?: string
  jornada: number
  estadio?: string
  campo?: string
}

export function PartidoCard({
  equipoLocal,
  equipoVisitante,
  golesLocal,
  golesVisitante,
  fecha,
  hora,
  jornada,
  estadio,
  campo,
}: PartidoCardProps) {
  const partidoJugado = golesLocal != null && golesVisitante != null

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center text-center rounded-xl p-4 md:p-6 transition-colors",
        "bg-[#f7b2b5] text-black border border-[#c46a6e]"
      )}
    >
      {/* Contenido principal */}
      <div className="flex items-center justify-between w-full max-w-3xl">
        {/* LOCAL */}
        <div className="flex flex-col items-center w-1/3">
          <Image
            src={equipoLocal.escudo}
            alt={equipoLocal.nombre}
            width={80}
            height={80}
            className="object-contain"
          />
          <div className="mt-1 font-bold text-lg italic text-red-700">{equipoLocal.nombre}</div>
          {!partidoJugado && equipoLocal.posicion && (
            <div className="text-xs font-semibold text-yellow-900 flex items-center gap-1 mt-1">
              <Image src="/icons/ball.svg" alt="Ball" width={14} height={14} />
              {equipoLocal.posicion}ª en liga
            </div>
          )}
        </div>

        {/* CENTRO */}
        <div className="flex flex-col items-center justify-center w-1/3">
          {partidoJugado ? (
            <>
              <div className="flex items-center gap-2 text-5xl font-extrabold text-black">
                <span>{golesLocal}</span>
                <Image src="/icons/ball.svg" alt="Ball" width={20} height={20} />
                <span>{golesVisitante}</span>
              </div>
            </>
          ) : (
            <>
              <Image src="/icons/pitch.svg" alt="Pitch" width={32} height={32} className="mb-1" />
              {estadio && (
                <div className="font-semibold text-sm leading-tight">
                  <div>{estadio}</div>
                  {campo && <div className="text-red-700">Campo {campo}</div>}
                </div>
              )}
              {hora && <div className="text-xl font-bold mt-1">{hora}</div>}
            </>
          )}
        </div>

        {/* VISITANTE */}
        <div className="flex flex-col items-center w-1/3">
          <Image
            src={equipoVisitante.escudo}
            alt={equipoVisitante.nombre}
            width={80}
            height={80}
            className="object-contain"
          />
          <div className="mt-1 font-bold text-lg italic text-red-700">{equipoVisitante.nombre}</div>
          {!partidoJugado && equipoVisitante.posicion && (
            <div className="text-xs font-semibold text-yellow-900 flex items-center gap-1 mt-1">
              <Image src="/icons/ball.svg" alt="Ball" width={14} height={14} />
              {equipoVisitante.posicion}ª en liga
            </div>
          )}
        </div>
      </div>

      {/* PIE COMÚN */}
      <div className="mt-3 bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-3">
        <div>Jornada {jornada}</div>
        <div>{new Date(fecha).toLocaleDateString("es-ES")}</div>
      </div>
    </div>
  )
}
