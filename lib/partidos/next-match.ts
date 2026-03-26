import { prisma } from '@/lib/prisma-singleton'
import { partidos, equipos } from '@prisma/client'

export type NextMatchResult = Partial<partidos> & {
  equipos_partidosA: Pick<equipos, 'nombre' | 'escudo'>
  equipos_partidosB: Pick<equipos, 'nombre' | 'escudo'>
}

export default async function getNextMatch(): Promise<NextMatchResult | null> {
  const currentDateTime = new Date()

  try {
    const nextMatch = await prisma.partidos.findFirst({
      select: {
        id:            true,
        jornada:       true,
        fecha:         true,
        instalaciones: true,
        campo:         true,
        equipos_partidosA: { select: { nombre: true, escudo: true } },
        equipos_partidosB: { select: { nombre: true, escudo: true } },
      },
      where: {
        fecha: { gt: currentDateTime },
        OR: [
          { equipos_partidosA: { nombre: 'UD Chancla' } },
          { equipos_partidosB: { nombre: 'UD Chancla' } },
        ],
      },
      orderBy: { fecha: 'asc' },
    })

    return nextMatch as NextMatchResult | null
  } catch (error) {
    console.error(error)
    return null
  }
}