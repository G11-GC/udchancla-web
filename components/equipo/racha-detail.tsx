import { prisma } from '@/lib/prisma-singleton'

interface Props {
  equipoId: number
  ligaId:   number
  take?:    number
}

export default async function RachaDetail({ equipoId, ligaId, take = 5 }: Props) {
  const partidos = await prisma.partidos.findMany({
    where: {
      ligaId,
      OR: [{ equipoAId: equipoId }, { equipoBId: equipoId }],
      partidos_stats: { some: { resultado: { not: null } } },
    },
    orderBy: { fecha: 'desc' },
    take,
    select: {
      equipoAId:      true,
      equipoBId:      true,
      equipos_partidosA: { select: { nombre: true } },
      equipos_partidosB: { select: { nombre: true } },
      partidos_stats: { select: { golesA: true, golesB: true, resultado: true } },
    },
  })

  if (!partidos.length) {
    return <span className="text-xs opacity-50">Sin partidos</span>
  }

  return (
    <div className="flex items-center gap-1">
      {[...partidos].reverse().map((p, i) => {
        const stats     = p.partidos_stats[0]
        const resultado = stats?.resultado
        const esLocal   = p.equipoAId === equipoId
        const rival     = esLocal ? p.equipos_partidosB.nombre : p.equipos_partidosA.nombre
        const gF        = esLocal ? stats?.golesA : stats?.golesB
        const gC        = esLocal ? stats?.golesB : stats?.golesA

        let color  = 'bg-warning text-warning-content'
        let letra  = 'E'
        if (resultado === 'A' && esLocal)  { color = 'bg-success text-success-content'; letra = 'V' }
        if (resultado === 'B' && !esLocal) { color = 'bg-success text-success-content'; letra = 'V' }
        if (resultado === 'A' && !esLocal) { color = 'bg-error text-error-content';     letra = 'D' }
        if (resultado === 'B' && esLocal)  { color = 'bg-error text-error-content';     letra = 'D' }
        if (resultado === 'A_NO_PRESENTADO' || resultado === 'B_NO_PRESENTADO') {
          color = 'bg-neutral text-neutral-content'; letra = 'NP'
        }

        return (
          <div
            key={i}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${color} cursor-default`}
            title={`vs ${rival} ${gF ?? '?'}-${gC ?? '?'}`}
          >
            {letra}
          </div>
        )
      })}
    </div>
  )
}