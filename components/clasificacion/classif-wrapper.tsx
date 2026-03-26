import { TablaClasif } from '@/components/clasificacion/better-classif'
import { prisma } from '@/lib/prisma-singleton'
import { Fase, Temporada } from '@prisma/client'

interface Props {
  searchParams?: Promise<{ temporada?: string; fase?: string }>
}

async function initEquiposStats(ligaId: number) {
  const partidos = await prisma.partidos.findMany({
    where:  { ligaId },
    select: { equipoAId: true, equipoBId: true },
  })

  const equipoIds = [...new Set(partidos.flatMap(p => [p.equipoAId, p.equipoBId]))]

  for (const equipoId of equipoIds) {
    await prisma.equipos_stats.upsert({
      where:  { equipoId_ligaId: { equipoId, ligaId } },
      update: {},
      create: { equipoId, ligaId },
    })
  }

  console.log(`[ClasificacionWrapper] Inicializados equipos_stats para ligaId=${ligaId} (${equipoIds.length} equipos)`)
}

export async function ClasificacionWrapper({ searchParams }: Props) {
  const params = await searchParams

  const ligas = await prisma.ligas.findMany({
    orderBy: [{ temporada: 'asc' }, { fase: 'asc' }],
    select:  { id: true, temporada: true, fase: true },
  })

  if (!ligas.length) return (
    <div className="container mx-auto p-6 text-center opacity-60">
      No hay ligas disponibles
    </div>
  )

  const temporadaParam = params?.temporada as Temporada | undefined
  const faseParam      = params?.fase      as Fase      | undefined

  const ligaSeleccionada =
    ligas.find(l => l.temporada === temporadaParam && l.fase === faseParam) ??
    ligas[0]

  // Si no hay stats para esta liga, las inicializamos automáticamente
  const countStats = await prisma.equipos_stats.count({
    where: { ligaId: ligaSeleccionada.id },
  })

  if (countStats === 0) {
    await initEquiposStats(ligaSeleccionada.id)
  }

  const equipos_stats = await prisma.equipos_stats.findMany({
    where:   { ligaId: ligaSeleccionada.id },
    include: { equipo: true },
    orderBy: [{ puntos: 'desc' }, { diferenciaGoles: 'desc' }],
  })

  return (
    <div className="container mx-auto p-6">
      <TablaClasif
        equiposConStats={equipos_stats}
        ligas={ligas}
        temporadaActual={ligaSeleccionada.temporada}
        faseActual={ligaSeleccionada.fase}
      />
    </div>
  )
}