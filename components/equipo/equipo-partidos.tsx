import MatchCard from '@/components/partidos/match-card'
import { Suspense } from 'react'
import LoadingMain from '../loaders-anim/loading-main'

interface PartidoStats {
  golesA:    number | null
  golesB:    number | null
  resultado: string | null
}

interface PartidoEquipo {
  nombre: string
  escudo?: string | null
}

interface Partido {
  id:            number
  jornada:       number | null
  fecha:         Date
  instalaciones: string
  campo:         number
  equipoAId:     number
  equipoBId:     number
  equipos_partidosA: PartidoEquipo
  equipos_partidosB: PartidoEquipo
  partidos_stats:    PartidoStats[]
}

interface Props {
  partidos: Partido[]
  equipoId: number
}

export default function EquipoPartidos({ partidos, equipoId }: Props) {
  const jugados    = partidos.filter(p => p.partidos_stats[0]?.resultado)
  const pendientes = partidos.filter(p => !p.partidos_stats[0]?.resultado && new Date(p.fecha) > new Date())

  return (
    <div className="flex flex-col gap-6">
      {jugados.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 opacity-70 uppercase tracking-wider text-sm">Partidos jugados</h2>
          <Suspense fallback={<LoadingMain/>}></Suspense>
            <div className="flex flex-wrap gap-4">
              {[...jugados].reverse().map(p => (
                <MatchCard
                  key={p.id}
                partido={p}
                showResult
                hideLogistica
                equipoDestacadoId={equipoId}
              />
            ))}
          </div>
          <Suspense/>  
        </section>
      )}

      {pendientes.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 opacity-70 uppercase tracking-wider text-sm">Próximos partidos</h2>
          <div className="flex flex-wrap gap-4">
            {pendientes.map(p => (
              <MatchCard
                key={p.id}
                partido={p}
                showResult={false}
                hideLogistica={false}
                equipoDestacadoId={equipoId}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}