import { prisma } from '@/lib/prisma-singleton'
import { notFound } from 'next/navigation'
import { Fase, Temporada } from '@prisma/client'

import EquipoHeader from './equipo-header'
import EquipoPartidos from './equipo-partidos'
import EquipoNextMatch from './equipo-next-match'

interface Props {
  equipoId:    number
  searchParams: Promise<{ temporada?: string; fase?: string }>
}

export default async function EquipoWrapper({ equipoId, searchParams }: Props) {
  const params = await searchParams

  // 1. Equipo base
  const equipo = await prisma.equipos.findUnique({ where: { id: equipoId } })
  if (!equipo) notFound()

  // 2. Todas las ligas donde participa este equipo
  const ligasConEquipo = await prisma.ligas.findMany({
    where: {
      partidos: {
        some: {
          OR: [{ equipoAId: equipoId }, { equipoBId: equipoId }],
        },
      },
    },
    orderBy: [{ temporada: 'asc' }, { fase: 'asc' }],
    select: { id: true, temporada: true, fase: true },
  })

  if (!ligasConEquipo.length) {
    return (
      <div className="text-center opacity-60 py-12">
        Este equipo no tiene partidos registrados.
      </div>
    )
  }

  // 3. Liga seleccionada
  const temporadaParam = params?.temporada as Temporada | undefined
  const faseParam      = params?.fase      as Fase      | undefined
  const ligaSeleccionada =
    ligasConEquipo.find(l => l.temporada === temporadaParam && l.fase === faseParam) ??
    ligasConEquipo[ligasConEquipo.length - 1] // por defecto la más reciente

  // 4. Stats del equipo en la liga seleccionada
  const stats = await prisma.equipos_stats.findFirst({
    where: { equipoId, ligaId: ligaSeleccionada.id },
  })

  // 5. Posición en la liga
  const posicion = stats
    ? await prisma.equipos_stats.count({
        where: {
          ligaId: ligaSeleccionada.id,
          OR: [
            { puntos: { gt: stats.puntos } },
            { AND: [{ puntos: stats.puntos }, { diferenciaGoles: { gt: stats.diferenciaGoles } }] },
          ],
        },
      }) + 1
    : null

  // 6. Partidos de la liga seleccionada
  const partidos = await prisma.partidos.findMany({
    where: {
      ligaId: ligaSeleccionada.id,
      OR: [{ equipoAId: equipoId }, { equipoBId: equipoId }],
    },
    orderBy: { fecha: 'asc' },
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
  })

  // 7. Siguiente partido (cualquier liga)
  const now = new Date()
  const nextMatch = await prisma.partidos.findFirst({
    where: {
      fecha: { gt: now },
      OR: [{ equipoAId: equipoId }, { equipoBId: equipoId }],
    },
    orderBy: { fecha: 'asc' },
    select: {
      id:            true,
      jornada:       true,
      fecha:         true,
      instalaciones: true,
      campo:         true,
      equipoAId:     true,
      equipoBId:     true,
      ligaId:        true,
      equipos_partidosA: { select: { id: true, nombre: true, escudo: true } },
      equipos_partidosB: { select: { id: true, nombre: true, escudo: true } },
    },
  })

  return (
    <div className="flex flex-col gap-8 w-full">
      <EquipoHeader
        equipo={equipo}
        stats={stats}
        posicion={posicion}
        ligas={ligasConEquipo}
        temporadaActual={ligaSeleccionada.temporada}
        faseActual={ligaSeleccionada.fase}
      />

      {nextMatch && (
        <EquipoNextMatch
          nextMatch={nextMatch}
          equipoId={equipoId}
        />
      )}

      <EquipoPartidos
        partidos={partidos}
        equipoId={equipoId}
      />
    </div>
  )
}