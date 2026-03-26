import { prisma } from "@/lib/prisma-singleton";

export async function getEquipoId(nombre: string) {
  const equipo = await prisma.equipos.findFirst({
    where: { nombre },
    select: { id: true }
  });
  if (!equipo) return null;
  return equipo.id;
}

export async function getAllEquipoData(idEquipo: number) {
  const equipo = await prisma.equipos.findUnique({
    where: { id: idEquipo },
    include: { equipos_stats: true }
  });
  if (!equipo) return null;
  return equipo;
}

export async function getEquipos_stats(ligaId: number) {
  const equipos_stats = await prisma.equipos_stats.findMany({
    where: { ligaId },
    include: { equipo: true }
  });
  return equipos_stats;
}

export async function getPosicionEquipo(idEquipo: number, ligaId: number) {
  const miStats = await prisma.equipos_stats.findFirst({
    where: { equipoId: idEquipo, ligaId }
  });
  if (!miStats) return null;

  const puestosPorEncima = await prisma.equipos_stats.count({
    where: {
      ligaId,
      OR: [
        { puntos: { gt: miStats.puntos } },
        {
          AND: [
            { puntos: miStats.puntos },
            { diferenciaGoles: { gt: miStats.diferenciaGoles } }
          ]
        }
      ]
    }
  });

  return puestosPorEncima + 1;
}