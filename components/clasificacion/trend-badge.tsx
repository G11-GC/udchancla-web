import { prisma } from '@/lib/prisma-singleton'
import { Equal, TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface TrendBadgeProps {
  equipoId: number
  ligaId:   number
  className?: string
}

type Trend = 'up' | 'down' | 'neutral' | 'unknown'

function calcTrend(results: ('W' | 'L' | 'D')[]): Trend {
  if (!results.length) return 'unknown'
  const wins   = results.filter(r => r === 'W').length
  const losses = results.filter(r => r === 'L').length
  if (wins > losses)   return 'up'
  if (losses > wins)   return 'down'
  return 'neutral'
}

export default async function TrendBadge({ equipoId, ligaId, className }: TrendBadgeProps) {
  // Últimos 3 partidos del equipo en esta liga con su resultado
  const partidos = await prisma.partidos.findMany({
    where: {
      ligaId,
      OR: [{ equipoAId: equipoId }, { equipoBId: equipoId }],
      partidos_stats: { some: { resultado: { not: null } } },
    },
    orderBy: { fecha: 'desc' },
    take:    3,
    select: {
      equipoAId:     true,
      equipoBId:     true,
      partidos_stats: { select: { resultado: true } },
    },
  })

  const results = partidos.map(p => {
    const stats     = p.partidos_stats[0]
    const resultado = stats?.resultado
    if (!resultado) return null

    const esLocal = p.equipoAId === equipoId
    if (resultado === 'EMPATE') return 'D' as const
    if ((resultado === 'A' && esLocal) || (resultado === 'B' && !esLocal)) return 'W' as const
    return 'L' as const
  }).filter(Boolean) as ('W' | 'L' | 'D')[]

  const trend = calcTrend(results)

  const config = {
    up:      { badge: 'badge-success', icon: <TrendingUp  className="w-3 h-3 md:w-4 md:h-4" /> },
    down:    { badge: 'badge-error',   icon: <TrendingDown className="w-3 h-3 md:w-4 md:h-4" /> },
    neutral: { badge: 'badge-warning', icon: <Equal        className="w-3 h-3 md:w-4 md:h-4" /> },
    unknown: { badge: 'badge-ghost',   icon: <Minus        className="w-3 h-3 md:w-4 md:h-4" /> },
  }

  const { badge, icon } = config[trend]

  return (
    <div
      className={`badge badge-sm md:badge-lg ${badge} ${className ?? ''}`}
      title={results.map(r => r === 'W' ? 'V' : r === 'L' ? 'D' : 'E').join(' ')}
    >
      {icon}
    </div>
  )
}