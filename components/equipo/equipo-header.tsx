import { equipos, equipos_stats } from '@prisma/client'
import Image from 'next/image'
import { Suspense } from 'react'
import LigaSelector from '@/components/clasificacion/liga-selector'

interface Liga { id: number; temporada: string; fase: string }

const FASE_LABELS: Record<string, string> = {
  PRIMERA: 'Fase 1', SEGUNDA: 'Fase 2', VERANO: 'Verano', AMISTOSO: 'Amistoso', OTRO: 'Otro',
}

interface Props {
  equipo:          equipos
  stats:           equipos_stats | null
  posicion:        number | null
  ligas:           Liga[]
  temporadaActual: string
  faseActual:      string
}

export default function EquipoHeader({ equipo, stats, posicion, ligas, temporadaActual, faseActual }: Props) {
  return (
    <div className="card bg-base-200/50 card-border border-base-300">
      <div className="card-body">
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* Escudo */}
          <div className="shrink-0">
            {equipo.escudo ? (
              <Image
                src={`/images/${equipo.escudo}`}
                alt={equipo.nombre}
                width={100}
                height={100}
                className="rounded-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-neutral/20 flex items-center justify-center">
                <span className="text-3xl font-bold">{equipo.nombre.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold">{equipo.nombre}</h1>

            {/* Selector único (ya incluye temporada y fase) */}
            <div className="mt-1 justify-center sm:justify-start flex">
              <Suspense>
                <LigaSelector ligas={ligas} temporadaActual={temporadaActual} faseActual={faseActual} />
              </Suspense>
            </div>

            {/* Stats resumen */}
            {stats ? (
              <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{posicion ? `${posicion}º` :'—'}</div>
                  <div className="text-xs uppercase opacity-60">{FASE_LABELS[faseActual] ?? faseActual}</div>
                </div>
                <div className="divider divider-horizontal" />
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.puntos}</div>
                  <div className="text-xs uppercase opacity-60">Puntos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.partidosJugados}</div>
                  <div className="text-xs uppercase opacity-60">PJ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{stats.victorias}</div>
                  <div className="text-xs uppercase opacity-60">V</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.empates}</div>
                  <div className="text-xs uppercase opacity-60">E</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-error">{stats.derrotas}</div>
                  <div className="text-xs uppercase opacity-60">D</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${stats.diferenciaGoles > 0 ? 'text-success' : stats.diferenciaGoles < 0 ? 'text-error' : ''}`}>
                    {stats.diferenciaGoles > 0 ? '+' : ''}{stats.diferenciaGoles}
                  </div>
                  <div className="text-xs uppercase opacity-60">DG</div>
                </div>
              </div>
            ) : (
              <p className="text-sm opacity-60 mt-2">Sin estadísticas en esta fase</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}