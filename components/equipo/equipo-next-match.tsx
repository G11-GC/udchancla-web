import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Escudo from '@/components/partidos/match-badge'
import RachaDetail from './racha-detail'
import MatchDate from '@/lib/partidos/match-date'
import { ChevronRight, Calendar } from 'lucide-react'

interface Equipo { id: number; nombre: string; escudo?: string | null }

interface NextMatch {
  id:            number
  jornada:       number | null
  fecha:         Date
  instalaciones: string
  campo:         number
  equipoAId:     number
  equipoBId:     number
  ligaId:        number
  equipos_partidosA: Equipo
  equipos_partidosB: Equipo
}

interface Props {
  nextMatch: NextMatch
  equipoId:  number
}

export default function EquipoNextMatch({ nextMatch, equipoId }: Props) {
  const esLocal   = nextMatch.equipoAId === equipoId
  const rival     = esLocal ? nextMatch.equipos_partidosB : nextMatch.equipos_partidosA
  const [dia, hora] = MatchDate(nextMatch.fecha) ?? ['', '']

  return (
    <div className="card bg-base-200/50 card-border border-primary/30">
      <div className="card-body gap-4">
        <h2 className="card-title text-sm uppercase opacity-60 tracking-wider">Próximo partido</h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Nuestro equipo */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <Escudo nombre={esLocal ? nextMatch.equipos_partidosA.nombre : nextMatch.equipos_partidosB.nombre}
                    escudo={esLocal ? nextMatch.equipos_partidosA.escudo : nextMatch.equipos_partidosB.escudo}
                    size="lg" />
            <span className="font-bold text-sm text-center">
              {esLocal ? nextMatch.equipos_partidosA.nombre : nextMatch.equipos_partidosB.nombre}
            </span>
            <Suspense fallback={<div className="flex gap-1">{Array(5).fill(0).map((_, i) => <div key={i} className="w-7 h-7 rounded-full bg-neutral/20 animate-pulse" />)}</div>}>
              <RachaDetail equipoId={equipoId} ligaId={nextMatch.ligaId} take={5} />
            </Suspense>
          </div>

          {/* VS + info */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <div className="absolute inset-0 opacity-20">
                <Image src="/icons/ball.svg" alt="" fill className="object-contain" />
              </div>
              <span className="relative z-10 text-white font-black text-sm">VS</span>
            </div>
            <div className="text-xs opacity-60 text-center">
              <div className="flex items-center gap-1 capitalize"><Calendar size={12} />{dia} · {hora}</div>
              <div>J{nextMatch.jornada} · {nextMatch.instalaciones.replaceAll('_', ' ')}</div>
            </div>
          </div>

          {/* Rival */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <Escudo nombre={rival.nombre} escudo={rival.escudo} size="lg" />
            <span className="font-bold text-sm text-center">{rival.nombre}</span>
            <Suspense fallback={<div className="flex gap-1">{Array(5).fill(0).map((_, i) => <div key={i} className="w-7 h-7 rounded-full bg-neutral/20 animate-pulse" />)}</div>}>
              <RachaDetail equipoId={rival.id} ligaId={nextMatch.ligaId} take={5} />
            </Suspense>
          </div>
        </div>

        <div className="card-actions justify-end">
          <Link href={`/partidos/${nextMatch.id}`} className="btn btn-primary btn-sm">
            Ver partido <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}