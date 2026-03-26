import type { equipos, equipos_stats } from '@prisma/client'
import { TableProperties, ChevronsUp } from 'lucide-react'
import EquipoClasificacion from './equipo-clasificacion'
import LigaSelector from './liga-selector'
import { Suspense } from 'react'

type EquipoConStats = equipos_stats & { equipo: equipos }

interface Liga {
  id:        number
  temporada: string
  fase:      string
}

const SEPARADOR_LABELS: Record<string, string> = {
  PRIMERA:  'Fase de campeones',
  SEGUNDA:  'Clasificados',
  VERANO:   'Clasificados',
  AMISTOSO: '—',
  OTRO:     '—',
}

interface TablaClasifProps {
  equiposConStats: EquipoConStats[]
  ligas:           Liga[]
  temporadaActual: string
  faseActual:      string
}

export function TablaClasif({ equiposConStats, ligas, temporadaActual, faseActual }: TablaClasifProps) {
  const equiposOrdenados = [...equiposConStats].sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos
    return b.diferenciaGoles - a.diferenciaGoles
  })

  return (
    <ul className="list bg-base-100/50 rounded-box shadow-lg w-full">
      {/* Cabecera */}
      <li className="p-4 md:p-3 text-sm tracking-wide border-b border-base-300 w-full">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-3 md:gap-5">
            <TableProperties className="w-5 h-5 md:w-6 md:h-6 opacity-60" />
            <h1 className="text-lg md:text-xl font-bold text-base-content">Clasificación</h1>
          </div>

          {/* Selectores en el lugar donde antes estaban "Temporada 2025-2026" y "Fase 1" */}
          <Suspense>
            <LigaSelector
              ligas={ligas}
              temporadaActual={temporadaActual}
              faseActual={faseActual}
            />
          </Suspense>
        </div>
      </li>

      <div className="bg-accent/5 rounded-t-lg border-l border-r border-t border-accent">
        {equiposOrdenados.slice(0, 6).map((equipo, index) => (
          <EquipoClasificacion equipo={equipo} index={index} key={equipo.id} />
        ))}
      </div>

      {/* Separador */}
      <li className="p-4 rounded-b-lg border-l border-r border-b border-accent bg-accent/5">
        <div className="text-center justify-center items-center flex gap-2 text-lg md:text-xl font-bold text-accent">
          <ChevronsUp />
          {SEPARADOR_LABELS[faseActual] ?? 'Clasificados'}
          <ChevronsUp />
        </div>
      </li>

      {equiposOrdenados.slice(6, 12).map((equipo, index) => (
        <EquipoClasificacion equipo={equipo} index={index + 6} key={equipo.id} />
      ))}
    </ul>
  )
}