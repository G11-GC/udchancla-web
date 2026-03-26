import MatchDayGrouper from "./match-day-grouper";
import { prisma } from "@/lib/prisma-singleton";
import Image from "next/image";
import { Fase, Temporada } from "@prisma/client";
import LigaSelector from "@/components/clasificacion/liga-selector";
import { Suspense } from "react";

interface Props {
  searchParams?: Promise<{ temporada?: string; fase?: string }>
}

export async function MatchListWrapper({ searchParams }: Props) {
  const params = await searchParams

  const ligas = await prisma.ligas.findMany({
    orderBy: [{ temporada: 'asc' }, { fase: 'asc' }],
    select:  { id: true, temporada: true, fase: true },
  })

  const temporadaParam = params?.temporada as Temporada | undefined
  const faseParam      = params?.fase      as Fase      | undefined

  const ligaSeleccionada =
    ligas.find(l => l.temporada === temporadaParam && l.fase === faseParam) ??
    ligas[ligas.length - 1] // más reciente por defecto

  const partidos = await prisma.partidos.findMany({
    where: { ligaId: ligaSeleccionada.id },
    select: {
      id:            true,
      jornada:       true,
      fecha:         true,
      instalaciones: true,
      campo:         true,
      equipoAId:     true,
      equipoBId:     true,
      equipos_partidosA: { select: { nombre: true, escudo: true } },
      equipos_partidosB: { select: { nombre: true, escudo: true } },
      partidos_stats:    { select: { golesA: true, golesB: true, resultado: true } },
    },
    orderBy: [{ jornada: 'asc' }, { fecha: 'asc' }],
  })

  const partidosPorJornada = Object.groupBy
    ? Object.groupBy(partidos, p => p.jornada ?? 0)
    : partidos.reduce((acc, partido) => {
        const key = partido.jornada ?? 0
        acc[key] = acc[key] || []
        acc[key].push(partido)
        return acc
      }, {} as Record<number, typeof partidos>)

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Image src="/icons/pitch_edit2.svg" alt="Pitch" width={32} height={32} />
          <h1 className="text-4xl font-bold">Partidos</h1>
        </div>
        <Suspense>
          <LigaSelector
            ligas={ligas}
            temporadaActual={ligaSeleccionada.temporada}
            faseActual={ligaSeleccionada.fase}
          />
        </Suspense>
      </div>

      <div className="flex grid-flow-row flex-wrap gap-6 transition">
        {Object.entries(partidosPorJornada)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([jornadaStr, partidos]) => {
            const jornada = Number(jornadaStr)
            return (
              <MatchDayGrouper
                key={jornada}
                jornada={jornada}
                partidos={partidos!}
              />
            )
          })}
      </div>
    </div>
  )
}